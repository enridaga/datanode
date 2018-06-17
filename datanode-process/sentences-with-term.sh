#!/bin/bash
cd step-1
[ $# -eq 0 ] && cat *.txt|grep ">>"|sed -e "s/\(.*\)>>.*$/\1/" | sed -e "s/^.\{1,5\}) //"|sort|uniq
if [ $# -eq 1 ]; then 
  cat *.txt|grep ">>"|egrep ">>.* $1" 
  ##|sed -e "s/\(.*\)>>.*$/\1/" | sed -e "s/^.\{1,5\}) //"|sort|uniq
fi
