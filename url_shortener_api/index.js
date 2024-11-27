import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Connected");
});

// app.use("/v1/api/user");
app.use("/v1/api/auth", authRouter);

app.listen(3000, () => {
  console.log("Listening at PORT 3000");
});
