import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import healthCheckRoutes from "./routes/healthCheck.routes.js"
import officerRoutes from "./routes/officer.routes.js"
import blogRoutes from "./routes/blog.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express()


const allowedOrigins = [
  "https://grampanchayatwathode.com",
  "https://www.grampanchayatwathode.com",
  "http://localhost:5173",
  "https://www.api.grampanchayatwathode.com",
  "https://api.grampanchayatwathode.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ["set-cookie"]
}));


app.use(express.json({limit: '16kb'})) //used to configure json data
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser({limit:"16kb"}))// used to configure cookies and their limit 
app.use(express.static("public"))//used to store images,files publically
//middlewares 

// routes imported
import userRouter from "./routes/auth.routes.js"
import applicationRouter from "./routes/application.routes.js"

//routes declaration

app.use("/api",healthCheckRoutes);
app.use("/api/users",userRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/officers", officerRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin/users", userRoutes);


export default app