import express from "express";
import usersController from "../controllers/users";
import verifyToken from "../middlewares/verify-token";

const router = express.Router();

router.use(express.urlencoded());
router.use(express.json());

router.use(verifyToken);

router.get("/", usersController.getUsers);

export default router;
