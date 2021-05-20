import { NextFunction, Response, Request } from "express";

import jwt from "jsonwebtoken";

// This middleware should be added to each route that requires authentication
const verifyToken: (req: Request & { userId: string }, res: Response, next: NextFunction) => void = (
  req: Request & { userId: string },
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send({ auth: false, message: "There is no token." });

  jwt.verify(token, process.env.SECRET_KEY, (err: Error, decoded: any) => {
    if (err) return res.status(403).send({ auth: false, message: "Token is invalid." });

    // if everything good, save to request for use in other routes
    req.userId = decoded.userId;
    next();
  });
};

export default verifyToken;
