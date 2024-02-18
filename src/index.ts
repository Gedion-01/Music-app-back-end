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
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 5000
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('Mongoose reconnected to MongoDB');
});
  
mongoose.connect(DB_URL, options).then(() => {
	console.log("connected");
});
import songsRoute from "./routers/songsRoute"
import staticsRoute from "./routers/statisticsRoute"

app.use(songsRoute)
app.use(staticsRoute)


app.listen(PORT, () => {
  console.log(`[Server]: Server is running at http://localhost:${PORT}`);
});