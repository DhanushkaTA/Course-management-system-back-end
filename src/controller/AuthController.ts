import mongoose from "mongoose";
import express from "express";
import {AppError} from "../utils/AppError";
import {StatusCodes} from "../utils/StatusCode";
import UserModel from "../model/UserModel";
import {CustomResponse} from "../utils/CustomResponse";
import bcrypt from "bcryptjs"
import generateAccessToken from "../utils/TokenGenerator";
import {UserDTO} from "../dto/UserDTO";

export const registerUser = async (
    req:express.Request,
    res:express.Response,
    next:express.NextFunction
) => {

    const { fullName, username, email, mobileNumber, role, password } = req.body;

    // create session
    const session = await mongoose.startSession();
    // start transaction
    session.startTransaction();

    try {

        // validate req body details
        if (!fullName || !username || !role || !password || !email || !mobileNumber){
            throw new AppError(
                'Something is missing! Please check and try again.',
                400,
                StatusCodes.DATA_NOT_FOUND)
        }

        // check user exists
        const user =
            await UserModel.findOne(
                {$or: [{ email: email }, { mobileNumber: mobileNumber }]},undefined, undefined).select('-password').lean();

        if (user){
            throw new AppError(
                'Email or Mobile number already used!',
                409,
                StatusCodes.DUPLICATE_ENTRY);
        }

        // hash otp
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // save user in db
        const newUser = await UserModel.create(
            [
                {
                    fullName: fullName,
                    username: username,
                    email: email,
                    password:hashedPassword,
                    mobileNumber: mobileNumber,
                    role: role
                }
            ],
            {session}
        );

        // await sendEmail(new EmailOptions(
        //     email,
        //     'Change Your password',
        //     `Go to this link to change your password >>> http://localhost:3001/auth/forgot-password`
        // ))

        const token = await generateAccessToken(
            new UserDTO(
                newUser[0]._id.toString(),
                newUser[0].fullName,
                newUser[0].username,
                newUser[0].email,
                "",
                newUser[0].mobileNumber,
                newUser[0].role,
                newUser[0].createdAt
            )
        )

        await session.commitTransaction();

        // send response
        res.status(201).send(
            new CustomResponse(
                StatusCodes.USER_REGISTRATION_SUCCESS,
                'User registered successfully.',
                {
                    token:token,
                    user:newUser[0]
                }
            )
        )

    }catch (error){
        await session.abortTransaction()
        next(error)
    } finally {
        await session.endSession()
    }

}


export const loginUser = async (
    req:express.Request,
    res:express.Response,
    next:express.NextFunction
) => {

    try {

        const { email, password } = req.body;

        if (!email || !password){
            throw new AppError(
                "Email or Password missing! Please try again later!",
                400,
                StatusCodes.DATA_NOT_FOUND
            )
        }

        // Find the user by email
        const user = await UserModel.findOne({ email }).lean();

        if (!user){
            throw new AppError(
                'User not found!',
                404,
                StatusCodes.USER_NOT_FOUND
            )
        }

        // validate password
        if (!await bcrypt.compare(password,user.password)){
            throw new AppError(
                'Invalid password! Please try again later.',
                401,
                StatusCodes.INVALID_PASSWORD)
        }

        //remove password
        user.password='';

        const token = await generateAccessToken(
            new UserDTO(
                user._id.toString(),
                user.fullName,
                user.username,
                user.email,
                "",
                user.mobileNumber,
                user.role,
                user.createdAt
            )
        )

        res.status(200).send(
            new CustomResponse(
                StatusCodes.USER_LOGIN_SUCCESSFULLY,
                'User login successfully!',
                {
                    user:user,
                    token:token
                }
            )
        )

    } catch (e) {
        next(e)
    }

}