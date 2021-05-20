import bcrypt from "bcryptjs";
import { User } from "../models/User";

export const afterValidate = (user: User): void => {
  user.password = bcrypt.hashSync(user.password, 8);
};
