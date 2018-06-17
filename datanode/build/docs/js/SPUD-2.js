var nodes=
[{ 
	id: "0",
	uri: "http://purl.org/datanode/ex/0.2/SPUD/2#LiveTrac",
	label: "ex:LiveTrac",
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
	uri: "http://purl.org/datanode/ex/0.2/SPUD/2#database",
	label: "ex:database",
	links: [{
		target: 1,
		label: "rdf:type",
	uri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "3",
	uri: "_:g70166092810300",
	label: "_:g70166092810300",
	links: [{
		target: 0,
		label: "dn:isSelectionOf",
	uri: "http://purl.org/datanode/ns/isSelectionOf",
		type: "default",
		weight: 1,
	},{
		target: 2,
		label: "dn:isUpdateOf",
	uri: "http://purl.org/datanode/ns/isUpdateOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "4",
	uri: "_:g70166092805020",
	label: "_:g70166092805020",
	links: [{
		target: 5,
		label: "owl:imports",
	uri: "http://www.w3.org/2002/07/owl#imports",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "5",
	uri: "http://linkedevents.org/ontology/",
	label: "http://linkedevents.org/ontology/",
	links: [],
},{ 
	id: "6",
	uri: "http://purl.org/datanode/ex/0.2/SPUD/2#view1",
	label: "ex:view1",
	links: [{
		target: 3,
		label: "dn:isExtractionOf",
	uri: "http://purl.org/datanode/ns/isExtractionOf",
		type: "default",
		weight: 1,
	},{
		target: 5,
		label: "dn:usesSchema",
	uri: "http://purl.org/datanode/ns/usesSchema",
		type: "default",
		weight: 1,
	},{
		target: 4,
		label: "dn:usesSchema",
	uri: "http://purl.org/datanode/ns/usesSchema",
		type: "default",
		weight: 1,
	},],
},]
