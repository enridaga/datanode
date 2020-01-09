#!/usr/local/bin/node

var fs = require('fs');

var lib_home="js-diagrams";
var lib_home=__dirname + '/' + lib_home;
var usecases_home=__dirname + '/usecases';
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
fs.readdir(usecases_home, function(err, files){
	
	files.forEach(function(file){
		var title=file;
		var parts = file.split('.');
		var ext = parts[parts.length - 1];
		if(ext == 'js'){
			var bname = parts[0];
			var f=usecases_home + '/' + bname;
			var ttl=f + '.ttl';
			var js=f + '.js';
			var html=f + '.html';
			var png=f + '.png';
			console.log("Processing "+f);
			
			fs.readFile(lib_home+'/container.html','utf-8', function (err, data) {
			  if (err) throw err;
			 var container=data;
  			fs.readFile(ttl, 'utf-8', function (err, data) {
  			  if (err) throw err;
  			  var rdf=htmlEntities(data);
    		  	container = container.replace(/\%title\%/g,title).replace(/\%lib_home\%/g,lib_home).replace(/\%input\%/,js).replace(/\%ttl\%/,rdf);
    		  	fs.writeFile(html, container, function(err) {
    		      if(err) {
    		          console.log(err);
    		      } else {
    		        //  console.log("The file was saved!");
    		      }
    		  	}); 
  			});
  		  	
			});
		}
	});
});
