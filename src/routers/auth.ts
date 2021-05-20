import express from "express";
import authController from "../controllers/auth";

const router = express.Router();

router.use(express.urlencoded());
router.use(express.json());

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/forget-password", authController.forgetPassword);

router.put("/update-password", authController.updatePassword);

export default router;
