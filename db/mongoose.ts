// FILE COPIED FROM EXAMPLE

/* This module will hold our connection to 
our mongo server through the Mongoose API.
We will access the connection in our express server. */
import mongoose from 'mongoose';

/* Connnect to our database */
// Get the URI of the local database, or the one specified on deployment.
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';

mongoose.connect(mongoURI, {
  // These options were included in the example code but cause Typescript errors:
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useCreateIndex: true,
});

export default mongoose; // Export the active connection.
