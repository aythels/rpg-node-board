import path from 'path';
import cors from 'cors';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const session = require("express-session");
const MongoStore = require('connect-mongo') // to store session information on the database in production

import { userRouter, gameRouter, nodeRouter, subnodeRouter } from './routes';



// starting the express server
const app = express();

if (process.env.NODE_ENV !== 'production') {
  // Enable CORS for local React development server to connect to the web server
  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
  }
  app.use(cors(corsOptions));
} else {
  // const corsOptions = {
  //   origin: 'https://rpg-nodes.herokuapp.com/', //if all else fails....
  //   credentials: true,
  //   optionSuccessStatus: 200,
  // }
  // app.use(cors(corsOptions));
  // app.use(cors()); 

}

const env = process.env.NODE_ENV // read the environment variable (will be 'production' in production mode)

const USE_TEST_USER = env !== 'production' && process.env.TEST_USER_ON // option to turn on the test user.
const TEST_USER_ID = '5fb8b011b864666580b4efe3' // the id of our test user (you will have to replace it with a test user that you made). can also put this into a separate configutation file
const TEST_USER_EMAIL = 'test@user.com'

if (USE_TEST_USER) {
  console.log("test usre mode is on")
} else {
  console.log("not")
}

// console.log(proscess.env)


console.log(`Server running in ${process.env.NODE_ENV} mode`);

// mongoose and mongo connection
mongoose.set('bufferCommands', false); // don't buffer db requests if the db server isn't connected - minimizes http requests hanging if this is the case.

// These options were included in the example code but cause Typescript errors:
// mongoose.set('useFindAndModify', false); // for some deprecation issues

// body-parser: middleware for parsing HTTP JSON body into a usable object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*** Session handling **************************************/
// express-session for managing user sessions

/// Middleware for creating sessions and session cookies.
// A session is created on every request, but whether or not it is saved depends on the option flags provided.

app.use(
  session({
    secret: 'our hardcoded secret', // later we will define the session secret as an environment variable for production. for now, we'll just hardcode it.
    cookie: {
      // the session cookie sent, containing the session id.
      maxAge: 3600000, // 1 hour expiry (TODO: lookup what is best for this)
      httpOnly: true, // important: saves it in only browser's memory - not accessible by javascript (so it can't be stolen/changed by scripts!).
    },

    // Session saving options
    saveUninitialized: false, // don't save the initial session if the session object is unmodified (for example, we didn't log in).
    resave: true, // don't resave an session that hasn't been modified.
    // store: env === 'production' ? MongoStore.create({
    //   mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/RpgAPI'
    // }) : null
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/RpgAPI'
    })
  }),
);


// Add routes
app.use('/api', userRouter);
app.use('/api', gameRouter);
app.use('/api', nodeRouter);
app.use('/api', subnodeRouter);


// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Fallback route
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});

// This must be here and at the end or else requests with bad syntax will crash the server -elson
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(400).send('Server error caught');
});

/*************************************************/

// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
