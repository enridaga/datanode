#!/bin/bash


for i in $@;
do
    params=" $params $i"
done


export DYLD_LIBRARY_PATH=/opt/local/lib:$DYLD_LIBRARY_PATH && ruby1.9 gentree.rb $params
unset DYLD_LIBRARY_PATH

