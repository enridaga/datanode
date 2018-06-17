#!/bin/bash

generate(){
	format=$1
	file=$2
	echo "Use cases from $1"
	# perl -pe 's/.*?"(.*?)"\s*(.*?)\s*---\s*(.*?)\s*---/§\3 : a foaf:Document; rdfs:label \"\"\"\1\"\"\"@en;\n\trdfs:comment \"\"\"\2\"\"\"@en . /g'
	examplestr=$(tr '\n' ' ' < $file |perl -pe 's/(.*?".*?"\s*.*?\s*---\s*.*?\s*---)/§\1/g')
	examplestr=${examplestr#"§"}
	oldIFS=$IFS
	IFS="§"
	examples=$examplestr
		
	usecase=${file%.txt}
	mkdir -p "usecases"
	COUNTER=0
	echo "Working use cases from "$usecase
	size=${#examples[@]}
	echo "$size use cases"
	
	for example in $examples
	do
		extest=$(echo $example | perl -pe 's/.*?".*?"\s*.*?\s*---(\s*.*?\s*)---/\1/g' | tr -d ' ')
		example=$(echo "$example" | perl -pe 's/.*?"(.*?)"\s*(.*?)\s*---\s*(.*?)\s*---/\3 : a foaf:Document; rdfs:label \"\"\"\1\"\"\"@en;\n\trdfs:comment \"\"\"\2\"\"\"@en . /g')
		COUNTER=$((COUNTER+1))	
		if [[ "$extest" != "" ]]; then
			fn="usecases/$usecase""-"$COUNTER".ttl"
			#fndia="usecases/$usecase""-"$COUNTER".graphml"
			fndia="usecases/$usecase""-"$COUNTER"."$format
			echo "...writing use case $COUNTER to "$fn
			echo "@prefix : <http://purl.org/datanode/ex/0.2/$usecase/$COUNTER#> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . @prefix foaf: <http://xmlns.com/foaf/0.1/> .$example">$fn 
			rapper -q -g $fn -o turtle > $fn".rapper"
			rm $fn && mv $fn".rapper" $fn
			#./rdfdia.sh -v datanode.ttl -f $fn > $fndia
			./rdfdia.sh -o $format -v datanode.ttl -f $fn > $fndia
		else
			echo "...use case $COUNTER is not implemented"
		fi
	done
	IFS=$oldIFS
}

format=$1
skip=0
if [ $# -eq 1 ]; then
	files="AEMOO.txt DBREC.txt DISCOU.txt EventMedia.txt YokohamaArtSpot.txt SPUD.txt REXPLORE.txt"
else
	skip=1
	files=$@
fi
for file in $files
do
	[ "$skip" == "1" ] && skip=0 && continue
	generate $format $file
done
