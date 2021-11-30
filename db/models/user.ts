import mongoose from '../mongoose';
import { Schema } from 'mongoose';
import { User } from '../../frontend/src/types'; // TODO: fix where the types file is

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
  games: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  ],
  // TODO: add images, pfp
});

export const UserModel = mongoose.model('User', UserSchema);
