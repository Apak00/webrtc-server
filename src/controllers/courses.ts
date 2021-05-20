import { Request, Response } from "express";
import { genericCatchHandler } from "../utils/generic-catch-handler";
import { Course } from "../database/models/Course";

const getCourses = (req: Request, res: Response): void => {
  Course.findAll()
    .then((courses: Course[]) => {
      res.send(courses);
    })
    .catch(genericCatchHandler(res));
};

const createCourse = (req: Request<any, any, Course, any>, res: Response): void => {
  const {
    body: { name, detail, numberOfMaxAttendies },
  } = req;

  Course.create({ name, detail, numberOfMaxAttendies }, { fields: ["name", "detail", "numberOfMaxAttendies"] })
    .then((result: Course) => {
      res.send({ message: `Course is created for id: ${result.id}` });
    })
    .catch(genericCatchHandler(res));
};

const getCourseDetail = (req: Request<any, any, Course, any>, res: Response): void => {
  const {
    params: { id },
  } = req;
  Course.findOne({ where: { id }, attributes: ["name", "detail", "approvalStatus", "numberOfMaxAttendies"] })
    .then((course: Course) => {
      res.send(course);
    })
    .catch(genericCatchHandler(res));
};

const updateCourse = (req: Request<any, any, Course, any>, res: Response): void => {
  const {
    body: { name, detail, numberOfMaxAttendies },
    params: { id },
  } = req;
  Course.update({ name, detail, numberOfMaxAttendies }, { where: { id } })
    .then((result) => {
      if (result) {
        res.send({ message: `Course is updated for id: ${id}` });
      } else {
        res.status(400).send({ message: `Course is not found for id: ${id}` });
      }
    })
    .catch(genericCatchHandler(res));
};

export default {
  getCourses,
  createCourse,
  getCourseDetail,
  updateCourse,
};
