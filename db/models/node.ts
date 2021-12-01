import mongoose from '../mongoose';
import { Schema } from 'mongoose';
import { Node } from '../../frontend/src/types'; // TODO: fix where the types file is
import { SubnodeSchema } from './subnode';
import { Binary } from 'bson';

export const NodeSchema = new Schema<Node>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: Binary,
    required: false,
  },
  thumbnailImage: {
    type: Binary,
    required: false,
  },
  subnodes: [SubnodeSchema],
  informationLevels: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      infoLevel: {
        type: Number,
        required: true,
      },
    },
  ],
  editors: [mongoose.Types.ObjectId],
  type: {
    type: String,
    required: true,
  },
});

export const NodeModel = mongoose.model('Node', NodeSchema);
