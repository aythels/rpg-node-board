import { Request, Response, NextFunction } from 'express';

export const mockAuthenticate = (req: Request, res: Response, next: NextFunction): void => {
  next(); // Mock authentication success
};

export const mockSessionChecker = (req: Request, res: Response, next: NextFunction): void => {
  next(); // Mock user logged in
};
