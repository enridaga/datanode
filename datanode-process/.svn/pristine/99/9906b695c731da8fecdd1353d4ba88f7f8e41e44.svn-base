#!/bin/bash

vok="http://www.enridaga.net/datavok/draft#"
rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
rdfs="http://www.w3.org/2000/01/rdf-schema#"
owl="http://www.w3.org/2002/07/owl#"

cd step-2

exec 3<concepts_subsumptions.txt

parse_line(){
  line="$1"
    entity=""
    parent=""
    entity=$(echo "$line"|sed 's/^\([^ ]*\).*$/\1/' )
    parent=$(echo "$line"|sed 's/^\([^ ]*\) \([^ ]*\).*$/\2/' )
    [[ "$entity" == "$parent" ]] &&  return
    if [[ -n "$entity" ]]; then
      if [[ "$entity" =~ ^[A-Z] ]]; then
        echo "<$vok"$entity"> <$rdfs""subClassOf> <$vok""$parent> . "
      else
        echo "<$vok"$entity"> <$rdfs""subPropertyOf> <$vok""$parent> . "
      fi
    fi
}

process(){
 while read -u3 line
 do
  buf=$(parse_line "$line")
  echo "$buf"
 done
}

echo "$(process|sort|uniq)"

