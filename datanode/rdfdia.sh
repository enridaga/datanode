#!/bin/bash
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done

for i in $@;
do
    params=" $params $i"
done

# echo "Params: $params"
DIR="$( cd "$( dirname "$SOURCE" )" && pwd )"
export DYLD_LIBRARY_PATH=/opt/local/lib:$DYLD_LIBRARY_PATH && ruby -I $DIR $DIR/rdfdia.rb $params
unset DYLD_LIBRARY_PATH

