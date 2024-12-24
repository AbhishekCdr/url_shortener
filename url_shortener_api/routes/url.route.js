import express from "express";
import {
  createShortUrl,
  getUrl,
  isActive,
} from "../controllers/url.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { deleteUrl } from "../utils/redisConnect.js";

const router = express.Router();

router.post("/create-short-url", createShortUrl);
router.get("/get-all-short-urls-user/:userName", verifyToken, getUrl);
router.get("/get-all-short-urls/:userName", getUrl);
router.delete("/delete/:_id", deleteUrl);
router.patch("/isActive/:_id", isActive);

export default router;
