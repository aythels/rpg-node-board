import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Checks if mongoose connection was established.
export const mongoChecker = (req: Request, res: Response, next: NextFunction): void => {
  if (mongoose.connection.readyState != 1) {
    console.log('Issue with mongoose connection');
    res.status(500).send('Internal server error');
    return;
  } else {
    next();
  }
};

// Checks for first error returned by promise rejection if Mongo database suddenly disconnects
export const isMongoError = (error: any): boolean => {
  return typeof error === 'object' && error !== null && error.name === 'MongoNetworkError';
};
