#!/bin/bash
cd step-1
cat *.txt|grep ">>"|sed -e "s/^.*>> *\(.*\)$/\1/"| xargs echo -n | sed -e "s/,/ /g" | sed -e "s/  / /g" | tr " " "\n"|sort|uniq
