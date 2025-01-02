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

    if (existingUrl) {
      return res.status(200).json({
        message: "Short URL already exists for the given URL",
        shortUrl: existingUrl.shortUrl,
      });
    }

    let urlId = nanoid(8);

    const shortIds = await Urls.find({ urlId });

    while (shortIds.length > 0) {
      urlId = nanoid(8);
      const checkExisting = await Urls.find({ urlId });

      if (checkExisting.length === 0) {
        break;
      }
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/${urlId}`;

    const newShortUrl = new Urls({
      longUrl,
      shortUrl,
      urlId,
      userName,
      isActive: true,
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

export const createCustomUrl = async (req, res) => {
  try {
    const { longUrl, userName, urlId } = req.body;

    if (!longUrl || typeof longUrl !== "string") {
      return res.status(400).json({ error: "Invalid or missing longUrl" });
    }

    // If already exist in db fir username
    let existingUrl;
    if (userName) {
      existingUrl = await Urls.findOne({ longUrl, userName });
    }

    if (existingUrl) {
      return res.status(200).json({
        message: "Short URL already exists for the given URL",
        shortUrl: existingUrl.shortUrl,
      });
    }

    const shortIds = await Urls.find({ urlId });

    if (shortIds.length > 0) {
      return res.status(400).json({ error: "Custom URL ID already exists" });
    }

    const baseUrl = process.env.BASE_URL || "srty.vercel.app";
    const shortUrl = `${baseUrl}/${urlId}`;

    const newShortUrl = new Urls({
      longUrl,
      shortUrl,
      urlId,
      userName,
      isActive: true,
      clicks: 0,
    });

    await newShortUrl.save();

    res.status(201).json({
      message: "Custom Short URL created successfully",
      shortUrl,
    });
  } catch (err) {
    console.error("Error creating short URL:", err);
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
      return res.status(201).json({ message: "No URLs found for this user" });
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

//ISACTVE_TOGGLE

export const isActive = async (req, res) => {
  try {
    const { _id } = req.params;

    // Find the URL entry by urlId
    const urlEntry = await Urls.findOne({ _id });

    // Check if the URL entry exists
    if (!urlEntry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Toggle the isActive flag
    urlEntry.isActive = !urlEntry.isActive;

    // Save the updated entry
    await urlEntry.save();

    // Respond with the updated entry
    res.status(200).json({
      message: `URL isActive status toggled to ${urlEntry.isActive}`,
      updatedUrl: urlEntry,
    });
  } catch (err) {
    console.error("Error toggling isActive flag:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const changeExpiry = async (req, res) => {
  try {
    const { _id } = req.params;
    const urlEntry = await Urls.findOne({ _id });

    if (!urlEntry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    const { expiresAt } = req.body;

    urlEntry.expiresAt = expiresAt;

    await urlEntry.save();

    res.status(200).json({
      message: "Expiry date updated successfully",
      updatedUrl: urlEntry,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
