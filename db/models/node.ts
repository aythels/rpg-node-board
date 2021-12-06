import mongoose from '../mongoose';
import { Schema } from 'mongoose';
import { Node } from '../../frontend/src/types'; // TODO: fix where the types file is
import { SubnodeSchema } from './subnode';

export const NodeSchema = new Schema<Node>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, // base 64
    required: false,
  },
  thumbnailImage: {
    type: String, // base 64
    required: false,
  },
  subnodes: [SubnodeSchema],
  informationLevels: [
    {
      user: {
        type: String,
        required: true,
      },
      infoLevel: {
        type: Number,
        required: true,
      },
    },
  ],
  editors: [String],
  type: {
    type: String,
    required: true,
  },
});

export const NodeModel = mongoose.model('Node', NodeSchema);
