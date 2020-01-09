#!/usr/bin/env python
# 

import sys
import os.path
import os
import json
import argparse
from rdflib import Graph, Literal, BNode, Namespace, RDF, URIRef
from rdflib.namespace import RDF, OWL, RDFS

class Vok:
    
    def _initialize(self):
        g = Graph()
        self._graph = g.parse(self._filename, format="turtle")

    def labels(self):
        for (subj, pred, obj) in self._graph:
            #print(subj)
            print(self.label(subj))
        
    def label(self, uri):
        l = str(uri)
        for label in self._graph.objects(uri, RDFS.label):
            l = label
            break
        flags = ""
        if self._symmetric(uri): 
            flags = flags + "S"
        if self._asymmetric(uri):
            flags = flags + "A"
        if self._transitive (uri):
            flags = flags + "T"
        if self._reflexive (uri):
            flags = flags + "R"
        if self._functional (uri):
            flags = flags + "F"
        if self._inversefunctional (uri):
            flags = flags + "I"
        if self._irreflexive (uri):
            flags = flags + "X"
        if flags != "":
            l = l + " [" + flags + "] "
        return l

    def graph(self):
        return self._graph;
        
    def _types(self, uri):
        return self._graph.objects(uri, RDF.type)
    
    def _symmetric(self, uri):
        return OWL.SymmetricProperty in self._graph.objects(uri, RDF.type)
    
    def _asymmetric(self, uri):
        return OWL.AsymmetricProperty in self._graph.objects(uri, RDF.type)
    
    def _transitive(self, uri):
        return OWL.TransitiveProperty in self._graph.objects(uri, RDF.type)

    def _functional(self, uri):
        return OWL.FunctionalProperty in self._graph.objects(uri, RDF.type)

    def _inversefunctional(self, uri):
        return OWL.InverseFunctionalProperty in self._graph.objects(uri, RDF.type)
    
    def _reflexive(self, uri):
        return OWL.ReflexiveProperty in self._graph.objects(uri, RDF.type)
    
    def _irreflexive(self, uri):
        return OWL.IrreflexiveProperty in self._graph.objects(uri, RDF.type)

    def __init__(self, filename, root):
        # body of the constructor
        self._filename = filename
        self._root = root
        self._initialize()
        
    def _buildJsTreeNode(self, node):
        childnodes = self._graph.subjects(RDFS.subPropertyOf, node)
        children = []
        for child in childnodes:
            children.append(self._buildJsTreeNode(child))
        return {
            'name': str(self.label(node)),
            'children': children
        }
        
    def jstree(self):
        print('var nodes=')
        # first = 1
