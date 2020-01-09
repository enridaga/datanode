#!/bin/bash

rm -rf build && mkdir build && mkdir build/docs && mkdir build/ns && mkdir build/docs/graphml
echo "Generating GraphML files for Datanode and each branch"
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/relatedWith" > build/docs/graphml/datanode.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/about" > build/docs/graphml/about.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/overlappingCapabilityWith" > build/docs/graphml/overlappingCapability.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/sharesInterpretationWith" > build/docs/graphml/sharesInterpretationWith.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/differentCapabilityFrom" > build/docs/graphml/differentCapability.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/consistentWith" > build/docs/graphml/consistentWith.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/inconsistentWith" > build/docs/graphml/inconsistentWith.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/hasUpdate" > build/docs/graphml/hasUpdate.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/versionOf" > build/docs/graphml/version.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/hasVocabulary" > build/docs/graphml/hasVocabulary.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/hasPart" > build/docs/graphml/hasPart.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/adjacentTo" > build/docs/graphml/adjacent.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/hasDerivation" > build/docs/graphml/hasDerivation.graphml
./rdftree.py pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/references" > build/docs/graphml/references.graphml
echo "Copying main datanode file to ns/index.ttl"
cp src/datanode.ttl build/ns/index.ttl
echo "Copying .htaccess file"
cp docs-src/htaccess.txt build/ns/.htaccess
echo "Generating inferred version /ns/index.inf.ttl"
./infer.sh ttl build/ns/index.ttl > build/ns/index.inf.ttl
echo "Generating versions in other RDF syntaxes"
./trans.sh build/ns/index.ttl 
echo "Generating GraphML of /ns/index.inf.ttl"
./rdftree.py pgraphml -f build/ns/index.inf.ttl -r "http://purl.org/datanode/ns/relatedWith" > build/docs/graphml/datanode.inf.graphml

echo "Generate documenation files"
./gendocsdata.sh
#exit 1
./gendocshtml.js


