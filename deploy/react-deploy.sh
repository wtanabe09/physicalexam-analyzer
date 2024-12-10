#!/bin/sh
docker compose run --rm node npm run build
aws s3 sync --delete --region us-east-1 ../react-app/build/ s3://physical-exam-app

