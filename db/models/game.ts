import { Binary } from 'bson';
import { Schema } from 'mongoose';
import { Game } from '../../frontend/src/types'; // TODO: fix where the types file is
import mongoose from '../mongoose';
import { NodeSchema } from './node';

export const GameSchema = new Schema<Game>({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  image: {
    type: Binary,
    required: false,
  },
  nodes: [NodeSchema],
  users: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      permission: {
        type: Number,
        required: true,
      },
      nickname: {
        type: String,
        required: false,
      },
    },
  ],
  settings: {
    type: String, //JSON
    required: true,
  },
});

export const GameModel = mongoose.model('Game', GameSchema);
