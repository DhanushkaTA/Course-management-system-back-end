import express from "express";
import {createCourse, deleteCourse, updateCourse} from "../controller/CourseController";
import {authorize} from "../middleware/verifyToken";
import {restrictTo} from "../middleware/RoleVerify";

let router = express.Router();

router.post('/', authorize, restrictTo('instructor'), createCourse)

router.put('/:courseId', authorize, restrictTo('instructor'), updateCourse);

router.delete('/:courseId', authorize, restrictTo('instructor'), deleteCourse);



export default router;