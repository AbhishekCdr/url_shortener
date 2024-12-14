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
  isActive: {
    type: Boolean,
    default: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 182 * 24 * 60 * 60 * 1000),
  },
});

const Urls = mongoose.model("Urls", ShortUrlSchema);

export default Urls;
