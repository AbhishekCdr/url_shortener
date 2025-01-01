import express from "express";
import {
  changeExpiry,
  createCustomUrl,
  createShortUrl,
  getUrl,
} from "../controllers/url.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { deleteUrl } from "../controllers/redis.controller.js";

const router = express.Router();

router.post("/create-short-url", createShortUrl);
router.post("/create-custom-url", createCustomUrl);
router.get("/get-all-short-urls-user/:userName", verifyToken, getUrl);
router.get("/get-all-short-urls/:userName", getUrl);
router.delete("/delete/:_id", deleteUrl);
router.patch("/expiry/:_id", changeExpiry);

export default router;
