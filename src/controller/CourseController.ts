import express from "express";
import courseModel from "../model/CourseModel";
import {AppError} from "../utils/AppError";
import {StatusCodes} from "../utils/StatusCode";
import {CustomResponse} from "../utils/CustomResponse";

export const createCourse = async (
    req:express.Request,
    res:express.Response,
    next:express.NextFunction
) => {
    try {

        const { title, description, content } = req.body;

        // validate req body details
        if (!title || !description || !content){
            throw new AppError(
                'Something is missing! Please check and try again.',
                400,
                StatusCodes.DATA_NOT_FOUND)
        }

        const newCourse = new courseModel({
            title: title,
            description: description,
            instructor: req.tokenData.user._id,
            content: content,
        });

        const savedCourse = await newCourse.save();

        res.status(200).send(
            new CustomResponse(
                StatusCodes.COURSE_CREATED_SUCCESSFULLY,
                'Course creation successfully',
                savedCourse
            )
        )
    } catch (error) {
       next(error)
    }
};

export const updateCourse = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const { courseId } = req.params;
        const { title, description, content } = req.body;

        // Validate request body
        if (!title || !description || !content) {
            throw new AppError(
                "Something is missing! Please check and try again.",
                400,
                StatusCodes.DATA_NOT_FOUND
            );
        }

        // Find course and verify ownership
        const course = await courseModel.findOne({
            _id: courseId,
            instructor: req.tokenData.user._id
        });

        if (!course) {
            throw new AppError(
                "Course not found or you're not authorized to update this course.",
                403,
                StatusCodes.COURSE_NOT_FOUND
            );
        }

        // Update course fields
        course.title = title;
        course.description = description;
        course.content = content;

        const updatedCourse = await course.save();

        res.status(200).send(
            new CustomResponse(
                StatusCodes.COURSE_UPDATED_SUCCESSFULLY,
                "Course updated successfully",
                updatedCourse
            )
        );
    } catch (error) {
        next(error);
    }
};

export const deleteCourse = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.tokenData.user._id;

        const course = await courseModel.findOne({
            _id: courseId,
            instructor: instructorId
        });

        if (!course) {
            throw new AppError(
                "Course not found or you are not authorized to delete this course.",
                403,
                StatusCodes.COURSE_NOT_FOUND
            );
        }

        await courseModel.deleteOne({ _id: courseId });

        res.status(200).send(
            new CustomResponse(
                StatusCodes.COURSE_DELETED_SUCCESSFULLY,
                "Course deleted successfully",
                null
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getAllCourses = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        // get course details with instructor details and sort to newest first
        const courses = await courseModel
            .find(undefined, undefined, undefined)
            .populate("instructor", "fullName email")
            .sort({ createdAt: -1 });

        return res.status(200).send(
            new CustomResponse(
                StatusCodes.COURSE_LIST_FETCHED,
                "Course list fetched successfully",
                courses
            )
        );
    } catch (error) {
        next(error);
    }
};