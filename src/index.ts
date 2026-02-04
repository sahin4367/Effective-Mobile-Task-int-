import express from "express";
import cors from "cors";
import * as dotenv from 'dotenv';
import "reflect-metadata";
import { v1Router } from "./routers";
import { AppDataSource } from "./DAL/config/data-source";
import { appConfig } from "./consts";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1' , v1Router);
AppDataSource.initialize()                       
    .then(() => {
        console.log("Database connected successfully!")
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error)
    })

const port = appConfig.PORT;
app.listen(port, () => {
    console.log(`Server is runing in Port : ${port}`);
    
})