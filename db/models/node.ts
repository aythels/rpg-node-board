import mongoose from '../mongoose';
import { Schema } from 'mongoose';
import { Node } from '../../frontend/src/types'; // TODO: fix where the types file is

const schema = new Schema<Node>({});

const NodeModel = mongoose.model('Node', schema);

module.exports = { NodeModel };
