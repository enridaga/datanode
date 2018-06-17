
function model(input){
	
var nodes = input;

var labelAnchors = [];
var labelAnchorLinks = [];
var links = [];

labelAnchors = [];
links = [];
labelAnchorLinks = [];

for(var i = 0; i < nodes.length; i++) {
	labelAnchors.push({
		node : nodes[i]
	});
	labelAnchors.push({
		node : nodes[i]
	});
	if(typeof nodes[i].links !== 'undefined'){
		for(var c = 0; c < nodes[i].links.length; c++) {
			
			var link = nodes[i].links[c];
			link.source = i;
			var found = false;
			// add the link only if it does not exists with another symbol
			links.forEach(function(item){
				if(item.source == link.source && item.target == link.target){
					item.label += "/" + link.label;
					found = true;
					return;
				}
			});
			if(!found){
				links.push(link);
			}
		}
	}
	// position of the node label
	labelAnchorLinks.push({
		source : i * 2,
		target : i * 2 + 1,
		weight : 1
	});
}

data = {
	nodes: nodes,
	labelAnchors: labelAnchors,
	links: links,
	labelAnchorLinks: labelAnchorLinks
}

return data;
}