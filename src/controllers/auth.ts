import { Request, Response } from "express";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import forgetPasswordHTML from "../constants/forget-password";
import { User } from "../database/models/User";
import { expirationTimeInSeconds } from "../constants/token-constants";

const login = (req: Request, res: Response): void => {
  const {
    body: { userId, password },
  } = req;
  User.findOne({ where: { userId } })
    .then((user: User) => {
      const passwordIsValid: boolean = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        res.status(401).send({ auth: false, token: null, message: `Login attempt is failed for userId: ${userId}` });
      }
      const token: any = jwt.sign(
        {
          id: user.id,
          userId: user.userId,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: expirationTimeInSeconds,
        }
      );
      res.send({ auth: true, token });
    })
    .catch(() => {
      res.status(400).send({ message: `Login attempt is failed for userId: ${userId}` });
    });
};

const register = async (req: Request, res: Response): Promise<void> => {
  const {
    body: { userId, password },
  } = req;

  User.findOrCreate({
    where: { userId },
    defaults: {
      userId,
      password,
    },
  })
    .then(([, created]): void => {
      if (created) {
        res.send({ message: `User is created for userId: ${userId}` });
      } else {
        res.status(400).send({ message: `User already exists for userId: ${userId}` });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(400).send({ message: `User could not be created for userId: ${userId}` });
    });
};

const forgetPassword = (req: Request, res: Response): void => {
  const {
    body: { userId },
  } = req;

  User.findOne({ where: { userId } })
    .then(() => {
      // send email for forget password
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "eys.emails@gmail.com",
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: "eys.emails@gmail.com",
        to: `${userId}`,
        subject: "Reset Password",
        html: forgetPasswordHTML,
      };

      transporter.sendMail(mailOptions, (error: Error, info: { response: any }) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.send({ message: `An email is sent to ${userId} in order to let you update password` });
    })
    .catch(() => {
      res.status(400).send({ message: `There is no such User with id: ${userId}` });
    });
};

const updatePassword = (req: Request, res: Response): void => {
  const {
    body: { userId, password },
  } = req;
  User.update({ password }, { where: { userId } })
    .then(([rowsUpdated]) => {
      if (rowsUpdated) {
        res.send({ message: `Password is updated for id: ${userId}` });
      } else {
        res.status(400).send({ message: `User not found for id: ${userId}` });
      }
    })
    .catch((e: any) => {
      res.status(400).send({ message: e });
    });
};

export default {
  login,
  register,
  updatePassword,
  forgetPassword,
};
