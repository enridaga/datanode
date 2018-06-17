#!/bin/bash

[ $# != 2 ] && echo "usage: $0 user password" && exit 1

dir=$(cd $(dirname "$0"); pwd)

function put {
# 	echo "put $1 $2 $3"
        u=$1
        p=$2
        f=$3
	fn=$(basename $f)
        curl --digest --user $u:$p --url "http://localhost:8890/sparql-graph-crud-auth?graph-uri=urn:uc:swj:$fn" -T $f
}


put $1 $2 $dir/../datanode/src/datanode.ttl

for f in ${dir}/*.ttl 
do
 put $1 $2 $f
done
