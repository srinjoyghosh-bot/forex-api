import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { formatResponse } from "../utils/responseFormatter";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(
      formatResponse(false, "Some error occurred", {
        errors: errors.array(),
      })
    );
    return;
  }
  next();
};
