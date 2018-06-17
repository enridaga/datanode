<div class="definition">
<h4><a name="<%= name %>" id="<%= name %>"></a><%= prefix %>:<%= name %>
<% if (symmetric) { %>
<span class="badge symmetric" title="symmetric">S</span>
<% } %>
<% if (transitive) { %>
<span class="badge transitive" title="transitive">T</span>
<% } %>
<% if (reflexive) { %>
<span class="badge reflexive" title="reflexive">R</span>
<% } %>
<% if (irreflexive) { %>
<span class="badge irreflexive" title="irreflexive">I</span>
<% } %>
<% if (functional) { %>
<span class="badge functional" title="functional">F</span>
<% } %>
<% if (inverseFunctional) { %>
<span class="badge inverseFunctional" title="inverseFunctional">I</span>
<% } %>
</h4>
<tt><%= uri %></tt>
<div><table class="table"><tbody><%
for(var i in about){
	%><tr><th><%=about[i].prefix%>:<%= about[i].name %></th><td><%
	var first = true;
	for(var j in about[i].values ){
		if(!first){%>  <%}
		var s = about[i].values[j];
		if (typeof s.uri !== 'undefined'){
			if(s.link == true){
				%><a href="#<%= s.name %>"><%
			}
			%><%= s.prefix %>:<%=s.name%><%
			if(s.link == true){
				%></a><%
			}
		}else{
			%><%= s['value'] %><%			
		}
		first = false;
	}
	%></td></tr><%
}
%></tbody></table></div>
</div>