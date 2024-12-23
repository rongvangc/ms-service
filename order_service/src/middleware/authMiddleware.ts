import { NextFunction, Request, Response } from "express";
import { ValidateUser } from "../utils/broker";

export const RequestAuthorizer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(403)
        .json({ error: "Unauthorized due to authorization token missing!" });
    }
    const data = await ValidateUser(req.headers.authorization as string);

    req.user = data;

    next();
  } catch (error) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};
