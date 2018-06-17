var nodes=
[{ 
	id: "0",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/8#dset",
	label: "ex:dset",
	links: [{
		target: 1,
		label: "dn:isSectionOf",
	uri: "http://purl.org/datanode/ns/isSectionOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "1",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/8#DBPedia",
	label: "ex:DBPedia",
	links: [],
},{ 
	id: "2",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/8#with-wrong-properties",
	label: "ex:with-wrong-properties",
	links: [{
		target: 2,
		label: "dn:inconsistentWith",
	uri: "http://purl.org/datanode/ns/inconsistentWith",
		type: "default",
		weight: 1,
	},{
		target: 0,
		label: "dn:isSectionOf",
	uri: "http://purl.org/datanode/ns/isSectionOf",
		type: "default",
		weight: 1,
	},{
		target: 3,
		label: "dn:vocabulary",
	uri: "http://purl.org/datanode/ns/vocabulary",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "3",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/8#wrong-properties",
	label: "ex:wrong-properties",
	links: [],
},]
