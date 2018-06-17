#!/usr/local/bin/node

// This is a node module
if(typeof exports === 'undefined') exports = {};

exports.Schema = function(){
	
	// constants and enumerations
	var rdf = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
		owl = 'http://www.w3.org/2002/07/owl#',
		rdfs = 'http://www.w3.org/2000/01/rdf-schema#',
		dct = 'http://purl.org/dc/terms/',
		skos = 'http://www.w3.org/2004/02/skos/core#',
		prefix = {};
		prefix[rdf] = 'rdf',
		prefix[owl] = 'owl',
		prefix[rdfs] = 'rdfs',
		prefix[dct] = 'dct',
		prefix[skos] = 'skos';
		prefixes = ['rdf','owl','rdfs','dct', 'skos'];
		
	var ctypes = [
		owl+'Class', 
		rdfs+'Class',
	];
	var ptypes = [
		owl+'ObjectProperty',
		owl+'DatatypeProperty', 
		owl+'AnnotationProperty', 
		owl+'SymmetricProperty', 
		owl+'TransitiveProperty', 
		owl+'ReflexiveProperty',  
		owl+'IrreflexiveProperty', 
		owl+'FunctionalProperty', 
		owl+'InverseFunctionalProperty', 
		rdf+'Property',
	];
	
	// For internal use
	
	// This and utilities
	var _fs = require('fs'),
		_rdf = require('rdf'),
		_uri = require('uri-js'),		
		o = {} // this object
		;
	
	// Data and Indexes
	var G,
		xTypes,
		xProperties,
		xDataProperties,
		xObjectProperties,
		xInverses,
		xSubProperties,
		xSubClasses,
		xSuperProperties,
		xSuperClasses,
		L,
		T;
		
	o.read = function(file){
		if(_fs.existsSync(file)){
			// We only support ttl for the moment
			var d = _fs.readFileSync(file,'utf-8'),
				parser = new _rdf.TurtleParser();
				tmp = new _rdf.TripletGraph;
			parser.parse(d, undefined, '', null, G);
			G.forEach(function(st){
				if ( st.predicate == rdf+'type' ) {
					// If it is a type
					if ( ctypes.indexOf(st.object) > -1 ) {
						if( xTypes.indexOf(st.subject) === -1 ) xTypes.push( st.subject );
					}else
					// If it is a property declaration
					if ( ptypes.indexOf(st.object) > -1 ) {
						if( xProperties.indexOf(st.subject) === -1 ) xProperties.push( st.subject );
					}else{}
				} else if ( st.predicate == rdfs+'label' ) {
					if (typeof L[st.subject] === 'undefined') L[st.subject] = [];
					L[st.subject].push( st.object );
				} else if ( st.predicate == rdfs + 'subPropertyOf' ){
					if( xProperties.indexOf(st.subject) === -1 ) xProperties.push( st.subject );
					if( xProperties.indexOf(st.object) === -1 ) xProperties.push( st.object );
					//
					if( typeof xSubProperties[st.object] === 'undefined' ) xSubProperties[st.object] = [];
					xSubProperties[st.object].push(st.subject);
					if( typeof xSuperProperties[st.subject] === 'undefined' ) xSuperProperties[st.subject] = [];
					xSuperProperties[st.subject].push(st.object);
				} else if ( st.predicate == rdfs + 'subClassOf' ){
					if( typeof xSubClasses[st.object] === 'undefined' ) xSubClasses[st.object] = [];
					xSubClasses[st.object].push(st.subject);
					if( typeof xSuperClasses[st.subject] === 'undefined' ) xSuperClasses[st.subject] = [];
					xSuperClasses[st.subject].push(st.object);
					//
				} else if ( st.predicate == owl + 'inverseOf' ){
					if( xProperties.indexOf(st.subject) === -1 ) xProperties.push( st.subject );
					if( xProperties.indexOf(st.object) === -1 ) xProperties.push( st.object );
					if(typeof xInverses[st.subject] === 'undefined') xInverses[st.subject] = [];
					if(typeof xInverses[st.object] === 'undefined') xInverses[st.object] = [];
					xInverses[st.object].push( st.subject );
					xInverses[st.subject].push( st.object );
				}
				// populate tree index
				if (typeof T[st.subject] === 'undefined') T[st.subject] = {};
				if (typeof T[st.subject][st.predicate] === 'undefined') T[st.subject][st.predicate] = [];
				T[st.subject][st.predicate].push(st.object)
			});
			// Materialize inverse
			for(var ii in xInverses){
				if(typeof T[ii] === 'undefined') T[ii] = {}, T[ii][rdf+'type'] = [], T[ii][rdf+'type'].push( owl+'ObjectProperty' );
				T[ii][owl+'inverseOf'] = xInverses[ii];				
			}
		}else{
			console.log("Not a file :(");
		}
	}
	
	o.graph = function(){
		return G;
	};
	
	o.size = function(){
		return G.length;
	};
	
	o._init = function(){
		G = new _rdf.TripletGraph;
		xTypes = [],
		xProperties = [],
		xInverses = [],
		xSubClasses = [],
		xSubProperties = [],
		xSuperClasses = [],
		xSuperProperties = [],
		xDataProperties = [],
		xObjectProperties = [],
		L = {},
		T = {};
	}
	
	o.clear = function(){
		_init();
	}
	
	o.typesOf = function(uri){
		var t = [];
		if(typeof T[uri] === 'undefined') return [];
		if(typeof T[uri][rdf+'type'] === 'undefined') return [];
		T[uri][rdf+'type'].forEach(function(i){
			t.push(i);
		});
		return t;
	}
	
	o.types = function(){
		return xTypes;
	}
	
	o.isType = function(uri){
		return xTypes.indexOf(uri)>-1;
	}
	
	o.properties = function(){
		return xProperties;
	}
	
	o.isProperty = function(uri){
		return xProperties.indexOf(uri) > -1;
	}
	
	o.annotation = function(uri){ return o.typesOf(uri).indexOf(owl+'AnnotationProperty') > -1; }	
	o.symmetric = function(uri){ return o.typesOf(uri).indexOf(owl+'SymmetricProperty') > -1; }
	o.asymmetric = function(uri){ return o.typesOf(uri).indexOf(owl+'AsymmetricProperty') > -1; }
	o.transitive = function(uri){ return o.typesOf(uri).indexOf(owl+'TransitiveProperty') > -1; }
	o.functional = function(uri){ return o.typesOf(uri).indexOf(owl+'FunctionalProperty') > -1; }
	o.reflexive = function(uri){ return o.typesOf(uri).indexOf(owl+'ReflexiveProperty') > -1; }
	o.inverseFunctional = function(uri){ return o.typesOf(uri).indexOf(owl+'InverseFunctionalProperty') > -1; }
	o.irreflexive = function(uri){ return o.typesOf(uri).indexOf(owl+'IrreflexiveProperty') > -1; }
	
	o.inverses = function(uri){
		if(typeof xInverses[uri] === 'undefined') return [];
		return xInverses[uri];
	}
	
	o.label = function(entity){
		if ( typeof L[entity] !== 'undefined' && L[entity].length > 0 ) return L[entity][0].value;
		return '';
	};
	
	o.prefix = function(uri, _prefix){
		if(typeof _prefix === 'undefined'){
			// getter
			var ns = o.namespace(uri);
			if(typeof prefix[ns] !== 'undefined' ) return prefix[ns];
			var p = 'p';
			var i = 0;
			while(prefixes.indexOf(p+i) !== -1 ) {
				i++;
			}
			prefixes.push(p+i);
			return prefix[ns] = p+i;
		}else{
			// setter
			prefixes.push(_prefix);
			prefix[uri] = _prefix;
			return true;
		}
	};
	
	o.localName = function(uri){
		var u = _uri.parse(uri);
		if( typeof u.fragment !== 'undefined'){
			return u.fragment;
		}else{
			return uri.replace(_uri.resolve(uri, '.'),'');
		}
	}
	o.namespace = function(uri){
		var u = _uri.parse(uri);
		if( typeof u.fragment !== 'undefined'){
			return _uri.resolve(uri, '#');
		}
		return _uri.resolve(uri, '.');
	}
	
	o.about = function(uri){
		if( typeof T[uri] === 'undefined' ) return;
		return T[uri];
	}
	
	o.uriObject = function(uri){
		var ns = o.namespace(uri);
		return {
			label: o.label(uri),
			prefix: o.prefix(ns),
			ns: ns,
			uri: uri,
			name: o.localName(uri)
		}
	}
	
	o.definition = function(uri){
		var def = o.uriObject(uri);
		def.about = [];
		var ab = o.about(def.uri);
		for( j in ab){
			var p = o.uriObject(j);
			p.values = [];
			for(var y in ab[j]){
				var value = ab[j][y];
				if(typeof value == 'string' ){
					value = o.uriObject(value);
					// if this is a local entity, link it
					if(typeof T[value.uri] !== 'undefined'){
						value.link = true;
					}else{
						value.link = false;
					}
				}
				p.values.push(value);
			}
			def.about.push(p);
			
			var d = def;
			d.type = o.isType(uri);
			d.property = o.isProperty(uri);
			d.annotation = o.annotation( uri );
			d.symmetric = o.symmetric( uri );
			d.asymmetric = o.asymmetric( uri );
			d.transitive = o.transitive( uri );
			d.functional = o.functional( uri );
			d.reflexive = o.reflexive( uri );
			d.inverseFunctional = o.inverseFunctional( uri );
			d.irreflexive = o.irreflexive( uri );
			
			// children types/props
			d.children = o.children(uri);
			d.parents = o.parents(uri);
		}
		return def;
	}
	
	o.definitions = function(uris){
		var definitions = [];
		for(var i in uris){
			var def = o.definition(uris[i]);
			definitions.push(def);
		}
		return definitions;
	}
	
	o.uriObjectsSorter = function compare(a,b) {
	  if (a.name < b.name)
	     return -1;
	  if (a.name > b.name)
	    return 1;
	  return 0;
	}
	
	o.typesDef = function(){ 
		var objs = o.definitions(o.types());

		for(var ix in objs){
			var d = objs[ix];
			d.property = false;
			d.type = true;
			
		}
		objs.sort(o.uriObjectsSorter);
		return objs;
	}
	
	o.propertiesDef = function(){ 
		var objs =  o.definitions(o.properties()); 
		objs.sort(o.uriObjectsSorter);
		return objs;
	}

	/* a tree representation of classes/properties */

	o.parents = function(uri){
		if ( o.isType(uri) && typeof xSuperClasses[uri] !== 'undefined' ) return xSuperClasses[uri];
		if ( o.isProperty(uri) && typeof xSuperProperties[uri] !== 'undefined' ) return xSuperProperties[uri];
		return [];
	}
	
	o.children = function(uri){
		if ( o.isType(uri) && typeof xSubClasses[uri] !== 'undefined' ) return xSubClasses[uri];
		if ( o.isProperty(uri) && typeof xSubProperties[uri] !== 'undefined' ) return xSubProperties[uri];
		return [];
	}

	o.topTypes = function(){
		var tops = [];
		for(var x in xTypes){
			if ( typeof xSuperClasses[xTypes[x]] === 'undefined' || xSuperTypes[xTypes[x]].length === 0){
				tops.push(xTypes[x]);
			}
		}
		return tops;
	}
	
	o.topProperties = function(){
		var tops = [];
		for(var x in xProperties){
			if ( typeof xSuperProperties[xProperties[x]] === 'undefined' || xSuperProperties[xProperties[x]].length === 0){
				tops.push(xProperties[x]);
			}
		}
		return tops;
	}
	
	o.propertiesTree = function(){
		var subtree = function(node){
			var children = o.children(node.uri);
			node.children = []; 
			for(var x in children){
				var n = {};
				n.uri = children[x];
				subtree(n);
				node.children.push(n)
			}
			return node;
		}
		var roots = [];
		var tops = o.topProperties();
		for(var x in tops){
			var node = {};
			node.uri = tops[x];
			roots.push(subtree(node));
		}
		return roots;
	}
	
	// Init variables
	o._init();
	
	return o;
}	

/* a simple view */
exports.View = function(_data){
	var _ = require('underscore'),
	 	_fs = require('fs'),
		o = {};
	
		// We bind the data to the view
		for(var i in _data)
			o[i] = _data[i];
		
		o.render = function(template){
			var compiled = _.template(_fs.readFileSync(template, {encoding: 'UTF-8'}));
			return compiled(this)
		}
		
		o.print = function(template){
			var compiled = _.template(_fs.readFileSync(template, {encoding: 'UTF-8'}));
			return console.log(compiled(this));
		}
		
		o.newView = function(data){
			return new doctoys.View(data);
		}
		
		o.renderPartial = function(template, data){
			return o.newView(data).render(template);
		}
		
		o.printPartial = function(template, data){
			return o.newView(data).print(template);
		}
		return o;
}

var doctoys = exports;

