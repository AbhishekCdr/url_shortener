import Urls from "../models/url.model.js";
import { nanoid } from "nanoid";

export const createShortUrl = async (req, res) => {
  try {
    const { longUrl, userName } = req.body;

    // Validate input
    if (!longUrl || typeof longUrl !== "string") {
      return res.status(400).json({ error: "Invalid or missing longUrl" });
    }

    // If already exist in db fir username
    let existingUrl;
    if (userName) {
      existingUrl = await Urls.findOne({ longUrl, userName });
    }

    // If an existing URL is found, return it
    if (existingUrl) {
      return res.status(200).json({
        message: "Short URL already exists for the given URL and user",
        shortUrl: existingUrl.shortUrl,
      });
    }

    // Generate a unique short ID
    const urlId = nanoid(8);

    const baseUrl = process.env.BASE_URL || "http://localhost:3000"; // Replace with your domain
    const shortUrl = `${baseUrl}/${urlId}`;

    const newShortUrl = new Urls({
      longUrl,
      shortUrl,
      urlId,
      userName,
      clicks: 0,
    });

    await newShortUrl.save();

    res.status(201).json({
      message: "Short URL created successfully",
      shortUrl,
    });
  } catch (err) {
    console.error("Error creating short URL:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// REDIRECT_URL

export const redirectUrl = async (req, res) => {
  try {
    const { urlId } = req.params;

    const urlEntry = await Urls.findOne({ urlId });

    if (!urlEntry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    urlEntry.clicks += 1;
    await urlEntry.save();

    return res.redirect(urlEntry.longUrl);
  } catch (err) {
    console.error("Error during redirection:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET_ALL_LINKS

export const getUrl = async (req, res) => {
  try {
    const { userName } = req.params;

    // Validate the userName parameter
    if (!userName || userName == "null" || typeof userName !== "string") {
      return res.status(400).json({ error: "Invalid or missing userName" });
    }

    // Retrieve all URLs associated with the given userName
    const urls = await Urls.find({ userName });

    // Check if any URLs are found
    if (urls.length === 0) {
      return res.status(404).json({ message: "No URLs found for this user" });
    }

    // Return the retrieved URLs
    res.status(200).json({
      message: `URLs retrieved for user ${userName}`,
      urls,
    });
  } catch (err) {
    console.error("Error retrieving URLs:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!_id || typeof _id != "string") {
      return res.status(400).json({ error: "Invalid or missing urlId" });
    }

    const deletedUrl = await Urls.findOneAndDelete({ _id });

    if (!deleteUrl) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.status(200).json({
      message: "URL deleted succesfully",
      deletedUrl,
    });
  } catch (error) {
    console.log("Error deleting url", error);
    res.status(500).json({ error: "Server Error" });
  }
};
