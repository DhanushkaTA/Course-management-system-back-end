import express from "express";
import {
    createCourse,
    deleteCourse,
    getAllCourses,
    getCoursesByInstructorId,
    updateCourse
} from "../controller/CourseController";
import {authorize} from "../middleware/verifyToken";
import {restrictTo} from "../middleware/RoleVerify";

let router = express.Router();

router.post('/', authorize, restrictTo('instructor'), createCourse)

router.put('/:courseId', authorize, restrictTo('instructor'), updateCourse);

router.delete('/:courseId', authorize, restrictTo('instructor'), deleteCourse);

router.get("/courses", authorize, restrictTo('instructor','student'), getAllCourses);

router.get("/instructor", authorize, restrictTo('instructor'), getCoursesByInstructorId);


export default router;