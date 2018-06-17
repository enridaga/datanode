#!/usr/bin/env ruby


require 'rubygems'
require 'set'
require 'trollop'
require 'rdf'
require 'cgi'
require 'rdf/raptor'
require 'yaml'
load 'gentree.rb'

class Dia

  
	def initialize(file, schema, modifier)
		@schema = schema
    @labelStyle = 'prefixed' # or 'mixed'
    @ress = Set.new
		@tree = {}
    @modifier = modifier
		RDF::Reader.open(file) do |reader|
			reader.each_statement do |st|
				if !@tree.include? st.subject.to_s
					@tree[st.subject.to_s] = {}
				end
				if !@tree[st.subject.to_s].include? st.predicate.to_s
					@tree[st.subject.to_s][st.predicate.to_s] = []
				end
				@tree[st.subject.to_s][st.predicate.to_s].push st.object.to_s
        @ress.add st.subject.to_s
        @ress.add st.predicate.to_s
        if st.object.kind_of?(RDF::Resource)
          @ress.add st.object.to_s
        end
			end
		end
	end
	
  def labelStyle
    @labelStyle || 'prefixed'
  end
  
  def prefixed(o)
		prefix = {
			"http://yago-knowledge.org/resource/" => "yago",
			"http://www.w3.org/1999/02/22-rdf-syntax-ns#" => "rdf",
			"http://xmlns.com/foaf/0.1/" => "foaf",
			"http://dbpedia.org/property/" => "dbp",
			"http://www.w3.org/2002/07/owl#" => "owl",
			"http://purl.org/dc/elements/1.1/" => "dc",
			"http://www.w3.org/2000/01/rdf-schema#" => "rdfs",
			"http://dbpedia.org/ontology/" => "dbo",
			"http://purl.org/rss/1.0/" => "rss",
			"http://www.w3.org/2004/02/skos/core#" => "skos",
			"http://rdfs.org/ns/void#" => "void",
			"http://purl.org/datanode/ns/" => "dn",
			"http://purl.org/datanode/ex/" => "ex",
			"http://purl.org/dc/terms/" => "dct",
		}
		prefix.each do |ns, pref|
			if o.start_with?(ns) then
				localp = ""
				if o.include?("#") then
					localp = o[o.index("#")+1, o.length]
				else
					localp = o[o.rindex("/")+1, o.length]
				end
				return "#{pref}:#{localp}"
			end
		end
		return o
  end
  
  def localname(o)
		if o.include?("#") then
      return o[o.index("#")+1, o.length]
    else 
      if o.include?("/") then
			  return o[o.rindex("/")+1, o.length]
      else
        return o
      end
		end
  end
  
	def label(o, useHtml = false)
		if !@schema.tree.include?(o) then 
			if o.start_with? "http" then
				return prefixed o
      else
        if o.start_with? "_:" then
          return o.to_s
        else
				  # This is a value
          if useHtml == true then
				    html = o.gsub(/([^\.?!]{20,30}[\.?!])|([^,0-9]{20,30},)/, '\0<br/>').gsub(/[0-9]{1,3}\)/, '<br/>\0')
            html = CGI.escapeHTML(html);
            html = "<html>#{html}</html>"
				    html = html.gsub(/\</,'&lt;').gsub(/\>/,'&gt;')
				    return html
          else
            return o
          end
        end
			end
		end
		vals = @schema.tree[o]
    if labelStyle == 'prefixed' then return prefixed(o) end
    # take the label from the vocabulary 
		return vals.include?("http://www.w3.org/2000/01/rdf-schema#label") ? vals["http://www.w3.org/2000/01/rdf-schema#label"].first : nil
	end
	
	def entities
    #ents = Set.new
    ents = Array.new
		@tree.each do |s,ps|
      # we skip foaf:Document
		  if @tree[s]['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'] && @tree[s]['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'].include?('http://xmlns.com/foaf/0.1/Document') then
        # do nothing
      else
			  #ents.add s
        if !(ents.include? s) then
          ents.push s  
        end
			  ps.each do |p, vals|
				  vals.each do |v| 
            if !(ents.include? v) then
					    if @modifier == 'all' or @ress.include? v then
                ents.push v
              end
            end
				  end
			  end
      end
		end
		return ents
	end
	
  def graphml()
			puts "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>"
			puts "<graphml \n\txmlns=\"http://graphml.graphdrawing.org/xmlns\" "
			puts "\txmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
			puts "\txmlns:y=\"http://www.yworks.com/xml/graphml\" "
			puts "\txmlns:yed=\"http://www.yworks.com/xml/yed/3\" "
			puts "\txsi:schemaLocation=\"http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd\">"
			puts "\t\t<key attr.name=\"label\" attr.type=\"string\" for=\"node\" id=\"k_label\"/>"
			puts "\t\t<key for=\"node\" id=\"key_nodegraphics\" yfiles.type=\"nodegraphics\"/>"
			puts "\t\t<key for=\"edge\" id=\"key_edgegraphics\" yfiles.type=\"edgegraphics\"/>"
			#puts "<key attr.name=\"description\" attr.type=\"string\" for=\"node\" id=\"d5\"/>"
			
			puts "\t<graph edgedefault=\"directed\" id=\"G\">"
			
			entities.each do |node|
				puts "<!-- #{node} -->"
				nodel = label(localname(node), true)
				puts "<!-- #{nodel} -->"
				puts "\t\t<node id=\"n#{node.hash}\">"
				puts "\t\t\t<data key=\"k_label\"><![CDATA[#{node}]]></data>"
				puts "\t\t\t<data key=\"d5\"><![CDATA[#{node}]]></data>"
				puts "\t\t\t<data key=\"key_nodegraphics\">"
        		puts "\t\t\t\t<y:GenericNode configuration=\"com.yworks.flowchart.start1\">"
          		puts "\t\t\t\t\t<y:Fill color=\"#FFFFFF\" transparent=\"true\"/>"
          		puts "\t\t\t\t\t<y:BorderStyle color=\"#FFFFFF\" transparent=\"true\" type=\"line\" width=\"0.0\"/>"
          		puts "\t\t\t\t\t<y:NodeLabel "
				print ">#{nodel}<y:LabelModel><y:SmartNodeLabelModel distance=\"4.0\"/></y:LabelModel> "
				print "<y:ModelParameter> "
				print "<y:SmartNodeLabelModelParameter "
				print "/>"
				print "</y:ModelParameter>"
				print "</y:NodeLabel>"
        		puts "\t\t\t\t</y:GenericNode>"
				puts "\t\t\t</data>"
				puts "\t\t</node>"
			end
			@tree.each do |node, links|
				if entities.include? node then
				  edgeId=0
				  # parents
				  links.each do |link, to|
					  to.each do |o|
					    puts "<!-- #{to} -->"
						  edgeId = node.hash.to_s + "_" + link.hash.to_s + "_" + o.hash.to_s
						  edgel = label link, true
						  puts "\t\t<edge id=\"e_#{edgeId}\" source=\"n#{node.hash}\" target=\"n#{o.hash}\">"
						  puts "\t\t\t<data key=\"key_edgegraphics\">"
				      puts "\t\t\t<y:BezierEdge>"
						  puts "\t\t\t\t<y:LineStyle color=\"#000000\" type=\"line\" width=\"2.0\"/>"
              puts "\t\t\t\t<y:Arrows source=\"none\" target=\"white_delta\"/>"
					    puts "\t\t\t\t<y:EdgeLabel>#{edgel}</y:EdgeLabel>"
						  puts "\t\t\t</y:BezierEdge>"
						  puts "\t\t\t</data>"
						  puts "\t\t</edge>"
					  end
				  end
        end
			end
			
			puts "\t</graph>"
			puts "</graphml>"
	end
  
  def jsembed(o)
    return o.to_s.gsub("\"", "\\\"")
  end
  
  def jsobject()
    print "["
    ents = entities
    for index in 0...ents.size 
      node=ents[index]
      puts "{ "
      ix=index
      lbl=label node
      puts "\tid: \"#{jsembed ix}\","
      puts "\turi: \"#{jsembed node}\","
      puts "\tlabel: \"#{jsembed lbl}\","
      print "\tlinks: ["
			@tree.each do |n, links|
				if n == node then
			  links.each do |link, to|
			 to.each do |o|
         if ents.include? o then
            puts "{"
            tg=ents.index o
            puts "\t\ttarget: #{tg},"
					  edgel = label link
            puts "\t\tlabel: \"#{edgel}\","
            puts "\turi: \"#{link.to_s}\","
            puts "\t\ttype: \"default\","
            puts "\t\tweight: 1,"
            print "\t},"
          end
          end
      end
    end
  end
      puts "],"
      print "},"
  end
    puts "]"
  end
	
end

if __FILE__ == $0

	opts = Trollop::options do
    version "Voctoys 1.0.0 (c) 2013 Enrico Daga"
	  opt :file, "RDF file", :short => "-f", :type => :string
	  opt :voc, "RDF vocabulary", :short => "-v", :type => :string
	  opt :output, "Output format: graphml|js", :short => "-o", :type => :string
	  opt :modifier, "Modifier: links|all", :short => "-m", :type => :string, :default => "all"
	end
	
	Trollop::die :file, "must exist" unless File.exist?(opts[:file]) if opts[:file]

  $stdout.sync = true

	file = opts[:file]
	voc = opts[:voc]
  output = opts[:output]
  modifier = opts[:modifier]
	vok = Vok.new voc
	dia = Dia.new file, vok, modifier
  if output == 'graphml' then
    dia.graphml
  end
  if output == 'js' then
    puts "var nodes="
    dia.jsobject
  end
end
