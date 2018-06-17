var nodes=
[{ 
	id: "0",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/7#misusedProperties",
	label: "ex:misusedProperties",
	links: [{
		target: 1,
		label: "dn:isPortionOf",
	uri: "http://purl.org/datanode/ns/isPortionOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "1",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/7#properties",
	label: "ex:properties",
	links: [],
},{ 
	id: "2",
	uri: "_:g70133356258740",
	label: "_:g70133356258740",
	links: [{
		target: 3,
		label: "dn:disjointSection",
	uri: "http://purl.org/datanode/ns/disjointSection",
		type: "default",
		weight: 1,
	},{
		target: 4,
		label: "void:classPartition",
	uri: "http://rdfs.org/ns/void#classPartition",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "3",
	uri: "http://www.w3.org/2002/07/owl#nothing",
	label: "owl:nothing",
	links: [],
},{ 
	id: "4",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/7#Artist",
	label: "ex:Artist",
	links: [],
},{ 
	id: "5",
	uri: "_:g70133356200720",
	label: "_:g70133356200720",
	links: [{
		target: 2,
		label: "dn:hasSection",
	uri: "http://purl.org/datanode/ns/hasSection",
		type: "default",
		weight: 1,
	},{
		target: 4,
		label: "void:classPartition",
	uri: "http://rdfs.org/ns/void#classPartition",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "6",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/7#origin",
	label: "ex:origin",
	links: [{
		target: 7,
		label: "dn:hasSection",
	uri: "http://purl.org/datanode/ns/hasSection",
		type: "default",
		weight: 1,
	},{
		target: 5,
		label: "dn:hasSection",
	uri: "http://purl.org/datanode/ns/hasSection",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "7",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/7#withProperties",
	label: "ex:withProperties",
	links: [{
		target: 1,
		label: "dn:hasVocabulary",
	uri: "http://purl.org/datanode/ns/hasVocabulary",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "8",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/7#withMisusedProperties",
	label: "ex:withMisusedProperties",
	links: [{
		target: 7,
		label: "dn:isSectionOf",
	uri: "http://purl.org/datanode/ns/isSectionOf",
		type: "default",
		weight: 1,
	},{
		target: 9,
		label: "void:propertyPartition",
	uri: "http://rdfs.org/ns/void#propertyPartition",
		type: "default",
		weight: 1,
	},{
		target: 10,
		label: "void:propertyPartition",
	uri: "http://rdfs.org/ns/void#propertyPartition",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "9",
	uri: "http://dbpedia.org/property/nationalAnthem",
	label: "dbp:nationalAnthem",
	links: [],
},{ 
	id: "10",
	uri: "http://dbpedia.org/property/notableInstruments",
	label: "dbp:notableInstruments",
	links: [],
},]
