import express from "express";
import connectDB from "../utils/connectDb.js";
import routes from "./routes.js";

const PORT = 8080;
const app = express();


app.use(express.json());
app.listen(PORT, () => {
  connectDB();
  routes(app);
  console.log(`Server runniing on Port: ${PORT}!`);
})
