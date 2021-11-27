import { Schema } from 'mongoose';
import { Subnode } from '../../frontend/src/types'; // TODO: fix where the types file is
import mongoose from '../mongoose';

const schema = new Schema<Subnode>({
  name: {
    type: String,
    required: true,
  },
  informationLevel: {
    type: Number,
    required: true,
  },
  editors: [
    {
      type: [mongoose.Schema.Types.ObjectId],
    },
  ],
  type: {
    type: String,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.String,
  },
});

const SubnodeModel = mongoose.model('Subnode', schema);

module.exports = { SubnodeModel };
