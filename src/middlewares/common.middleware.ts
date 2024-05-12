import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { errorMessages } from "../constants/error-messages.constant";
import { statusCodes } from "../constants/status-codes.constant";
import { ApiError } from "../errors/api-error";

class CommonMiddleware {
  public isIdValid(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.userId;
      if (!isObjectIdOrHexString(id)) {
        throw new ApiError(errorMessages.INVALID_ID, statusCodes.BAD_REQUEST);
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  public isBodyValid(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { value, error } = validator.validate(req.body);
        if (error) {
          throw new ApiError(error.details[0].message, statusCodes.BAD_REQUEST);
        }
        req.body = value;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
