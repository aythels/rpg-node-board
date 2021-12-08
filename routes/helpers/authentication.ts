import { Request, Response, NextFunction } from 'express';
import { GameModel, UserModel } from '../../db/models';

declare module 'express-session' {
  export interface SessionData {
    user: string; // user ID
  }
}
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {

  // const TEST_USER_ID = '61a9db37d7c3cec99261a400' // the id of our test user (you will have to replace it with a test user that you made). can also put this into a separate configutation file
  const env = process.env.NODE_ENV // read the environment variable (will be 'production' in production mode)
  const USE_TEST_USER = env !== 'production' && process.env.TEST_USER_ON // option to turn on the test user.
  console.log("in authenticate!")

  // console.log(req)
  // console.log(req.session)
  // console.log("SESSION ID:")
  // console.log(req.sessionID)
  // console.log("ID DONE")
  // if (USE_TEST_USER) {
  //   console.log("test user mode on")
  //   // console.log("trying to set req.session.user TEST")
  //   req.session.user = '61a9db37d7c3cec99261a400' // test user on development. (remember to run `TEST_USER_ON=true node server.js` if you want to use this user.)
  // }
  console.log(req.session.user);
  if (req.session.user) {
    console.log("trying to find by ID");
    console.log(req.session.user);
    UserModel.findById(req.session.user).then((user) => {
      console.log("trying to find id: ")
      console.log(user);
      if (!user) {
        console.log("invalid user session ID. Something has gone wrong.")
        return Promise.reject()
      } else {
        console.log("Authentication passed. User ID is valid.")
        next()
      }
    }).catch(() => {
      res.status(401).send("Unauthorized")
    })
  } else {
    res.status(401).send("Unauthorized")
  }
};
//Currently unused. 
export const mockSessionChecker = (req: Request, res: Response, next: NextFunction): void => {
  console.log("mock session checking success!");
  next(); // Mock user logged in
};
