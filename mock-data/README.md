1. Run `mongod --dbpath mongo-data`
2. In another terminal, run

   ```
   mongoimport --db=RpgAPI --type=json --jsonArray --collection=user --file=mock-data/user.json
   mongoimport --db=RpgAPI --type=json --jsonArray --collection=game --file=mock-data/game.json
   ```
