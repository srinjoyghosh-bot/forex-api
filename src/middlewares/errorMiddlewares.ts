import { Request, Response, NextFunction } from 'express';
import { formatResponse } from '../utils/responseFormatter';

interface CustomError extends Error {
  status: number;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json(formatResponse(false,message));
};