#         for node in self._graph.subjects(RDFS.subPropertyOf * '*', URIRef(self._root)):
#             if first:
#                 first = 0
#             else:
#                 print(",")
        print(json.dumps(self._buildJsTreeNode(URIRef(self._root))))
        print ('')
        
    def js(self):
        print('var nodes=[')
        # create index of nodes
        nodes = []
        for subj in self._graph.subjects(RDFS.subPropertyOf * '*', URIRef(self._root)):
            nodes.append(subj)
        
        # Generate objects
        first = 1
        for node in nodes:
            if first:
                first = 0
            else:
                print(",")
            ix = nodes.index(node)
            links = []
            children = self._graph.subjects(RDFS.subPropertyOf, node)
            for child in children:
                links.append({
                    'target': nodes.index(child),
                    'label': '', 'type': 'default', 'weight': 1
                })
            o = {
                'id': str(ix),
                'uri': str(node),
                'label': self.label(node),
                'links': links
            }
            print(json.dumps(o))
        
        print (']')
        
    def _printGraphMLNode(self, node):
        hash = str(id(node))
        label = self.label(node)
        print ("\t\t<node id=\"n" + hash + "\">")
        print ("\t\t\t<data key=\"k_label\"><![CDATA[" + label + "]]></data>")
        print ("\t\t\t<data key=\"d5\"><![CDATA[" + label + "]]></data>")
        print ("\t\t\t<data key=\"key_nodegraphics\">")
        print ("\t\t\t\t<y:GenericNode configuration=\"com.yworks.flowchart.start1\">")
        print ("\t\t\t\t\t<y:Fill color=\"#FFFFFF\" transparent=\"true\"/>")
        print ("\t\t\t\t\t<y:BorderStyle color=\"#FFFFFF\" transparent=\"true\" type=\"line\" width=\"0.0\"/>")
        print ("\t\t\t\t\t<y:NodeLabel ")
        print (">#{node}<y:LabelModel><y:SmartNodeLabelModel distance=\"4.0\"/></y:LabelModel> ")
        print ("<y:ModelParameter> ")
        print ("<y:SmartNodeLabelModelParameter ")
        print ("/>")
        print ("</y:ModelParameter>")
        print ("</y:NodeLabel>")
        print ("\t\t\t\t</y:GenericNode>")
        print ("\t\t\t</data>")
        print ("\t\t</node>")
        children = self._graph.subjects(RDFS.subPropertyOf, node)
        for child in children:
            if node == child:
                continue
            source = str(id(child))
            target = hash
            edgeId = source + '_' + target
            print("\t\t<edge id=\"e_" + edgeId + "\" source=\"n" + source + "\" target=\"n" + target + "}\">")
            print("\t\t\t<data key=\"key_edgegraphics\">")
            print("\t\t\t<y:BezierEdge>")
            print("\t\t\t\t<y:LineStyle color=\"#000000\" type=\"line\" width=\"2.0\"/>")
            print("\t\t\t\t<y:Arrows source=\"none\" target=\"white_delta\"/>")
            print("\t\t\t</y:BezierEdge>")
            print("\t\t\t</data>")
            print("\t\t</edge>")
            self._printGraphMLNode(child)
    
    def pgraphml(self):
        print ("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>")
        print  ("<graphml \n\txmlns=\"http://graphml.graphdrawing.org/xmlns\" ")
        print  ("\txmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ")
        print  ("\txmlns:y=\"http://www.yworks.com/xml/graphml\" ")
        print  ("\txmlns:yed=\"http://www.yworks.com/xml/yed/3\" ")
        print  ("\txsi:schemaLocation=\"http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd\">")
        print  ("\t\t<key attr.name=\"label\" attr.type=\"string\" for=\"node\" id=\"k_label\"/>")
        print  ("\t\t<key for=\"node\" id=\"key_nodegraphics\" yfiles.type=\"nodegraphics\"/>")
        print  ("\t\t<key for=\"edge\" id=\"key_edgegraphics\" yfiles.type=\"edgegraphics\"/>")
        print  ("\t<graph edgedefault=\"directed\" id=\"G\">")
        
        self._printGraphMLNode(URIRef(self._root))
        
        print  ("\t</graph>")
        print ("</graphml>")

	

if __name__ == "__main__" :
    parser = argparse.ArgumentParser(description='Rdftree python script to generate tree-like structures from RDF graphs.', version='1.0.0c - Enrico Daga')
    parser.add_argument('command', metavar='C', type=str, nargs=1, choices=['js','jstree','pgraphml'],
                        help='Command. One of: js jstree ptree pgraphml')
    parser.add_argument('-f', '--file', metavar='F', type=str, nargs=1,
                        help='RDF vocabulary file name.')
    parser.add_argument('-r', '--root', metavar='R', type=str, nargs=1,
                        help='URI of the entity root of the output tree.')
    args = parser.parse_args()

    if not os.path.isfile(str(args.file[0])):
        print('Error! File ' + args.file[0] + ' does not exists')
        print('')
        parser.print_help()
        exit()
        
    vok = Vok(os.path.abspath(args.file[0]), args.root[0])
    if args.command[0] == 'js':
       vok.js()
    if args.command[0] == 'jstree':
       vok.jstree()
    if args.command[0] == 'pgraphml':
       vok.pgraphml()
    #print(args.accumulate(args.integers))