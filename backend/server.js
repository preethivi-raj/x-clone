import epxress from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary"
import cors from "cors"


import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js"

import connectMongoDb from "./db/connectMongoDB.js";
import path from "path"

//last video time : 03:39:00

dotenv.config();
const app = epxress();

const __dirname = path.resolve()

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const PORT = process.env.PORT || 3000
app.use(cors(
    {
        origin: 'https://at.preethiviraj.me',
        credentials: true
    }
))
app.use(cookieParser())
app.use(epxress.urlencoded({extended : true}))
app.use(epxress.json({limit :"5mb"})) // to parse req.body

app.use("/api/auth" , authRoutes)
app.use("/api/users" , usersRoutes)
app.use("/api/posts" , postRoutes)
app.use("/api/notifications" , notificationRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(epxress.static(path.join(__dirname , "/frontend/build")))
    app.get("*" , (req , res)=>{
        res.sendFile(path.resolve(__dirname , "frontend" , "build" , "index.html"))
    }
    )
}

app.listen(PORT ,()=>{
    console.log(`Server is running on port number ${PORT} `)
    connectMongoDb()
})