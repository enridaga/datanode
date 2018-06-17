#!/bin/bash

exec 3<step-2/terms_to_concepts.txt

process(){
 while read -u3 line
 do
  concepts=$(echo "$line"|sed 's/^[^ ]* \([^ ]*\).*$/\1/' )  
  echo "$concepts"
 done
}

echo "$(process|sort|uniq)"

