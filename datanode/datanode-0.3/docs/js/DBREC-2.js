var nodes=
[{ 
	id: "0",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/2#datatype-properties",
	label: "ex:datatype-properties",
	links: [{
		target: 1,
		label: "dn:attributesOf",
	uri: "http://purl.org/datanode/ns/attributesOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "1",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/2#origin",
	label: "ex:origin",
	links: [],
},{ 
	id: "2",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/2#no-dtp",
	label: "ex:no-dtp",
	links: [{
		target: 1,
		label: "dn:cleanedFrom",
	uri: "http://purl.org/datanode/ns/cleanedFrom",
		type: "default",
		weight: 1,
	},{
		target: 3,
		label: "dn:isCopyOf",
	uri: "http://purl.org/datanode/ns/isCopyOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "3",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/2#part-without-dtp",
	label: "ex:part-without-dtp",
	links: [{
		target: 4,
		label: "dn:differentVocabulary",
	uri: "http://purl.org/datanode/ns/differentVocabulary",
		type: "default",
		weight: 1,
	},{
		target: 4,
		label: "dn:disjointSection",
	uri: "http://purl.org/datanode/ns/disjointSection",
		type: "default",
		weight: 1,
	},{
		target: 1,
		label: "dn:isSectionOf",
	uri: "http://purl.org/datanode/ns/isSectionOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "4",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/2#part-with-dtp",
	label: "ex:part-with-dtp",
	links: [{
		target: 0,
		label: "dn:hasVocabulary",
	uri: "http://purl.org/datanode/ns/hasVocabulary",
		type: "default",
		weight: 1,
	},{
		target: 1,
		label: "dn:isSectionOf",
	uri: "http://purl.org/datanode/ns/isSectionOf",
		type: "default",
		weight: 1,
	},],
},]
