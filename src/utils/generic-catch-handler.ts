import { Response } from "express";

export const genericCatchHandler = (res: Response) => (error: unknown): void => {
  res.status(400).send({ message: "İşlem başarısız oldu.", error });
};
