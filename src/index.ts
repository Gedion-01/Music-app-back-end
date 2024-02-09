import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();

import cors from "cors"

const app = express();
app.use(cors())
app.use(bodyParser.json());
const port = process.env.PORT;

const DB_URL = process.env.LOCAL_DB_URL

if (!DB_URL) {
    console.error('Database URL not found in environment variables');
    process.exit(1); // Exit the process if the database URL is not provided
}
  
mongoose.connect(DB_URL).then(() => {
	console.log("connected");
});
import songsRoute from "./routers/songsRoute"
import staticsRoute from "./routers/statisticsRoute"
//const songsRoute = require ("./routers/songsRoute")
app.use(songsRoute)
app.use(staticsRoute)


app.listen(3000, () => {
  console.log(`[server]: Server is running at http://localhost:3000`);
});