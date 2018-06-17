#!/usr/local/bin/node

(function(){
/* end module */

var doctoys = {};

doctoys.Schema = function(){
	
	var _fs = require('fs'),
		_rdf = require('rdf'),		
		_g = new _rdf.TripletGraph, // data graph
		o = {} // this object
		;
		
	o.test = function(){
		console.log("Hi!");
	};
	
	o.read = function(file){
		if(_fs.existsSync(file)){
			// We only support ttl for the moment
			var d = _fs.readFileSync(file,'utf-8'),
				parser = new _rdf.TurtleParser();
				tmp = new _rdf.TripletGraph;
			parser.parse(d, undefined, '', null, tmp);
			tmp.match().map(function(t){
				console.log(t);
			});
		}else{
			console.log("Not a file :(");
		}
	};
	
	o.graph = function(){
		return _g;
	}
	
	return o;
}

o = new doctoys.Schema;

o.read('src/datanode.ttl');
console.log(o.graph().length);
o.read('src/datanode.ttl');
console.log(o.graph().length);
o.read('build/datanode.inf.ttl');
console.log(o.graph().length);

	
/* end module */
})();