import express from "express";
import connectDB from "../utils/connectDb.js";
import routes from "./routes.js";
import job from "../cron/cron.js";
import cors from "cors";

const PORT = 8080;
const app = express();


app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }))
app.listen(PORT, () => {
  connectDB();
  routes(app);
  console.log(`Server runniing on Port: ${PORT}!`);
  job.start();
})
