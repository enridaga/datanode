#!/bin/bash

version=${1:-0.6-SNAPSHOT}
datanode=src/datanode-$version.ttl
echo "Datanode source file: "$datanode
build="build/"$version
echo "Build folder: "$build

rm -rf $build && mkdir $build && mkdir $build/docs && mkdir $build/ns && mkdir $build/docs/graphml
echo "Generating GraphML files for Datanode and each branch"
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/relatedWith" > $build/docs/graphml/datanode.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/about" > $build/docs/graphml/about.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/overlappingCapabilityWith" > $build/docs/graphml/overlappingCapability.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/sharesInterpretationWith" > $build/docs/graphml/sharesInterpretationWith.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/differentCapabilityFrom" > $build/docs/graphml/differentCapability.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/consistentWith" > $build/docs/graphml/consistentWith.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/inconsistentWith" > $build/docs/graphml/inconsistentWith.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/hasUpdate" > $build/docs/graphml/hasUpdate.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/versionOf" > $build/docs/graphml/version.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/hasVocabulary" > $build/docs/graphml/hasVocabulary.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/hasPart" > $build/docs/graphml/hasPart.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/adjacentTo" > $build/docs/graphml/adjacent.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/hasDerivation" > $build/docs/graphml/hasDerivation.graphml
./rdftree.py pgraphml -f $datanode -r "http://purl.org/datanode/ns/references" > $build/docs/graphml/references.graphml
echo "Copying main datanode file to ns/index.ttl"
cp $datanode $build/ns/index.ttl
echo "Copying .htaccess and type map file"
cp docs-src/htaccess.txt $build/ns/.htaccess
cp docs-src/index.txt $build/ns/index.txt
echo "Generating inferred version /ns/index.inf.ttl"
./infer.sh ttl $build/ns/index.ttl > $build/ns/index.inf.ttl
echo "Generating versions in other RDF syntaxes"
./trans.sh $build/ns/index.ttl 
echo "Generating GraphML of /ns/index.inf.ttl"
./rdftree.py pgraphml -f $build/ns/index.inf.ttl -r "http://purl.org/datanode/ns/relatedWith" > $build/docs/graphml/datanode.inf.graphml

######################################################################################################
echo "Generate documenation files"


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
			echo " - Generating "$fn
			echo "@prefix : <http://purl.org/datanode/ex/0.2/$usecase/$COUNTER#> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . @prefix foaf: <http://xmlns.com/foaf/0.1/> .$example">$fn 
			rapper -q -g $fn -o turtle > $fn".rapper"
			rm $fn && mv $fn".rapper" $fn
		else
			echo "Skipping $usecase-$COUNTER (not implemented)"
		fi
	done
	IFS=$oldIFS
}

files=$(ls src/usecases|grep -i .txt)

echo "Generate TTL files for use cases"
for file in $files
do
	echo " - $file"
	generate $file $datanode $build/docs src/usecases	
done

echo "Generate JS files for diagrams"
mkdir -p $build/docs/js
for ttlf in $(ls $build/docs/ttl | grep -i .ttl)
do
	usecase=${ttlf%.ttl}
	echo " - $usecase (build/docs/js/$usecase.js)"
	./rdfdia.py -m links -o js -V $datanode -f $build/docs/ttl/$ttlf > $build/docs/js/$usecase".js"
done

# generate js file for datanode
echo "Generating $build/docs/js/datanode.js"
# only links here
#./rdfdia.sh -o js -m links -v src/datanode.ttl -f src/datanode.ttl > "build/docs/js/datanode.js"
./rdftree.py jstree -f $datanode -r "http://purl.org/datanode/ns/relatedWith" > $build/docs/js/dntree.js

# generate GRAPHML files
mkdir -p $build/docs/graphml
for ttlf in $(ls $build/docs/ttl | grep -i .ttl)
do
	usecase=${ttlf%.ttl}
	echo "Generating $build/docs/graphml/$usecase.graphml"
	./rdfdia.py -o graphml -V $datanode -f $build/docs/ttl/$ttlf > $build/docs/graphml/$usecase".graphml"
done

echo "Generate HTML Website for version $version"
./gendocshtml.js $version


