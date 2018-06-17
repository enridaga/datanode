
dia = function(data, container){
//			var w = 960, h = 500;
			var w = 1300, h = 1300;

			var labelDistance = 10;

			var vis = d3.select(container).append("svg:svg").attr("width", w).attr("height", h);

			vis.attr("data-done","0");
			
			vis.append("defs").selectAll("marker")
			    .data(["default", "is-a", "inverse-of", "subclass-of"])
			  .enter().append("marker")
			    .attr("id", function(d) { return d; })
//			    .attr("viewBox", "0 -5 10 10")
				.attr("color", "#ccc")
			    .attr("refX", 17)
			    .attr("refX", 8)
				.attr("refY", 0.6)
			    .attr("markerWidth", 10)
			    .attr("markerHeight", 1)
			    .attr("orient", "auto")
				.attr("fill", "#fd8d3c")
			  .append("path")
			    .attr("d", "M0,-5L10,0L0,5");

			var nodes = data.nodes;
			var labelAnchors = data.labelAnchors;
			var labelAnchorLinks = data.labelAnchorLinks;
			var links = data.links;

			var usedcolors = [];
			links.forEach(function (item){
				// choose the color of the arc
			   item.color = "#DDD";
			});
			
			var force = d3.layout.force().size([w, h]).nodes(nodes).links(links).gravity(1).linkDistance(200).charge(-10000).linkStrength(function(x) {
				return x.weight * 1
			});
			force.start();
			
			var force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkDistance(10).linkStrength(8).charge(-100).size([w, h]);
			force2.start();

			var link = vis.selectAll("line.link").data(links).enter().append("svg:line").attr("class", "link").style("stroke-width", 3);

			var node = vis.selectAll("g.node").data(force.nodes()).enter().append("svg:g").attr("class", "node");
			node.append("svg:circle").attr("r", 8).style("fill", "#1f77b4").style("stroke", "#FFF").style("stroke-width", 3);
			node.call(force.drag);

		    var linkLabels = vis.selectAll("text") 
		         .data(force.links()) 
		         .enter().append("svg:text") 
				 .attr("class", "link-label")
		         .attr("font-size", 10) 
				 .style("font-family", "Arial").style("font-size", 12) .style("font-style", "italic") 
		         .attr("xlink:href", 
		                function(d) { 
		                   return "#path"+d.source.index+"_"+d.target.index; 
		                }) 
		         .text(function(d){ return d.label; }); 
	 
			var anchorLink = vis.selectAll("line.anchorLink").data(labelAnchorLinks);
			//.enter().append("svg:line").attr("class","anchorLink").style("stroke", "#999");

			var anchorNode = vis.selectAll("g.anchorNode").data(force2.nodes()).enter().append("svg:g").attr("class", "anchorNode");
			anchorNode.append("svg:circle").attr("r", 0); //.style("fill", "#1f77b4");
			anchorNode.append("svg:text").text(function(d, i) {
				return i % 2 == 0 ? "" : d.node.label
			}).style("fill", "#555").style("font-family", "Arial").style("font-size", 14);

			var updateLink = function() {
				this.attr("x1", function(d) {
					return d.source.x;
				}).attr("y1", function(d) {
					return d.source.y;
				}).attr("x2", function(d) {
					return d.target.x;
				}).attr("y2", function(d) {
					return d.target.y;
				}).attr("marker-end", function(d){
					return "url(#" + d.type + ")";
				}).attr("title", function(d){
					return d.uri;
				}).attr("stroke", function(d){
					return d.color;
				});
			}

			var updateNode = function() {
				this.attr("transform", function(d) {
					return "translate(" + d.x + "," + d.y + ")";
				});
			}

			force.on("tick", function() {
				
				force2.start();

				node.call(updateNode);

				anchorNode.each(function(d, i) {
					if(i % 2 == 0) {
						d.x = d.node.x;
						d.y = d.node.y;
					} else {
						var b = this.childNodes[1].getBBox();

						var diffX = d.x - d.node.x;
						var diffY = d.y - d.node.y;

						var dist = Math.sqrt(diffX * diffX + diffY * diffY);

						var shiftX = b.width * (diffX - dist) / (dist * 2);
						shiftX = Math.max(-b.width, Math.min(0, shiftX));
						var shiftY = 5;
						this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
					}
				});

				anchorNode.call(updateNode);
				link.call(updateLink);
				anchorLink.call(updateLink);

			}); 
			force2.on("tick",function(){
				linkLabels.each(function(d, i) {
					var b = this.getBBox();
					
					var snode = d.source;
					var tnode = d.target;
					var lblx = (d.source.x > d.target.x) ? d.target.x + ((d.source.x-d.target.x)/2) : d.source.x + ((d.target.x-d.source.x)/2) ;
					var lbly = (d.source.y > d.target.y) ? d.target.y + ((d.source.y-d.target.y)/2) : d.source.y + ((d.target.y-d.source.y)/2) ;
					lblx = lblx - b.width/2 ;

					this.setAttribute("transform", "translate(" + lblx + "," + lbly + ")");
					this.setAttribute("fill", "#888");
					
				});
			});
			
			function dostop(){
				if(force.alpha() < 0.05){
					vis.attr("data-done","1");
				}else{
					setTimeout(dostop,200);
				}
			}
			setTimeout(dostop,200);
		}