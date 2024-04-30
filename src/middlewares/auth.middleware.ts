import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // const accessToken = req.headers.authorization;
      const accessToken = req.get("Authorization");
      if (!accessToken) {
        throw new ApiError("no token provided", 401);
      }
      const payload = tokenService.checkToken(accessToken);
      const tokenPair = await tokenRepository.findByParams({ accessToken });
      if (!tokenPair) {
        throw new ApiError("invalid token", 401);
      }
      req.res.locals.jwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
