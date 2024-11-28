import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route.js";
import urlRouter from "./routes/url.route.js";
import { redirectUrl } from "./controllers/url.controller.js";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("MONGO_DB Connected");
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

app.use("/v1/api/auth", authRouter);
app.use("/v1/api/url", urlRouter);
app.get("/:urlId", redirectUrl);

app.listen(3000, () => {
  console.log("Listening at PORT 3000");
});
