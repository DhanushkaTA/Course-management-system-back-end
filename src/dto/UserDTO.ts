import {ObjectId} from "mongoose";
import {UserDtoInterface} from "../types/DtoTypes";

export class UserDTO{

    private _id: string;
    private _fullName: string;
    private _username: string;
    private _email: string;
    private _password: string;
    private _mobileNumber: string;
    private _role: string;
    private _createdAt: Date

    constructor(id: string, fullName: string, username: string, email: string, password: string, mobileNumber: string, role: string, createdAt: Date) {
        this._id = id;
        this._fullName = fullName;
        this._username = username;
        this._email = email;
        this._password = password;
        this._mobileNumber = mobileNumber;
        this._role = role;
        this._createdAt = createdAt;
    }


    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get fullName(): string {
        return this._fullName;
    }

    set fullName(value: string) {
        this._fullName = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get mobileNumber(): string {
        return this._mobileNumber;
    }

    set mobileNumber(value: string) {
        this._mobileNumber = value;
    }

    get role(): string {
        return this._role;
    }

    set role(value: string) {
        this._role = value;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }

    toJSON():UserDtoInterface{
        return {
            id:this._id,
            fullName: this._fullName,
            username: this._username,
            email: this._email,
            password: this._password,
            mobileNumber: this._mobileNumber,
            role: this._role,
            createdAt: this._createdAt
        }
    }
}