#!/bin/bash
jardir=$(cd $(dirname "$0"); pwd)

for i in $@;
do
    params=" $params $i"
done
 java -jar ${jardir}/jena-reasoner-1.0.0-jar-with-dependencies.jar $params


