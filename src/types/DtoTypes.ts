import {ObjectId} from "mongoose";

export interface UserDtoInterface{
    id:string;
    fullName: string;
    username: string;
    email: string;
    password: string;
    mobileNumber: string;
    role: string;
    createdAt: Date
}

export interface CourseDtoInterface{
    id:string;
    title: string;
    description: string;
    instructor: string;
    content: string;
    student: string[];
    createdAt: Date
}