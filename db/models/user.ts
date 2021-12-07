import mongoose from '../mongoose';
import { Model, Schema, model } from 'mongoose';
import { User } from '../../frontend/src/types'; // TODO: fix where the types file is
import bcrypt from 'bcrypt';


interface UserModel extends Model<User> {
  compareUsernamePassword: (username: String, password: String) => Promise<User>;
}

export const UserSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String, // Hashed
    required: true,
  },
  email: {
    type: String, // Hashed?
    required: true,
  },
  profilePicture: {
    type: String, // base 64
    required: false,
  },
  games: [
    {
      type: String,
      required: true,
    },
  ],
  /*images: [
    {
      type: [String], // base 64
      required: true,
    },
  ],*/
});

//CREDIT TO USER.JS in react-express-authentication example for this course. 
UserSchema.pre('save', function (next) {
  const user = this; // binds this to User document instance
  // checks to ensure we don't hash password more than once
  if (user.isModified('password')) {
    // generate salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})


// A static method on the document model.
// Allows us to find a User document by comparing the hashed password
//  to a given one, for example when logging in.
UserSchema.statics.compareUsernamePassword = function (username: string, password: string) {
  const ThisUserModel = this // binds this to the User model

  // First find the user by their email

  return ThisUserModel.findOne({ username: username }).then((user: User) => {
    if (!user) {
      return Promise.reject()  // a rejected promise
    }
    // if the user exists, make sure their password is correct
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          console.log("works!")
          resolve(user)
        } else {
          console.log("invalid password!")
          reject()
        }
      })
      // console.log("inside promise")
      // if (true) {
      //   resolve(user)
      // } else {
      //   reject()
      // }
    })
  })
}




// UserSchema.statics.findUser = async function (username, password) {
//   const userDoc = await UserModel.findOne({ username });
//   if (!userDoc) throw Error('Invalid username');
// ​
//   const result = await bcrypt.compare(password, userDoc.password);
//   if (result === true) return userDoc._id;
//   else throw Error('Invalid password');
// };
// ​
// UserSchema.statics.createUser = async function (username, password, email) {
//   const uniqueUsername = !(await UserModel.findOne({ username }));
//   const uniqueEmail = !(await UserModel.findOne({ email }));
//   if (!uniqueUsername || !uniqueEmail) throw Error('Non unique request');
// ​
//   const hashedPassword = await bcrypt.hash(password, 10);
// ​
//   const userDoc = new UserModel({
//     username: username,
//     password: hashedPassword,
//     email: email,
//   });
//   const result = await userDoc.save();
// ​
//   return result;
// };
// ​
export const UserModel = mongoose.model<User, UserModel>('user', UserSchema);



// export const UserModel = mongoose.model('user', UserSchema);
