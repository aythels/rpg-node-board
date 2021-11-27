Prerequisite: MongoDB is installed on your machine (see https://docs.mongodb.com/manual/installation/#tutorials)

In order to set up a local version of the MongoDB database, run:

`mkdir mongo-data`

Inside this folder. Then run:

`mongod --dbpath mongo-data`

Ensure that the mongo-data folder is named correctly so it is seen by `.gitignore`.
