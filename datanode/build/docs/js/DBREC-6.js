var nodes=
[{ 
	id: "0",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/6#curated",
	label: "ex:curated",
	links: [{
		target: 1,
		label: "dn:cleanedFrom",
	uri: "http://purl.org/datanode/ns/cleanedFrom",
		type: "default",
		weight: 1,
	},{
		target: 2,
		label: "dn:hasDeletion",
	uri: "http://purl.org/datanode/ns/hasDeletion",
		type: "default",
		weight: 1,
	},{
		target: 1,
		label: "dn:optimizedFrom",
	uri: "http://purl.org/datanode/ns/optimizedFrom",
		type: "default",
		weight: 1,
	},{
		target: 3,
		label: "dn:sameCapability",
	uri: "http://purl.org/datanode/ns/sameCapability",
		type: "default",
		weight: 1,
	},{
		target: 1,
		label: "dn:updatedVersionOf",
	uri: "http://purl.org/datanode/ns/updatedVersionOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "1",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/6#origin",
	label: "ex:origin",
	links: [{
		target: 4,
		label: "dn:isPortionOf",
	uri: "http://purl.org/datanode/ns/isPortionOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "2",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/6#uselessPropertyValues",
	label: "ex:uselessPropertyValues",
	links: [{
		target: 3,
		label: "dn:differentCapability",
	uri: "http://purl.org/datanode/ns/differentCapability",
		type: "default",
		weight: 1,
	},{
		target: 3,
		label: "dn:disjointSection",
	uri: "http://purl.org/datanode/ns/disjointSection",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "3",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/6#usefulPropertyValues",
	label: "ex:usefulPropertyValues",
	links: [{
		target: 1,
		label: "dn:isSectionOf",
	uri: "http://purl.org/datanode/ns/isSectionOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "4",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/6#DBPedia",
	label: "ex:DBPedia",
	links: [],
},]
