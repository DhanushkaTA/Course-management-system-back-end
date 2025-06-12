import mongoose, {Schema} from "mongoose";
import {CourseInterface} from "../types/SchemaType";

let courseSchema
    = new mongoose.Schema<CourseInterface>({
    title: { type: String, required: true, index: true},
    description: { type: String, required: true, index: true},
    instructor: { type: Schema.Types.ObjectId, required: true, index: true},
    content: { type: String, required: false, unique: false},
    student: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    createdAt: { type: Date, required: false, default: Date.now}
});

let courseModel = mongoose.model('course',courseSchema);
export default courseModel;