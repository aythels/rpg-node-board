import mongoose from '../mongoose';
import { Schema } from 'mongoose';
import { User } from '../../frontend/src/types'; // TODO: fix where the types file is
import { Binary } from 'bson';

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
    type: Binary,
    required: false,
  },
  games: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  ],
  images: [
    {
      type: Binary,
      required: true,
    },
  ],
});

export const UserModel = mongoose.model('User', UserSchema);
