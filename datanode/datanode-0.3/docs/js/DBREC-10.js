var nodes=
[{ 
	id: "0",
	uri: "_:g70135282595480",
	label: "_:g70135282595480",
	links: [{
		target: 1,
		label: "dn:disjointSection",
	uri: "http://purl.org/datanode/ns/disjointSection",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "1",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/10#useless",
	label: "ex:useless",
	links: [],
},{ 
	id: "2",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/10#dset",
	label: "ex:dset",
	links: [{
		target: 1,
		label: "dn:hasSection",
	uri: "http://purl.org/datanode/ns/hasSection",
		type: "default",
		weight: 1,
	},{
		target: 0,
		label: "dn:hasSection",
	uri: "http://purl.org/datanode/ns/hasSection",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "3",
	uri: "_:g70135282300140",
	label: "_:g70135282300140",
	links: [],
},{ 
	id: "4",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/10#linkToSingleArtist",
	label: "ex:linkToSingleArtist",
	links: [{
		target: 3,
		label: "dn:hasPortion",
	uri: "http://purl.org/datanode/ns/hasPortion",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "5",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/10#uselessOnlyOnce",
	label: "ex:uselessOnlyOnce",
	links: [{
		target: 1,
		label: "dn:isSectionOf",
	uri: "http://purl.org/datanode/ns/isSectionOf",
		type: "default",
		weight: 1,
	},{
		target: 4,
		label: "dn:relations",
	uri: "http://purl.org/datanode/ns/relations",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "6",
	uri: "http://purl.org/datanode/ex/0.2/DBREC/10#uselessTooGeneric",
	label: "ex:uselessTooGeneric",
	links: [{
		target: 5,
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
},]
