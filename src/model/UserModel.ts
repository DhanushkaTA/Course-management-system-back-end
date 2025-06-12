import mongoose from "mongoose";
import {UserInterface} from "../types/SchemaType";

let useSchema
    = new mongoose.Schema<UserInterface>({
    fullName: { type: String, required: true, index: true},
    username: { type: String, required: true, index: true},
    email: { type: String, required: true, unique: true, index: true},
    password: { type: String, required: false, unique: false},
    mobileNumber: { type: String, required: true, unique: true, index: true},
    role: { type: String, required: true, enum:['student', 'instructor'], index: true},
    createdAt: { type: Date, required: false, default: Date.now}
});

let userModel = mongoose.model('user',useSchema);
export default userModel;