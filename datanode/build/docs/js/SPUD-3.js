var nodes=
[{ 
	id: "0",
	uri: "http://purl.org/datanode/ex/0.2/SPUD/3#database",
	label: "ex:database",
	links: [{
		target: 1,
		label: "rdf:type",
	uri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "1",
	uri: "http://purl.org/datanode/ns/Datanode",
	label: "dn:Datanode",
	links: [],
},{ 
	id: "2",
	uri: "http://purl.org/datanode/ex/0.2/SPUD/3#privatePart",
	label: "ex:privatePart",
	links: [{
		target: 0,
		label: "dn:isSectionOf",
	uri: "http://purl.org/datanode/ns/isSectionOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "3",
	uri: "_:g70317838082860",
	label: "_:g70317838082860",
	links: [{
		target: 2,
		label: "dn:disjointSection",
	uri: "http://purl.org/datanode/ns/disjointSection",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "4",
	uri: "_:g70317838065260",
	label: "_:g70317838065260",
	links: [{
		target: 2,
		label: "dn:isAnonymizedOf",
	uri: "http://purl.org/datanode/ns/isAnonymizedOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "5",
	uri: "http://purl.org/datanode/ex/0.2/SPUD/3#published",
	label: "ex:published",
	links: [{
		target: 3,
		label: "dn:hasSection",
	uri: "http://purl.org/datanode/ns/hasSection",
		type: "default",
		weight: 1,
	},{
		target: 4,
		label: "dn:hasSection",
	uri: "http://purl.org/datanode/ns/hasSection",
		type: "default",
		weight: 1,
	},],
},]
