#!/bin/bash


for i in $@;
do
    params=" $params $i"
done


echo "Running ruby gentree.rb $params"
#export DYLD_LIBRARY_PATH=/opt/local/lib:$DYLD_LIBRARY_PATH && 
ruby gentree.rb $params
#unset DYLD_LIBRARY_PATH

