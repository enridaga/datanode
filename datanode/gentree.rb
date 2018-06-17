#!/usr/bin/env
#
#
#
# Thanks to
# http://trollop.rubyforge.org/
# https://www.ruby-lang.org/en/documentation/quickstart/3/
# http://rdf.rubyforge.org/raptor/

require 'rubygems'
require 'set'
require 'trollop'
require 'rdf'
require 'rdf/raptor'
require 'yaml'

class Vok

	attr_accessor :tree

	def initialize(file, root = '')
		@tree = {}
    @root = root
		RDF::Reader.open(file) do |reader|
			reader.each_statement do |st|
				if !@tree.include? st.subject.to_s
					@tree[st.subject.to_s] = {}
				end
				if !@tree[st.subject.to_s].include? st.predicate.to_s
					@tree[st.subject.to_s][st.predicate.to_s] = []
				end
				@tree[st.subject.to_s][st.predicate.to_s].push st.object.to_s
			end
		end
	end
	
	def label(uri)
		if !@tree.include?(uri) then raise end
		vals = @tree[uri]
		l = vals.include?("http://www.w3.org/2000/01/rdf-schema#label") ? vals["http://www.w3.org/2000/01/rdf-schema#label"].first : "?"
		flags = ""
		if symmetric uri then flags = flags + "S" end
		if asymmetric uri then flags = flags + "A" end
		if transitive uri then flags = flags + "T" end
		if reflexive uri then flags = flags + "R" end
		if functional uri then flags = flags + "F" end
		if inversefunctional uri then flags = flags + "I" end
		if irreflexive uri then flags = flags + "X" end
		
		if flags != "" then l = l + " [" + flags + "] " end
		return l
	end
	
	def isProperty(uri)
		vals = @tree[uri]
		if vals.include?("http://www.w3.org/2000/01/rdf-schema#subPropertyOf") 
			return true
		end
		ptypes = [
			"http://www.w3.org/2002/07/owl#ObjectProperty", 
			"http://www.w3.org/2002/07/owl#SymmetricProperty",
			"http://www.w3.org/2002/07/owl#TransitiveProperty",
			"http://www.w3.org/2002/07/owl#FunctionalProperty",
			"http://www.w3.org/2002/07/owl#InverseFunctionalProperty",
			"http://www.w3.org/2002/07/owl#SymmetricProperty", 
			"http://www.w3.org/2002/07/owl#ReflexiveProperty"
		]
		#if !vals.include?("http://www.w3.org/1999/02/22-rdf-syntax-ns#type") 
		#	return false
		#end
		#types = vals["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]
		types(uri).each do |pt|
			if ptypes.include? pt
				return true
			end
		end
		return false
	end
	
	def types(uri)
		tset = Set.new
		if @tree[uri].include?("http://www.w3.org/1999/02/22-rdf-syntax-ns#type")
			types = @tree[uri]["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]
			types.each do |pt|
				tset.add pt
			end
		end
		return tset
	end
	
	def symmetric(uri)
		return types(uri).include?("http://www.w3.org/2002/07/owl#SymmetricProperty")
	end
	
	def asymmetric(uri)
		return types(uri).include?("http://www.w3.org/2002/07/owl#AsymmetricProperty")
	end
	
	def transitive(uri)
		return types(uri).include?("http://www.w3.org/2002/07/owl#TransitiveProperty")
	end
	def functional(uri)
		return types(uri).include?("http://www.w3.org/2002/07/owl#FunctionalProperty")
	end
	def inversefunctional(uri)
		return types(uri).include?("http://www.w3.org/2002/07/owl#InverseFunctionalProperty")
	end
	
	def reflexive(uri)
		return types(uri).include?("http://www.w3.org/2002/07/owl#ReflexiveProperty")
	end
	
	def irreflexive(uri)
		return types(uri).include?("http://www.w3.org/2002/07/owl#IrreflexiveProperty")
	end
	
	def properties
		pset = Set.new
    if !@root.eql?('') then
      pset.add @root
      appendChildren(@root, pset)
      return pset
    end
		@tree.each do |k, v|
			#plabel = label k
			if isProperty k
				pset.add k
			end
		end
		return pset
	end
  
  def appendChildren(p, pset)
    children(p).each do |cp| 
      pset.add cp 
      appendChildren cp, pset
    end
  end
	
	def plabels
		lset = Set.new
		properties.each do |p|
			plabel = label p
			lset.add plabel
		end
		return lset
	end
	
	def parents(uri)
		if !@tree.include?(uri) then raise end
		vals = @tree[uri]
		pset = Set.new
		if vals.include?("http://www.w3.org/2000/01/rdf-schema#subPropertyOf") 
			vals["http://www.w3.org/2000/01/rdf-schema#subPropertyOf"].each do |p|
				pset.add p
			end
		end
		pset.delete(uri)
		return pset
	end
	
	def children(uri)
		if !@tree.include?(uri) then raise end

		pset = Set.new
		@tree.each do |k, v|
			vals = @tree[k]
			if vals.include?("http://www.w3.org/2000/01/rdf-schema#subPropertyOf") 
				vals["http://www.w3.org/2000/01/rdf-schema#subPropertyOf"].each do |p|
					if p == uri then pset.add k end
				end
			end
		end
		pset.delete(uri)
		return pset
	end
	
	def inverses(uri)
		if !@tree.include?(uri) then 
      raise "Invalid URI #{uri}"  
    end
		vals = @tree[uri]
		pset = Set.new
		# check inverses
		@tree.each do |k, v|
			if @tree[k].include?("http://www.w3.org/2002/07/owl#inverseOf")
				@tree[k]["http://www.w3.org/2002/07/owl#inverseOf"].each do |p|
					if uri == k
						pset.add p
					else
						if p == uri
							pset.add k
						end
					end
				end
			end
		end
		return pset
	end
	
	def rootProperties
		pset = Set.new
    if !@root.eql?('') then
      pset.add @root
      return pset
    end
		properties.each do |p|
			if parents(p).empty?
				pset.add p
			end
		end
		return pset
	end
	
	def rootNodes
		rn = Set.new
		rootProperties.each do |p|
			rn.add (Node.new self, p)
		end
		return rn
	end
	
	def nodes
		nset = Set.new
		properties.each do |p| nset.add(Node.new self, p) end
		return nset      
	end
  
	def parentNodes node
		aset = Set.new
		node.uris.each do |p|
			parents(p).each do |pn|
				aset.add(Node.new self, pn)
			end
		end
		return aset
	end
	
	def childrenNodes node
		aset = Set.new
		node.uris.each do |p|
			children(p).each do |ch|
				aset.add(Node.new self, ch)
			end
		end
		return aset
	end
  
	def printHierarchy (node = nil, level = 0)
		if block_given?
			yield(node, level)
		else
			printHierarchy(node, level) do |node, level|
					puts "-"*level + "-" + node.to_s 
					level = level + 1
					childrenNodes(node).each do |n|
						printHierarchy(n, level)
					end
				end
		end
	end
	
	def printTree
		rootNodes.each do |p| 
			printHierarchy p, 0
		end
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
			
			rootNodes.each do |node|
				printGraphMLNode(node)
				printChildrenNodes(node)
			end
			
			puts "\t</graph>"
			
			puts "</graphml>"
	end
	
  def printChildrenNodes(node)
		childrenNodes(node).each do |pnode|
			printGraphMLNode(pnode)
      printGraphMLEdge(pnode.hash.to_s, node.hash.to_s)
      printChildrenNodes(pnode)
		end
  end
  
  def printGraphMLEdge(source, target)
		edgeId = source + "_" + target
		puts "\t\t<edge id=\"e_#{edgeId}\" source=\"n#{source}\" target=\"n#{target}\">"
		puts "\t\t\t<data key=\"key_edgegraphics\">"
		puts "\t\t\t<y:BezierEdge>"
		puts "\t\t\t\t<y:LineStyle color=\"#000000\" type=\"line\" width=\"2.0\"/>"
    			puts "\t\t\t\t<y:Arrows source=\"none\" target=\"white_delta\"/>"
  			puts "\t\t\t</y:BezierEdge>"
		puts "\t\t\t</data>"
		puts "\t\t</edge>"
  end
  
  def printGraphMLNode(node)
		puts "\t\t<node id=\"n#{node.hash}\">"
		puts "\t\t\t<data key=\"k_label\"><![CDATA[#{node}]]></data>"
		puts "\t\t\t<data key=\"d5\"><![CDATA[#{node}]]></data>"
		puts "\t\t\t<data key=\"key_nodegraphics\">"
    		puts "\t\t\t\t<y:GenericNode configuration=\"com.yworks.flowchart.start1\">"
      		puts "\t\t\t\t\t<y:Fill color=\"#FFFFFF\" transparent=\"true\"/>"
      		puts "\t\t\t\t\t<y:BorderStyle color=\"#FFFFFF\" transparent=\"true\" type=\"line\" width=\"0.0\"/>"
      		puts "\t\t\t\t\t<y:NodeLabel "
		print ">#{node}<y:LabelModel><y:SmartNodeLabelModel distance=\"4.0\"/></y:LabelModel> "
		print "<y:ModelParameter> "
		print "<y:SmartNodeLabelModelParameter "
		print "/>"
		print "</y:ModelParameter>"
		print "</y:NodeLabel>"
    		puts "\t\t\t\t</y:GenericNode>"
		puts "\t\t\t</data>"
		puts "\t\t</node>"
  end
  
  def jsembed(o)
    return o.to_s.gsub("\"", "\\\"")
  end
  
  
  def jsobject()

     ents = Array.new
     nodes.each do |node|
       ents.push node.to_s
     end
     print "["
    nodes.each do |node|
      ix = ents.index node.to_s
      puts "{ "
      lbl=node.to_s
      puts "\tid: \"#{jsembed ix}\","
      puts "\turi: \"#{jsembed node}\","
      puts "\tlabel: \"#{jsembed lbl}\","
      print "\tlinks: ["
      childrenNodes(node).each do |pnode|
        puts "{"
        tg=ents.index pnode.to_s
        puts "\t\ttarget: #{tg},"
			  edgel = ""
        puts "\t\tlabel: \"#{edgel}\","
        puts "\t\ttype: \"default\","
        puts "\t\tweight: 1,"
        print "\t},"
      end
      puts "],"
      print "},"
      
    end
    puts "]"
    
  end
  
  def printJsTreeNode(n, level=0)
    puts "{ "
    print "\"name\": \"#{n.to_s}\", "
    cns = childrenNodes(n)
    if !cns.empty?
      print "\"children\": ["
    cns.each do |cn|
      printJsTreeNode cn
      print ","
    end
    print "]"
    end
    puts "}"
  end
  
  def jstreeobject()
     root = nil
     rootNodes.each do |r| root=r end
     printJsTreeNode root
  end
  
	class Node
		def initialize(vok, uri)
			@vok = vok
			set uri
		end
		
		def set(uri)
			@uris = SortedSet.new 
			@uris.add uri
			@vok.inverses(uri).each do |i| @uris.add(i) end
			@label = nodeName
		end
		
		def uris
			return @uris
		end
		
		def to_s
			return @label
		end
		
		def eql?(o)
			return o.to_s == self.to_s
		end
		
		def hash
			to_s.hash
		end
		
		private
		def nodeName
      begin
			  lset = SortedSet.new
			  @uris.each do |u|
			    lset.add(@vok.label u)
			  end
        n = lset.to_a.join "/"
      rescue
        l = @uris.to_a.join ","
        puts "Cannot know label for #{l}"
        return l
      end
		end
	end
end

if __FILE__ == $0

	SUB_COMMANDS = %w(js jstree ptree pgraphml)
	global_opts = Trollop::options do
		version "gentree.rb 1.0.0 (c) 2013 Enrico Daga"
	    stop_on SUB_COMMANDS
	end
	cmd = ARGV.shift # 
	cmd_opts = case cmd
	    when "ptree" 
  	   Trollop::options do
  	   opt :file, "Vocabulary file", :short => "-f", :type => :string
    	 opt :root, "Root element", :short => "-r", :type => :string, :default => ""
  	  end
	    when "jstree" 
  	   Trollop::options do
  	   opt :file, "Vocabulary file", :short => "-f", :type => :string
    	 opt :root, "Root element", :short => "-r", :type => :string, :default => ""
  	  end
	    when "js" 
  	   Trollop::options do
  	   opt :file, "Vocabulary file", :short => "-f", :type => :string
    	 opt :root, "Root element", :short => "-r", :type => :string, :default => ""
  	  end
  	  when "pgraphml"  
    	 Trollop::options do
    	 opt :file, "Vocabulary file", :short => "-f", :type => :string
    	 opt :root, "Root element", :short => "-r", :type => :string, :default => ""
    	end
  	else
    	Trollop::die "unknown subcommand #{cmd.inspect}"
  	end
  	
	Trollop::die :file, "must exist" unless File.exist?(cmd_opts[:file]) if cmd_opts[:file]

	file = cmd_opts[:file]
	root = cmd_opts[:root]

  file = File.expand_path(file)
  
	vok = Vok.new file, root
	case cmd 
	when "js"
    puts "var nodes="
		vok.jsobject
	when "jstree"
    puts "var nodes="
		vok.jstreeobject
	when "ptree"
		vok.printTree	
	when "pgraphml"
		vok.graphml
	end
end
