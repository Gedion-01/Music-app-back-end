import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();

import cors from "cors"

const app = express();
app.use(cors())
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

const DB_URL = process.env.DB_URL

if (!DB_URL) {
    console.error('Database URL not found in environment variables');
    process.exit(1);
}
const options = {
  reconnectInterval: 10000,
  reconnectTries: Number.MAX_VALUE,
};
  
mongoose.connect(DB_URL, {
  serverSelectionTimeoutMS: 500000,
}).then(() => {
	console.log("connected");
});

import songsRoute from "./routers/songsRoute"
import staticsRoute from "./routers/statisticsRoute"

app.use(songsRoute)
app.use(staticsRoute)


app.listen(PORT, () => {
  console.log(`[Server]: Server is running at http://localhost:${PORT}`);
});