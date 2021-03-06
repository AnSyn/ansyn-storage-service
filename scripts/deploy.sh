#!/bin/bash

target=$1
echo "target $target"
if [ -z "$target" ]
then
	echo "Missing deployment target"
	exit 1
fi

version=$2
echo "version $version"
if [ -z "$version" ]
then
	echo "Missing deployment version"
	exit 1
fi

service=$3
echo "service $service"
if [ -z "$service" ]
then
    echo "Missing ECS service name"
    exit 1
fi

echo "start deploying version $version on target $target"

# Login to the Docker registry
eval $(aws ecr get-login --no-include-email --region us-west-2)

# Build and tag
docker build -t "$target:$version" .
docker tag "$target:$version" "223455578796.dkr.ecr.us-west-2.amazonaws.com/$target:latest"
docker tag "$target:$version" "223455578796.dkr.ecr.us-west-2.amazonaws.com/$target:$version"

# Push the new image
docker push "223455578796.dkr.ecr.us-west-2.amazonaws.com/$target:latest"
docker push "223455578796.dkr.ecr.us-west-2.amazonaws.com/$target:$version"

echo "deployment succeeded";

node scripts/kill-tasks.js $service

