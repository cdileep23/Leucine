
import { RequestHandler, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/user.types";

export const asyncHandler =
  (
    fn: (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => Promise<any>
  ): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next);
