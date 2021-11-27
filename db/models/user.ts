import mongoose from '../mongoose';
import { Schema } from 'mongoose';
import { User } from '../../frontend/src/types'; // TODO: fix where the types file is

const schema = new Schema<User>({});

const UserModel = mongoose.model('User', schema);

module.exports = { UserModel };
