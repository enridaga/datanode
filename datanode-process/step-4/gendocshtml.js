#!/usr/local/bin/node

var fs = require('fs');

var _rdf=require('rdf');


var lib_home="js-diagrams";
var web_home=".";
//var lib_home=__dirname + '/' + lib_home;
var docs='build/docs';
var usecases_home=docs + "/usecases";
var scriptPlaceholder="<!-- SCRIPTS -->"
if(!fs.existsSync(usecases_home)){
		fs.mkdir(usecases_home);
}
if(!fs.existsSync(docs + '/css')){
		fs.mkdir(docs + '/css');
}

function embed(tmpl, data){
	var myArray = data;
	for (var key in data) {
		tmpl = tmpl.replace(new RegExp('%'+key+'%', 'g'),data[key]);
	}
	return tmpl;
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildExamplesMenu(uc, base){
	var examples_menu = "";
	
	uc.forEach(function(file){
		if(!file.match(/.+-[0-9]{1,}\.js/)) return;
		var parts = file.split('.');
		var ext = parts[parts.length - 1];
		var bname = parts[0];
		var href = base + bname + ".html";
		examples_menu += "<li><a role=\"menuitem\"  href=\"";
		examples_menu += href;
		examples_menu += "\">" + bname + "</a></li>";
	});
	return examples_menu;
}

var usecases = null;
// We first do use cases
usecases = fs.readdirSync(docs + '/js');
	
	usecases.forEach(function(file){

		var examples_menu = buildExamplesMenu(usecases, "");
		
		web_home="..";
		// if it is a usecase file
		if(!file.match(/.+-[0-9]{1,}\.js/)) return;
		var title=file;
		var parts = file.split('.');
		var ext = parts[parts.length - 1];
		if(ext == 'js'){
			var bname = parts[0];
			var ttl=docs + '/ttl/' + bname + '.ttl';
			var html=usecases_home + "/" + bname + '.html';
			console.log("Generating " + html);
			fs.readFile(lib_home+'/container.html','utf-8', function (err, data) {
			  if (err) throw err;
			  var container=data;
			  fs.readFile(ttl, 'utf-8', function (err, data) {
  			   if (err) throw err;
			   
			   // load rdf triples and extract description of the UC
			   parser = new _rdf.TurtleParser();
			   var g  = new _rdf.TripletGraph;
			   parser.parse(data, undefined, '', null, g);
  			   // console.log(g);
			   var doc = g.match(null, _rdf.rdfns('type'), 'http://xmlns.com/foaf/0.1/Document').map(function(v){ return v.subject})[0];
			   var lbl = g.match(doc, _rdf.rdfsns('label'), null).map(function(v){ return v.object})[0]['value'];
			   var cmt = g.match(doc, _rdf.rdfsns('comment'), null).map(function(v){ return v.object})[0]['value'];
			   //console.log(lbl);
			   var intro = lbl;
			   var synopsys = cmt;
			   // prepare synopsys (this is crazy)
			   synopsys=synopsys.replace(/((?!see\s*)|^)([0-9\.]{1,3}\)\s+)/g, "<li>");
			   synopsys="<ol>"+synopsys+"</ol>";
			   var rdfstring=htmlEntities(data);
	  		   var js=bname + '.js';
			   var inputscript='<script type="text/javascript" src="' + web_home + '/js/' + js + '"></script>' + scriptPlaceholder;
    		   fs.readFile(lib_home+'/usecase.html.tmpl', 'utf-8', function (err, content) {
				   var toembed = {
					   intro: intro,
					   synopsys: synopsys,
					   ttl: rdfstring
				   };
				   content = embed(content, toembed);
				   container = embed(container, { 
					   content: content, 
					   title: title,
					   examples_menu: examples_menu,
					   web_home: web_home,
				   });
    		   	   container = container.replace(scriptPlaceholder, inputscript);
    		   	 	fs.writeFile(html, container, function(err) {
    		      		if(err) {
    		       	   	  console.log(err);
    		        	} else {
    		        	 //  console.log("The file was saved!");
    		        	}
    		    	}); 
			    }); 
  			 });
		 });
		}
	});

fs.createReadStream(lib_home + "/main.css").pipe(fs.createWriteStream(docs + "/css/main.css"));
fs.createReadStream(lib_home + "/diagram.js").pipe(fs.createWriteStream(docs + "/js/diagram.js"));
fs.createReadStream(lib_home + "/dynatree.js").pipe(fs.createWriteStream(docs + "/js/dynatree.js"));
fs.createReadStream(lib_home + "/model.js").pipe(fs.createWriteStream(docs + "/js/model.js"));

// generate main page
fs.readFile(lib_home+'/container.html','utf-8', function (err, data) {
  if (err) throw err;
  var container=data;
  var ttl=docs + '/../../src/datanode.ttl';

  // parser = new _rdf.TurtleParser();
//   var g  = new _rdf.TripletGraph;
  var web_home=".";
  var inputscript='<script type="text/javascript" src="' + web_home + '/js/dntree.js"></script>' + scriptPlaceholder;
  container = container.replace(scriptPlaceholder, inputscript);
  
  var ptree = fs.readFileSync( docs + '/../ptree.txt' ); 
  var rdfdata = fs.readFileSync( ttl );
  var rdfstring=htmlEntities(rdfdata);
  
  var toembed = {
	  diagramDataVar: 'nodes',
	  ptree: ptree,
	  turtle: rdfstring
  }
  
  fs.readFile(lib_home+'/index.html.tmpl', 'utf-8', function(err, tmpl){
	  var content = embed(tmpl, toembed);

	  var examples_menu = buildExamplesMenu(usecases, "./usecases/");
  
	  container = embed(container, { 
	   content: content, 
	   title: "Datanode",
	   examples_menu: examples_menu,
	   web_home: web_home,
	  });
	  var html=docs + "/index.html";
	  console.log("Generating " + html);
	  fs.writeFile(html, container, function(err) {
			if(err) {
	 	   	  console.log(err);
	  	} else {
	  	 //  console.log("The file was saved!");
	  	}
	  });  	
  });
});