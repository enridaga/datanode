#!/bin/bash

rm -rf build && mkdir build && mkdir build/docs && mkdir build/docs/graphml

./gentree.sh ptree -f src/datanode.ttl > build/ptree.txt
./gentree.sh pgraphml -f src/datanode.ttl > build/docs/graphml/datanode.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/about" > build/docs/graphml/about.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/overlappingCapabilityWith" > build/docs/graphml/overlappingCapability.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/differentCapabilityFrom" > build/docs/graphml/differentCapability.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/consistentWith" > build/docs/graphml/consistentWith.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/inconsistentWith" > build/docs/graphml/inconsistentWith.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/hasUpdate" > build/docs/graphml/hasUpdate.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/versionOf" > build/docs/graphml/version.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/hasVocabulary" > build/docs/graphml/hasVocabulary.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/hasPart" > build/docs/graphml/hasPart.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/adjacentTo" > build/docs/graphml/adjacent.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/hasDerivation" > build/docs/graphml/hasDerivation.graphml
./gentree.sh pgraphml -f src/datanode.ttl -r "http://purl.org/datanode/ns/references" > build/docs/graphml/references.graphml

./infer.sh ttl src/datanode.ttl > build/datanode.inf.ttl
./gentree.sh ptree -f build/datanode.inf.ttl > build/inf-ptree.txt
./gentree.sh pgraphml -f build/datanode.inf.ttl > build/docs/graphml/datanode.inf.graphml
./gendocsdata.sh
./gendocshtml.js


