import mongoose from "mongoose";

const ShortUrlSchema = mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
    trim: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  urlId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
});

const Urls = mongoose.model("Urls", ShortUrlSchema);

export default Urls;
