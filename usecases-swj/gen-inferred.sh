#!/bin/bash
thisdir=$(cd $(dirname "$0"); pwd)

for f in kis-dn kis-prov kis-prov-extended kis-dn-extended kis-prov-dn kis-prov-dn-extended
do
  echo $f
  sh ${thisdir}/../datanode/infer.sh ttl ${thisdir}/$f.ttl > ${thisdir}/$f-inferred.ttl
done

