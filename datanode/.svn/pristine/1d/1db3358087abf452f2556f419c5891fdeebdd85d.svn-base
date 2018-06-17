#!/bin/bash

generate(){
	file=$1
	ontology=$2
	outdir="$3/ttl"
	src=$4
	#echo "Use cases from $1"
	# perl -pe 's/.*?"(.*?)"\s*(.*?)\s*---\s*(.*?)\s*---/§\3 : a foaf:Document; rdfs:label \"\"\"\1\"\"\"@en;\n\trdfs:comment \"\"\"\2\"\"\"@en . /g'
	examplestr=$(tr '\n' ' ' < $src/$file |perl -pe 's/(.*?".*?"\s*.*?\s*---\s*.*?\s*---)/§\1/g')
	examplestr=${examplestr#"§"}
	oldIFS=$IFS
	IFS="§"
	examples=$examplestr
		
	usecase=${file%.txt}
	mkdir -p "$outdir"
	COUNTER=0
	#echo "Working use cases from "$usecase
	size=${#examples[@]}
	#echo "$size use cases"
	
	for example in $examples
	do
		extest=$(echo $example | perl -pe 's/.*?".*?"\s*.*?\s*---(\s*.*?\s*)---/\1/g' | tr -d ' ')
		example=$(echo "$example" | perl -pe 's/.*?"(.*?)"\s*(.*?)\s*---\s*(.*?)\s*---/\3 : a foaf:Document; rdfs:label \"\"\"\1\"\"\"@en;\n\trdfs:comment \"\"\"\2\"\"\"@en . /g')
		COUNTER=$((COUNTER+1))	
		if [[ "$extest" != "" ]]; then
			fn="$outdir/$usecase""-"$COUNTER".ttl"
			#fndia="usecases/$usecase""-"$COUNTER".graphml"
			#fndia="$outdir/$usecase""-"$COUNTER"."$format
			echo "Generating "$fn
			echo "@prefix : <http://purl.org/datanode/ex/0.2/$usecase/$COUNTER#> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . @prefix foaf: <http://xmlns.com/foaf/0.1/> .$example">$fn 
			rapper -q -g $fn -o turtle > $fn".rapper"
			rm $fn && mv $fn".rapper" $fn
		else
			echo "Skipping $usecase-$COUNTER (not implemented)"
		fi
	done
	IFS=$oldIFS
}

if [ $# -eq 0 ]; then
	files=$(ls src|grep -i .txt)
else
	files=$@
fi

# generate TTL files for use cases
for file in $files
do
	generate $file src/datanode.ttl build/docs src	
done

# generate JS files
mkdir -p build/docs/js
for ttlf in $(ls build/docs/ttl | grep -i .ttl)
do
	usecase=${ttlf%.ttl}
	echo "Generating build/docs/js/$usecase.js"
	./rdfdia.sh -m links -o js -v src/datanode.ttl -f build/docs/ttl/$ttlf > build/docs/js/$usecase".js"
done

# generate js file for datanode
echo "Generating build/docs/js/datanode.js"
# only links here
#./rdfdia.sh -o js -m links -v src/datanode.ttl -f src/datanode.ttl > "build/docs/js/datanode.js"
./gentree.sh jstree -f src/datanode.ttl > build/docs/js/dntree.js

# generate GRAPHML files
mkdir -p build/docs/graphml
for ttlf in $(ls build/docs/ttl | grep -i .ttl)
do
	usecase=${ttlf%.ttl}
	echo "Generating build/docs/graphml/$usecase.graphml"
	./rdfdia.sh -o graphml -v src/datanode.ttl -f build/docs/ttl/$ttlf > build/docs/graphml/$usecase".graphml"
done
