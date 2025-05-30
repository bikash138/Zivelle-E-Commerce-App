import User from "../models/User"
import bcrypt from 'bcrypt'
import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import {SignInSchema, SignUpSchema } from "@repo/types/zodTypes"

export const signUp: RequestHandler = async (req, res) => {
    try {
        const parsedData = SignUpSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(411).json({
                success: false,
                message: "Zod validation Failed"
            });
            return;
        }
        const {
            email, firstName, lastName, password, confirmPassword
        } = parsedData.data;

        //Check if User already exists
        const extistingUser = await User.findOne({ email });
        if (extistingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists. Please Login"
            });
            return;
        }

        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create the User
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        //Return the response
        res.status(200).json({
            success: true,
            user,
            message: "User Registered Successfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "User cannot be Registered"
        });
    }
}

export const login: RequestHandler = async (req, res) => {
    try {
        const parsedData = SignInSchema.safeParse(req.body);

        if (!parsedData.success) {
            res.status(411).json({
                success: false,
                message: "Zod validation Failed"
            });
            return;
        }

        const {
            email, password
        } = parsedData.data;

        //Check in the Database wther user is present or not
        const user = await User.findOne({ email });

        //If not found return error
        if (!user) {
            res.status(400).json({
                success: false,
                message: "User For the Email Not Found"
            });
            return;
        }

        //Generate the JWT token and Compare the Password
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {
                    email: user.email,
                    id: user._id,
                },
                process.env.JWT_SECRET || 'bikash',
                {
                    expiresIn: "24h"
                }
            );
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User Login Success"
            });
            return;
        } else {
            res.status(401).json({
                success: false,
                message: "Wrong Password"
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "User cannot be Logged In"
        });
        return;
    }
};

