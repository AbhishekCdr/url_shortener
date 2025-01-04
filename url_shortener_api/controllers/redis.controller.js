import dotenv from "dotenv";
import { createClient } from "redis";
import Urls from "../models/url.model.js";

dotenv.config();

const client = createClient({
  url: process.env.REDIS,
});

export const getRedis = async (req, res) => {
  const { urlId } = req.params;

  try {
    // Connect to the Redis server
    await client.connect();
    console.log("Connected to Redis");
    // const userAgent = req.headers["user-agent"];
    // console.log("User-Agent:", userAgent);

    const exists = await client.exists(urlId);

    if (!exists) {
      const longUrl = await redirectUrl(urlId);
      if (longUrl) {
        await client.set(urlId, longUrl);
        console.log("redirect from Db");

        // console.log("User-Agent:", userAgent);

        return res.redirect(longUrl);
      } else {
        return res.status(404).send(`
          <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Short URL Not Found</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
          color: #343a40;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }
        .container {
          max-width: 600px;
          padding: 20px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #dc3545;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        ul li {
          margin: 10px 0;
        }
        a {
          text-decoration: none;
          color: #007bff;
        }
        a:hover {
          text-decoration: underline;
        }
        .btn {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          color: #fff;
          background-color: #007bff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          text-decoration: none;
        }
        .btn:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404 - Short URL Not Found</h1>
        <p>We couldn't find the URL you're looking for. It might be:</p>
        <ul>
          <li>The URL has expired.</li>
          <li>The URL was deleted by its creator.</li>
          <li>There might be a typo in the URL you entered.</li>
        </ul>
        <p>What can you do next?</p>
        <ul>
          <li>Double-check the URL and try again.</li>
        </ul>
        <a href="https://short-url-new.vercel.app/" class="btn">Go to Homepage</a>
      </div>
    </body>
    </html>
    `);
      }
    }

    const urlClicks = await Urls.findOne({ urlId });
    urlClicks.clicks += 1;
    await urlClicks.save();

    const longUrl = await client.get(urlId);
    await client.expire(urlId, 2628000);
    console.log("redirect from redis");
    return res.redirect(longUrl);
  } catch (error) {
    console.error("Error occurred while interacting with Redis:", error);
    return res.status(500).json({ error: "Internal Server Error" }); // Ensure a response is sent
  } finally {
    await client.disconnect();
    console.log("Disconnected from Redis");
  }
};

const redirectUrl = async (urlId) => {
  try {
    // Find the URL entry based on urlId
    const urlEntry = await Urls.findOne({ urlId });

    // Check if the URL entry exists and is active
    if (!urlEntry || !urlEntry.isActive) {
      return null; // Return null if not found or inactive
    }

    // Increment the click count and save
    urlEntry.clicks += 1;
    await urlEntry.save();

    return urlEntry.longUrl; // Return the long URL
  } catch (err) {
    console.error("Error during redirection:", err);
    return null; // Return null on error
  }
};

export const deleteUrl = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!_id || typeof _id != "string") {
      return res.status(400).json({ error: "Invalid or missing urlId" });
    }

    await client.connect();
    console.log("Connected to Redis");

    const deletedUrl = await Urls.findOneAndDelete({ _id });

    if (!deleteUrl) {
      return res.status(404).json({ error: "URL not found" });
    }

    await client.del(deletedUrl.urlId);

    res.status(200).json({
      message: "URL deleted succesfully",
      deletedUrl,
    });
  } catch (error) {
    console.log("Error deleting url", error);
    res.status(500).json({ error: "Server Error" });
  } finally {
    await client.disconnect();
    console.log("Disconnected from Redis");
  }
};
