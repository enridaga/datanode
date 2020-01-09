var doctoys = require('./doctoys');
exports.testRead = function(test){
	
	o = new doctoys.Schema;
	o.read("src/datanode.ttl");
    test.ok(o.types().length === 1, "We should have only one class");
    test.ok(o.label('http://purl.org/datanode/ns/Datanode') == 'A data node', "The label of the datanode class should be Datanode");
    test.done();
	
};

exports.testTemplate = function(test){
	var view = new doctoys.View({a:1});
	view.render('index.tmpl');
	test.done();
}

exports.testUl = function(test){
	var view = new doctoys.View({clazz:'ul-class',header:'Header',li:[{href:'A', name: 'AName', label:'A'},{href:'B', name: 'BName', label:'B'},{href:'C', name:'CName', label:'C'}]});
	view.render('tmpl/ul.html.js');
	view.render('tmpl/ul.html.js');
	test.done();
}

exports.testLists = function(test){
	var model = new doctoys.Schema;
	model.read("src/datanode.ttl");
	
	var types = model.types();
	for(var i in types){
		types[i] = model.uriObject(types[i]);
	}
	var view = new doctoys.View({
		clazz: 'types',
		header: 'Header',
		li: types
	});
	view.render('tmpl/ul.html.js');
	
	var properties = model.properties();
	for(var i in properties){
		properties[i] = model.uriObject(properties[i]);
	}
	var view = new doctoys.View({
		clazz: 'properties',
		header: 'Header',
		li: properties
	});
	view.render('tmpl/ul.html.js');
	
	test.done();
}

exports.testDefinition = function(test){
	var model = new doctoys.Schema;
	model.read("src/datanode.ttl");
	
	model.typesDef().forEach(function (def){
		var view = new doctoys.View(def);
			view.render('tmpl/definition.html.js');
	});
	model.propertiesDef().forEach(function (def){
		var view = new doctoys.View(def);
			view.render('tmpl/definition.html.js');
	});
	test.done();
}

exports.testInverses = function(test){
	var model = new doctoys.Schema;
	model.read("src/datanode.ttl");
	var derinv = model.inverses('http://purl.org/datanode/ns/hasDerivation');
	test.ok(derinv.length === 1, 'There must be an inverse property of hasDerivation is derives');
	test.done();
}

exports.testTopTypes = function(test){
	var model = new doctoys.Schema;
	model.read("src/datanode.ttl");
	var tops = model.topTypes();
	test.ok(tops.length === 1, "Datanode has one single type.");
	test.done();
}

exports.testTopProperties = function(test){
	var model = new doctoys.Schema;
	model.read("src/datanode.ttl");
	var tops = model.topProperties();
	test.ok(tops.length === 1, "Datanode has one single top property.");
	test.done();
}

exports.testPropertiesTree = function(test){
	var model = new doctoys.Schema;
	model.read("src/datanode.ttl");
	var tree = model.propertiesTree();
	test.ok(tree.length === 1, "Datanode has one single top property.");
	test.done();
}

exports.testPropertiesSize = function(test){
	var model = new doctoys.Schema;
	model.read("src/datanode.ttl");
	console.log(model.properties().length);
	test.done();
}








