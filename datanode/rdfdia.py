#!/usr/bin/env python
# 

import sys
import os.path
import os
import json
import argparse
import re
from rdflib import Graph, Literal, BNode, Namespace, RDF, URIRef
from rdflib.namespace import RDF, OWL, RDFS, NamespaceManager

from rdftree import Vok

import logging
logging.basicConfig()

class Dia:

    def __init__(self, data, vok, modifier='all'):
        # body of the constructor
        self._datafile = data
        g = Graph()
        self._data = g.parse(self._datafile, format="turtle")
        self._namespaces = NamespaceManager(self._data)
        self._vok = vok
        self._modifier = modifier
        self._namespaces.bind("yago","http://yago-knowledge.org/resource/")
        self._namespaces.bind("rdf","http://www.w3.org/1999/02/22-rdf-syntax-ns#")
        self._namespaces.bind("foaf","http://xmlns.com/foaf/0.1/")
        self._namespaces.bind("dbp","http://dbpedia.org/property/")
        self._namespaces.bind("owl","http://www.w3.org/2002/07/owl#")
        self._namespaces.bind("dc","http://purl.org/dc/elements/1.1/")
        self._namespaces.bind("rdfs","http://www.w3.org/2000/01/rdf-schema#")
        self._namespaces.bind("dbo","http://dbpedia.org/ontology/")
        self._namespaces.bind("rss","http://purl.org/rss/1.0/")
        self._namespaces.bind("skos","http://www.w3.org/2004/02/skos/core#")
        self._namespaces.bind("void","http://rdfs.org/ns/void#")
        self._namespaces.bind("dn","http://purl.org/datanode/ns/")
        self._namespaces.bind("ex","http://purl.org/datanode/ex/")
        self._namespaces.bind("dct","http://purl.org/dc/terms/")
    
    def entities(self):
        entities = []
        for s,p,o in self._data.triples( (None, None, None) ):
            if s not in entities:
                entities.append(s)
            if o not in entities and isinstance(o, URIRef):
                entities.append(s)
        return entities


        
    def jsobject(self):
        print('var nodes=[')
        first = True
        nodes=[]
        for s,p in list(self._data.subject_predicates(None)):
            if str(p).startswith('http://purl.org/datanode/ns/') and s not in nodes:
                nodes.append(s)
        for p,s in list(self._data.predicate_objects(None)):
            if str(p).startswith('http://purl.org/datanode/ns/') and s not in nodes:
                nodes.append(s)

        for node in nodes:
            if first:
                first = False
            else:
                print(",")
                
            links = []
            for (pred, obj) in self._data.predicate_objects(node):
                if str(pred).startswith('http://purl.org/datanode/ns/'):
                    links.append({
                        'target': nodes.index(obj),
                        'label': self.label(pred),
                        'uri': pred.encode('utf-8'),
                        'type': 'default',
                        'weight': 1
                    })
            
            n = {
                'id': str(nodes.index(node)),
                'uri': node.encode('utf-8'),
                'label': self.label(node),
                'links': links
            }
            print(json.dumps(n))
        print("]")

    def label(self, o, useHtml = False):
        if o in vok.graph().subjects():
            return vok.label(o)
        else:
            if isinstance(o, URIRef):
                if str(o).startswith('http://purl.org/datanode/ex/'):
                    # hack, override ex namespace
                    ns = "http://purl.org/datanode/ex/"
                    if str(o).find('#') > -1:
                        ns = str(o).rsplit('#')[0] + '#'
                    else:
                        ns = str(o).rsplit('/')[0] + '/'
                    self._namespaces.bind('ex', ns)
                try:
                    return next(iter(self._data.objects(o, RDFS.label) or []), self._namespaces.qname(o))
                except:
                    return o.encode('utf-8')
            if isinstance(o, BNode):
                return str(o)
            else:
                # literal
                if useHtml:
                    html = re.sub("([^\.?!]{20,30}[\.?!])|([^,0-9]{20,30},)", "\0<br/>", str(o))
                    html = re.sub("[0-9]{1,3}\)", "<br/>\0", html)
                    html = cgi.escape(html);
                    html = "<html>" + html + "</html>"
                    html = re.sub("\<",'&lt;', html)
                    html = re.sub("\>",'&gt;', html)
                    return html
                else:
                    return o.encode('utf-8')
        

    
    def graphml(self):
            print("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>")
            print("<graphml \n\txmlns=\"http://graphml.graphdrawing.org/xmlns\" ")
            print("\txmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ")
            print("\txmlns:y=\"http://www.yworks.com/xml/graphml\" ")
            print("\txmlns:yed=\"http://www.yworks.com/xml/yed/3\" ")
            print("\txsi:schemaLocation=\"http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd\">")
            print("\t\t<key attr.name=\"label\" attr.type=\"string\" for=\"node\" id=\"k_label\"/>")
            print("\t\t<key for=\"node\" id=\"key_nodegraphics\" yfiles.type=\"nodegraphics\"/>")
            print("\t\t<key for=\"edge\" id=\"key_edgegraphics\" yfiles.type=\"edgegraphics\"/>")
            #puts "<key attr.name=\"description\" attr.type=\"string\" for=\"node\" id=\"d5\"/>"
            print("\t<graph edgedefault=\"directed\" id=\"G\">")
            
            for node in self.entities():
                print ("<!-- " + node + " -->")
                nodel = self.label(node, True)
                print ("<!-- " + nodel.encode('utf-8') + " -->")
                print ("\t\t<node id=\"n" + str(id(node)) + "\">")
                print ("\t\t\t<data key=\"k_label\"><![CDATA[" + node.encode('utf-8') + "]]></data>")
                print ("\t\t\t<data key=\"d5\"><![CDATA[" + node.encode('utf-8') + "]]></data>")
                print ("\t\t\t<data key=\"key_nodegraphics\">")
                print ("\t\t\t\t<y:GenericNode configuration=\"com.yworks.flowchart.start1\">")
                print ("\t\t\t\t\t<y:Fill color=\"#FFFFFF\" transparent=\"true\"/>")
                print ("\t\t\t\t\t<y:BorderStyle color=\"#FFFFFF\" transparent=\"true\" type=\"line\" width=\"0.0\"/>")
                print ("\t\t\t\t\t<y:NodeLabel ")
                print (">" + nodel.encode('utf-8') + "<y:LabelModel><y:SmartNodeLabelModel distance=\"4.0\"/></y:LabelModel> ")
                print ("<y:ModelParameter> ")
                print ("<y:SmartNodeLabelModelParameter ")
                print ("/>")
                print ("</y:ModelParameter>")
                print ("</y:NodeLabel>")
                print ("\t\t\t\t</y:GenericNode>")
                print ("\t\t\t</data>")
                print ("\t\t</node>")
                for (link, to) in self._data.predicate_objects(node):
                    edgeId = 0
                    print("<!-- " + to.encode('utf-8') + " -->")
                    edgeId = str(id(node)) + "_" + str(id(link)) + "_" + str(id(to))
                    edgel = self.label(link, True)
                    print("\t\t<edge id=\"e_" + edgeId + "\" source=\"n" + str(id(node)) + "\" target=\"n" + str(id(to)) + "\">")
                    print("\t\t\t<data key=\"key_edgegraphics\">")
                    print("\t\t\t<y:BezierEdge>")
                    print("\t\t\t\t<y:LineStyle color=\"#000000\" type=\"line\" width=\"2.0\"/>")
                    print("\t\t\t\t<y:Arrows source=\"none\" target=\"white_delta\"/>")
                    print("\t\t\t\t<y:EdgeLabel>" + edgel.encode('utf-8') + "</y:EdgeLabel>")
                    print("\t\t\t</y:BezierEdge>")
                    print("\t\t\t</data>")
                    print("\t\t</edge>")

            print("\t</graph>")
            print("</graphml>")

