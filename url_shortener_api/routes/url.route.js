import express from "express";
import {
  createShortUrl,
  getUrl,
  deleteUrl,
} from "../controllers/url.controller.js";

const router = express.Router();

router.post("/create-short-url", createShortUrl);
router.get("/get-all-short-urls/:userName", getUrl);
router.delete("/delete/:_id", deleteUrl);

export default router;
