import express from "express";
import courseModel from "../model/CourseModel";
import {OpenAI,} from "openai";
import {OPENAI_API_KEY} from "../config/env";
import {AppError} from "../utils/AppError";
import {StatusCodes} from "../utils/StatusCode";
import {CustomResponse} from "../utils/CustomResponse";

// OpenAI setup
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export const chatWithOpenAi =  async (
    req:express.Request,
    res:express.Response,
    next:express.NextFunction
) => {
    const { prompt } = req.body;

    if (!prompt){
        throw new AppError(
            "Prompt is required",
            400,
            StatusCodes.DATA_NOT_FOUND)
    }

    try {
        const courses =
            await courseModel.find(undefined, undefined, undefined).lean();

        const courseTitles = courses.map(c => c.title).join(", ");

        const fullPrompt = `Here are the available courses: ${courseTitles}.
         A student says: "${prompt}". Recommend the most relevant courses for this student.`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: fullPrompt }],
            model: "gpt-3.5-turbo",
        });

        console.log(completion.choices[0].message.content);

        res.status(200).send(
            new CustomResponse(
                StatusCodes.GET_SUGGESTION_SUCCESSFULLY,
                'Course creation successfully',
                completion.choices[0].message.content
            )
        )


    } catch (error) {
        next(error)
    }
}