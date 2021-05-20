import express from "express";
import courseController from "../controllers/courses";
import verifyToken from "../middlewares/verify-token";

const router = express.Router();

router.use(express.urlencoded());
router.use(express.json());

router.use(verifyToken);

router.post("/", courseController.createCourse);

router.put("/:id", courseController.updateCourse);

router.get("/:id", courseController.getCourseDetail);

router.get("/", courseController.getCourses);

export default router;
