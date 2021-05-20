import { Request, Response } from "express";
import { genericCatchHandler } from "../utils/generic-catch-handler";
import { User } from "../database/models/User";

const getUsers = (req: Request, res: Response): void => {
  User.findAll({ attributes: ["userId"] })
    .then((users: User[]) => {
      res.send({ users });
    })
    .catch(genericCatchHandler(res));
};

export default {
  getUsers,
};
