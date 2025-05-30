import User from "../models/User"
import bcrypt from 'bcrypt'
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import {SignInSchema, SignUpSchema } from "@repo/types/zodTypes"

exports.signUp = async (req: Request,res: Response)=>{
    try{
        const parsedData = SignUpSchema.safeParse(req.body)
        if(!parsedData.success){
            res.status(411).json({
                success: false,
                message: "Zod validation Failed"
            })
            return
        }
        const {
            email, firstName, lastName, password, confirmPassword
        } = parsedData.data

        //Check if User already exists
        const extistingUser = await User.findOne({email})
        if(extistingUser){
            return res.status(400).json({
                success:false,
                message: "User already exists. Please Login"
            })
        }

        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create the User
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        
        //Return the response
        return res.status(200).json({
            success:true,
            user,
            message: "User Registered Successfully"
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message: "User cannot be Registered"
        })
    }
}

exports.login = async (req: Request,res: Response)=>{
    try{
        //get the Data from Request
        const {
            email,
            password,
            role,
        } = req.body

        //Check whether all details are present or not
        if(!email || !password ){
            return res.status(400).json({
                success:false,
                message: "All details are not filled"
            })
        }

        //Check in the Database wther user is present or not
        const user = await User.findOne({email})

        //If not found return error
        if(!user){
            return res.status(400).json({
                success:false,
                message: "User For the Email Not Found"
            })
            
        }

        //Generate the JWT token and Compare the Password
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign({
                email: user.email,
                id: user._id,
            }, process.env.JWT_SECRET || 'bikash',
            {
                expiresIn: "24h"
            }
        )
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly: true
        }
        res.cookie("token", token , options).status(200).json({
            success:true,
            token,
            user,
            message: "User Login Success"
        })
        console.log(res)
        }
        else{
            return res.status(401).json({
                success:false,
                message: "Wrong Password"
                
            })
        }
        
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message: "User cannot be Logged In"
        })
    }
}

