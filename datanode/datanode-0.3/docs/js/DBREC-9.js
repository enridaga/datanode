var nodes=
[{ 
	id: "0",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/9#artistsAndLinksToResources",
	label: "ex:artistsAndLinksToResources",
	links: [{
		target: 1,
		label: "dn:hasSection",
	uri: "http://purl.org/datanode/ns/hasSection",
		type: "default",
		weight: 1,
	},{
		target: 2,
		label: "dn:hasSection",
	uri: "http://purl.org/datanode/ns/hasSection",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "1",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/9#withPropertiesUsedOnlyOnce",
	label: "ex:withPropertiesUsedOnlyOnce",
	links: [{
		target: 4,
		label: "dn:hasVocabulary",
	uri: "http://purl.org/datanode/ns/hasVocabulary",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "2",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/9#withPropertiesWronglyDefined",
	label: "ex:withPropertiesWronglyDefined",
	links: [{
		target: 3,
		label: "dn:hasVocabulary",
	uri: "http://purl.org/datanode/ns/hasVocabulary",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "3",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/9#propertiesWronglyDefined",
	label: "ex:propertiesWronglyDefined",
	links: [{
		target: 4,
		label: "dn:hasPart",
	uri: "http://purl.org/datanode/ns/hasPart",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "4",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/9#propertiesUsedOnlyOnce",
	label: "ex:propertiesUsedOnlyOnce",
	links: [],
},]
