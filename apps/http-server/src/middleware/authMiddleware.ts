import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'

interface UserType {
    id: string;
    email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}


export const auth = async ( req:Request, res: Response, next: NextFunction ) => {
    try{
        //Extract JWT from request cookies
        const token = 
            req.cookies.token ||
            (req.header("Authorization") ? req.header("Authorization")!.replace("Bearer ", "") : "");
            
        //If JWT is missing return error
        if(!token){
            return res.status(401).json({
                success:"false",
                message: "Token Missing"
            })
        }
        try{
            //Verify the token using secret key stored in environment variables
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                return res.status(500).json({
                    success: false,
                    message: "JWT secret is not defined in environment variables"
                });
            }
            const decode = jwt.verify(token, jwtSecret as string);
            console.log("Decode -> ", decode)
            //@ts-ignore
            req.user = decode

        }catch(error){
            return res.status(401).json({
                success:false,
                message: "Token is Invalid"
            })
        }
        //If JWT verified move to next middleware or controller
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message: "Something went wrong while validating Token"
        })
    }
}