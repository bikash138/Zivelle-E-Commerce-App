import express from "express"
import cors from 'cors'
import { dbConnect } from "./config/database"
import cookieParser from 'cookie-parser'
import userRoutes from "./routes/user"
// const userRoutes = require("./routes/user")
// const productRoutes = require("./routes/product")
// const { cloudinaryConnect } = require("./config/cloudinary")
// const fileUpload = require("express-fileupload")


const app = express();

//Setting Up PORT
const PORT =  4000;

//Connecting to Database
dbConnect()

//Middlewares
app.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

//To upload files
// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir : '/tmp/'
// }))

//Connecting To Cloudinary
// cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes)
// app.use("/api/v1/product", productRoutes)


//Testing the Server
app.get("/", (req,res)=>{
    res.json({
        message: "You are connected to backend at port 4000"
    })
})

//Listening to PORT
app.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`)
})
