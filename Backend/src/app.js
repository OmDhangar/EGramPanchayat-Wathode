import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import healthCheckRoutes from "./routes/healthCheck.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import officerRoutes from "./routes/officer.routes.js"
import blogRoutes from "./routes/blog.routes.js";

const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Set your frontend URL here
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ["set-cookie"]
}))

app.use(express.json({limit: '16kb'})) //used to configure json data
app.use(express.urlencoded({extended: true}))//used to configure url properties

app.use(cookieParser({limit:"16kb"}))// used to configure cookies and their limit 
app.use(express.static("public"))//used to store images,files publically
//middlewares 

// routes imported
import userRouter from "./routes/auth.routes.js"
import applicationRouter from "./routes/application.routes.js"

//routes declaration

app.use("/api",paymentRoutes);
app.use("/api",healthCheckRoutes);
app.use("/api/users",userRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/officers", officerRoutes);
app.use("/api/blogs", blogRoutes);


export default app