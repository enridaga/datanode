var nodes=
[{ 
	id: "0",
	uri: "_:g70336091990820",
	label: "_:g70336091990820",
	links: [{
		target: 1,
		label: "dn:hasPart",
	uri: "http://purl.org/datanode/ns/hasPart",
		type: "default",
		weight: 1,
	},{
		target: 2,
		label: "dn:hasPart",
	uri: "http://purl.org/datanode/ns/hasPart",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "1",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/3#inconsistent",
	label: "ex:inconsistent",
	links: [{
		target: 4,
		label: "dn:isPartOf",
	uri: "http://purl.org/datanode/ns/isPartOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "2",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/3#redundant",
	label: "ex:redundant",
	links: [{
		target: 4,
		label: "dn:isPartOf",
	uri: "http://purl.org/datanode/ns/isPartOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "3",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/3#good",
	label: "ex:good",
	links: [{
		target: 0,
		label: "dn:disjointPart",
	uri: "http://purl.org/datanode/ns/disjointPart",
		type: "default",
		weight: 1,
	},{
		target: 1,
		label: "dn:inconsistentWith",
	uri: "http://purl.org/datanode/ns/inconsistentWith",
		type: "default",
		weight: 1,
	},{
		target: 2,
		label: "dn:inconsistentWith",
	uri: "http://purl.org/datanode/ns/inconsistentWith",
		type: "default",
		weight: 1,
	},{
		target: 4,
		label: "dn:isPartOf",
	uri: "http://purl.org/datanode/ns/isPartOf",
		type: "default",
		weight: 1,
	},{
		target: 2,
		label: "dn:overlappingCapability",
	uri: "http://purl.org/datanode/ns/overlappingCapability",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "4",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/3#origin",
	label: "ex:origin",
	links: [{
		target: 6,
		label: "dn:isPartOf",
	uri: "http://purl.org/datanode/ns/isPartOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "5",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/3#obtained",
	label: "ex:obtained",
	links: [{
		target: 6,
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
	id: "6",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/3#DBPedia",
	label: "ex:DBPedia",
	links: [],
},]
