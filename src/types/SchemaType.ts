import {ObjectId, Types} from "mongoose";

export interface UserInterface{
    _id: ObjectId;
    fullName: string;
    username: string;
    email: string;
    password: string;
    mobileNumber: string;
    role: string;
    createdAt: Date
}

export interface CourseInterface{
    _id: ObjectId;
    title: string;
    description: string;
    instructor: Types.ObjectId;
    content: string;
    student: Types.ObjectId[];
    createdAt: Date;
}

export interface OtpInterface {
    _id:ObjectId;
    email:string;
    otp:string;
    createdAt?: Date;
    expiredAt: Date;
}