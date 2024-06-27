import epxress from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/auth.routes.js";
import connectMongoDb from "./db/connectMongoDB.js";


dotenv.config();

const app = epxress();
const PORT = process.env.PORT || 3000


app.use(epxress.json()) // to parse req.body
app.use(epxress.urlencoded({extended : true}))
app.use(cookieParser())

app.use("/api/auth" , authRoutes)

app.listen(PORT ,()=>{
    console.log(`Server is running on port number ${PORT} `)
    connectMongoDb()
})