if __name__ == "__main__" :
    parser = argparse.ArgumentParser(description='Rdfdia python script to generate GraphML diagrams from RDF data snippets.', version='1.0.0c - Enrico Daga')
    parser.add_argument('-f', '--file', metavar='F', type=str, nargs=1,
                        help='RDF data file name.')
    parser.add_argument('-V', '--vocabulary', metavar='V', type=str, nargs=1,
                        help='RDF Vocabulary file.')
    parser.add_argument('-o', '--output', metavar='O', type=str, nargs=1,
                        help='Output type: graphml or js.', choices=['graphml','js'])
    parser.add_argument('-m', '--modifier', metavar='V', type=str, nargs=1,
                        help='Modifier (links | all).', choices=['links','all'], default='all')
    args = parser.parse_args()

    if not os.path.isfile(str(args.file[0])):
        print('Error! File ' + args.file[0] + ' does not exists')
        print('')
        parser.print_help()
        exit()
    if not os.path.isfile(str(args.vocabulary[0])):
        print('Error! File ' + args.vocabulary[0] + ' does not exists')
        print('')
        parser.print_help()
        exit()

    data = args.file[0]
    voc = args.vocabulary[0]
    output = args.output[0]
    modifier = args.modifier[0]
    
    vok = Vok(os.path.abspath(args.file[0]), 'http://purl.org/datanode/ns/relatedWith')
    dia = Dia(data, vok, modifier)
    
    if output == 'graphml':
        dia.graphml()

    if output == 'js':
        dia.jsobject()

    #print(args.accumulate(args.integers))
    
