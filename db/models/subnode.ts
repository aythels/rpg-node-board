import { Schema } from 'mongoose';
import { Subnode } from '../../frontend/src/types'; // TODO: fix where the types file is
import mongoose from '../mongoose';

export const SubnodeSchema = new Schema<Subnode>({
  name: {
    type: String,
    required: true,
  },
  informationLevel: {
    type: Number,
    required: true,
  },
  editors: [mongoose.Types.ObjectId],
  type: {
    type: String,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.String, //JSON / Delta
  },
});

export const SubnodeModel = mongoose.model('Subnode', SubnodeSchema);
