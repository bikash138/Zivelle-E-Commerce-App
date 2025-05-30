import mongoose from 'mongoose'

const MONGODB_URL:string = process.env.MONGODB_URL || "mongodb://localhost:27017/Zivelle-DB"

export const dbConnect = () =>{
    mongoose
        .connect(MONGODB_URL)
        .then(() => console.log("DB Connection Successfull"))
        .catch((err)=>{
            console.log("Db Connection Failed");
            console.log(err);
            process.exit(1);
        })
}