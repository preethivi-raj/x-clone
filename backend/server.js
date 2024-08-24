import epxress from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary"


import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js"

import connectMongoDb from "./db/connectMongoDB.js";

//last video time : 03:01:00

dotenv.config();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET
})



const app = epxress();
const PORT = process.env.PORT || 3000


app.use(epxress.json()) // to parse req.body
app.use(epxress.urlencoded({extended : true}))
app.use(cookieParser())

app.use("/api/auth" , authRoutes)
app.use("/api/users" , usersRoutes)
app.use("/api/posts" , postRoutes)
app.use("/api/notifications" , notificationRoutes)

app.listen(PORT ,()=>{
    console.log(`Server is running on port number ${PORT} `)
    connectMongoDb()
})