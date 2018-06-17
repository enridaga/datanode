var nodes=
[{ 
	id: "0",
	uri: "http://purl.org/datanode/ex/0.2/REXPLORE/1#backgroundKnowledge",
	label: "ex:backgroundKnowledge",
	links: [{
		target: 1,
		label: "dn:hasPart",
	uri: "http://purl.org/datanode/ns/hasPart",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "1",
	uri: "http://purl.org/datanode/ex/0.2/REXPLORE/1#corpusOfPublications",
	label: "ex:corpusOfPublications",
	links: [],
},{ 
	id: "2",
	uri: "http://purl.org/datanode/ex/0.2/REXPLORE/1#geographicInformation",
	label: "ex:geographicInformation",
	links: [{
		target: 0,
		label: "dn:isExtractionOf",
	uri: "http://purl.org/datanode/ns/isExtractionOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "3",
	uri: "http://purl.org/datanode/ex/0.2/REXPLORE/1#knowledgeBase",
	label: "ex:knowledgeBase",
	links: [{
		target: 0,
		label: "dn:combinationFrom",
	uri: "http://purl.org/datanode/ns/combinationFrom",
		type: "default",
		weight: 1,
	},{
		target: 4,
		label: "dn:combinationFrom",
	uri: "http://purl.org/datanode/ns/combinationFrom",
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
	id: "4",
	uri: "http://purl.org/datanode/ex/0.2/REXPLORE/1#statisticsResults",
	label: "ex:statisticsResults",
	links: [{
		target: 0,
		label: "dn:isStatisticOf",
	uri: "http://purl.org/datanode/ns/isStatisticOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "5",
	uri: "http://purl.org/datanode/ex/0.2/REXPLORE/1#ontology",
	label: "ex:ontology",
	links: [{
		target: 6,
		label: "dn:describes",
	uri: "http://purl.org/datanode/ns/describes",
		type: "default",
		weight: 1,
	},{
		target: 7,
		label: "dn:hasRelations",
	uri: "http://purl.org/datanode/ns/hasRelations",
		type: "default",
		weight: 1,
	},{
		target: 3,
		label: "dn:isPartOf",
	uri: "http://purl.org/datanode/ns/isPartOf",
		type: "default",
		weight: 1,
	},],
},{ 
	id: "6",
	uri: "http://purl.org/datanode/ex/0.2/REXPLORE/1#topicsSet",
	label: "ex:topicsSet",
	links: [],
},{ 
	id: "7",
	uri: "http://purl.org/datanode/ex/0.2/REXPLORE/1#semanticRelations",
	label: "ex:semanticRelations",
	links: [],
},]
