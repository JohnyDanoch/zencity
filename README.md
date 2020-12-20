# Zencity telegram bots

## build image using docker & docker compose
```bash
docker-compose up -d	
```
## build & run server manually
if previouse example didn't work / you don't have docker or docker compose
you can do it manually in bash : 
```bash
cd client
npm install 
npm run build 
cd ..
npm install
node ./src/server.js
```

server will be served on
[link](http://localhost:4000)