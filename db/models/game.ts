import { Schema } from 'mongoose';
import { Game } from '../../frontend/src/types'; // TODO: fix where the types file is
import mongoose from '../mongoose';

const schema = new Schema<Game>({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  // TODO: Add Image
});

const GameModel = mongoose.model('Game', schema);

module.exports = { GameModel };
