#!/usr/local/bin/node

var fs = require('fs');

var _rdf=require('rdf');


var lib_home="js-diagrams";
var web_home=".";
//var lib_home=__dirname + '/' + lib_home;
var myArgs = process.argv.slice(2);

var datanode = "src/datanode.ttl"
var introduction = "src/datanode.html"
var version = "SNAPSHOT"
if(fs.existsSync("src/datanode-" + myArgs[0] + ".ttl")){
	version = myArgs[0]
	datanode = "src/datanode-" + myArgs[0] + ".ttl";
}
if(fs.existsSync("src/datanode-" + myArgs[0] + ".html")){
	introduction = "src/datanode-" + myArgs[0] + ".html";
}
var build="build/" + version;
console.log("Dataode source file:", datanode);
var docs = build + '/docs';
var usecases_home=docs + "/usecases";
var scriptPlaceholder="<!-- SCRIPTS -->"
if(!fs.existsSync(usecases_home)){
		fs.mkdirSync(usecases_home);
}
if(!fs.existsSync(docs + '/css')){
		fs.mkdir(docs + '/css', function(){});
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
				   version: version,
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

  // parser = new _rdf.TurtleParser();
//   var g  = new _rdf.TripletGraph;
  var web_home=".";
  var inputscript='<script type="text/javascript" src="' + web_home + '/js/dntree.js"></script>' + scriptPlaceholder;
  container = container.replace(scriptPlaceholder, inputscript);
    
  gen = function(){
	var doctoys = require('./doctoys');
  	var model = new doctoys.Schema;
	model.prefix('http://purl.org/datanode/ns/','dn');
  	model.read(datanode);
	
	//var ontologies = [];
		// 
	// var ont = new doctoys.View({
	// 	header: "Ontology",
	// 	clazz: 'ontology',
	// 	li: ontologies
	// });
	// var out = view.render('tmpl/ul.html.js');
	var out = "";
	
	var types = [];
	model.types().forEach(function(type){
		types.push(model.uriObject(type));
	});
	types.sort(model.uriObjectsSorter);
	var view = new doctoys.View({
		header: "Classes",
		clazz: 'types',
		li: types
	});
	out += view.render('tmpl/ul.html.js');
	
	var properties = [];
	model.properties().forEach(function(p){
		properties.push(model.uriObject(p));			
	});
	properties.sort(model.uriObjectsSorter);
	view = new doctoys.View({
		header: "Properties",
		clazz: 'properties',
		li: properties
	});
	out += view.render('tmpl/ul.html.js');
	
	model.typesDef().forEach(function (def){
		var view = new doctoys.View(def);
			out += view.render('tmpl/definition.html.js');
	});
	model.propertiesDef().forEach(function (def){
		var view = new doctoys.View(def);
			out += view.render('tmpl/definition.html.js');
	});
	return out;
  }
  var html = gen();
  
  var toembed = {
	  diagramDataVar: 'nodes',
	  html: html
  }
  
  fs.readFile(lib_home+'/index.html.tmpl', 'utf-8', function(err, tmpl){
	  var content = embed(tmpl, toembed);

	  var examples_menu = buildExamplesMenu(usecases, "./usecases/");
  	  var text = fs.readFileSync(introduction)
	  container = embed(container, { 
	   content: content, 
	   title: "Datanode",
	   version: version,
	   examples_menu: examples_menu,
	   introduction: text,
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