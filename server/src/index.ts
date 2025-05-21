import express, { Request, Response } from "express";

import "reflect-metadata";
import { AppDataSource } from "./data-source";
import dotenv from 'dotenv'
import requestRouter from "../src/routes/request.route";
import userRouter from '../src/routes/user.route'
import softwareRouter from "../src/routes/software.route";
import cors from "cors"
dotenv.config()
import cookieParser from "cookie-parser";
const app = express();
const PORT =  5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);


app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',userRouter)
app.use('/api/software',softwareRouter)
app.use("/api/request", requestRouter);
app.use(express.json())




const StartServer=async()=>{
  try {
    await AppDataSource.initialize()
    console.log("✅ Connected to NeonDB via TypeORM");
     app.listen(PORT, () => {
       console.log(`🚀 Server running at http://localhost:${PORT}`);
     });
  } catch (error) {
    console.log(error)
    
  }
}
StartServer()




