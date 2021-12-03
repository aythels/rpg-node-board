import path from 'path';
import cors from 'cors';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import { userRouter, gameRouter, nodeRouter } from './routes';

// starting the express server
const app = express();

if (process.env.NODE_ENV !== 'production') {
  // Enable CORS for local React development server to connect to the web server
  app.use(cors());
}

console.log(`Server running in ${process.env.NODE_ENV} mode`);

// mongoose and mongo connection
mongoose.set('bufferCommands', false); // don't buffer db requests if the db server isn't connected - minimizes http requests hanging if this is the case.

// These options were included in the example code but cause Typescript errors:
// mongoose.set('useFindAndModify', false); // for some deprecation issues

// body-parser: middleware for parsing HTTP JSON body into a usable object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add routes (This must be on top)
app.use('/api', userRouter);
app.use('/api', gameRouter);
app.use('/api', nodeRouter);

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
    resave: false, // don't resave an session that hasn't been modified.
  }),
);

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
