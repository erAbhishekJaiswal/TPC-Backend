import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";
dotenv.config({
    path:".env"
})
databaseConnection();
const app = express();

app.use(express.urlencoded({
    extended:true
}));

app.use(express.json());
app.use(cookieParser());

// const corsOptions = {
//     origin: "https://tpc-frontend-omega.vercel.app", // Replace with your frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
//     allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
//   };
// app.use(cors(corsOptions));

const corsOptions = {
    origin: 'https://tpc-frontend-omega.vercel.app', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, HTTP auth)
  };
  
  app.use(cors(corsOptions));

//cors policy
// const corsOptions ={
//     origin:"http://localhost:3000",
//     credentials:true
// }
// app.use(cors(corsOptions));

app.use(cors());

// const allowedOrigins = ["https://tpc-frontend-omega.vercel.app", "https://tpc-frontend-omega.vercel.app/login","http://localhost:3000/login","http://localhost:3000"];
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true, // Allow cookies if needed
// }));

app.use("/api/v1/user",userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.get('/',(req,res)=>{
    res.status(200).json({
        message:"coming from backend!"
    })
})

// app.get("/home",(req,res)=>{
// res.status(200).json({
//     message:"coming from backend!"
// })
// })
const port = process.env.PORT || 5000

app.listen(port ,()=>{
    console.log(`Server Liseten on Port ${port}`);
}

)