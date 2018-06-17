#!/bin/bash

vok="http://www.enridaga.net/datavok/draft#"
rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
rdfs="http://www.w3.org/2000/01/rdf-schema#"
owl="http://www.w3.org/2002/07/owl#"

cd step-2

exec 3<terms_to_concepts.txt

parse_line(){
  line="$1"
  term=""
    entity=""
    note=""
    #echo "|$line|"
    term=$(echo "$line"|sed 's/^\([^ ]*\).*$/\1/' )
    if [[ $line =~ ^[^\ ]+\ +[^\ ]+.*$ ]]
    then
      entity=$(echo "$line"|sed 's/^\([^ ]*\) \([^ ]*\).*$/\2/' )
    fi
    if [[ "$line" =~ ^[^\ ]+\ [^\ ]+\ \".*\"$ ]]
    then
      note=$(echo "$line"|sed 's/^\([^ ]*\) \([^ ]*\) "\(.*\)" *$/\3/' )
    fi

    if [[ -n "$entity" ]]; then
      sbj=$(echo "<$vok"$entity">")
      #echo "$sbj <$rdf""type> <$rdfs""Resource> . "
      if [[ "$entity" =~ ^[A-Z] ]]; then
        echo "<$vok"$entity"> <$rdf""type> <$rdfs""Class> . "
      else
        echo "<$vok"$entity"> <$rdf""type> <$rdf""Property> . "
      fi
      echo "<$vok"$entity"> <$rdfs""label> \"$entity\"@en . "
      
      # we include annotations from use cases here
      # where
      wh=$(cd .. && sh where-is-term.sh "$term")
      note=$note" [ex: $term in $(echo $wh)]"
      st=$(cd .. && sh sentences-with-term.sh "$term")
      st=$(echo "$st" | sed -e 's/\(.*\)/\\n\1/' )
      st=\\nSentences": "\\n$st
      echo "<$vok"$entity"> <$rdfs""comment> \"\"\"$note "$st" \"\"\"@en . "
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

