1. Run `mongod --dbpath mongo-data`
2. In another terminal, run

   ```
   mongoimport --db=RpgAPI --type=json --jsonArray --collection=user --file=mock-data/user.json
   mongoimport --db=RpgAPI --type=json --jsonArray --collection=game --file=mock-data/game.json
   ```

   NOTE: Theres a typo where the imported data is created under the improper collection name

3. In another terminal, run `npm run dev`

4. Open MongoDBCompass and connect: `mongodb://localhost:27017/RpgAPI`

5. Send your API requests to localhost:5000/api/<route>
