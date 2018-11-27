#!/bin/bash
docker run -d -p 6379:6379 --name warship_redis_rest redis:5
sleep 10
npm run lint
npm run test:integration
docker stop warship_redis_rest && docker rm warship_redis_rest