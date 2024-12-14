import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import LoadingSvgDark from "./Animation/LoadingSvgDark";
import LoadingSvgLight from "./Animation/LoadingSvgLight";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

const InputField = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from reloading the page
    const urlRegex = /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/._-]*)?)?$/; // Simple URL regex

    if (!urlRegex.test(inputValue)) {
      setError("Please enter a valid website URL.");
      return;
    } else {
      setError("");
    }

    let username = localStorage.getItem("username");
    if (!username) {
      username = `system_${Math.random().toString(36).substring(2, 10)}`; // Generate a unique small username
      localStorage.setItem("username", username);
    }

    const payload = {
      longUrl: inputValue,
      userName: username,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/v1/api/url/create-short-url",
        payload,
      );

      if (response.status === 201 || 200) {
        enqueueSnackbar("Short URL created successfully", {
          variant: "success",
        });
        console.log("Short URL created successfully:", response.data);
      } else {
        setError("Failed to create short URL. Please try again.");
      }
    } catch (error) {
      console.error("Error creating short URL:", error);
      setError(
        "An error occurred while creating the short URL. Please try again later.",
      );
    }
  };

  return (
    <div className="first-line flex w-screen flex-col items-center space-y-2 px-4">
      <form
        className="flex w-full items-center space-x-4 sm:w-1/2 md:w-1/2 lg:w-1/2"
        onSubmit={handleSubmit}
      >
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            id="outlined-basic"
            label="Enter URL"
            variant="filled"
            size="normal"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
            error={!!error} // Highlights the field in red if there's an error
            sx={{
              "& .MuiFilledInput-root": {
                bgcolor: "white", // Background color of the input
                color: "black", // Text color of the input
                "&:hover": {
                  bgcolor: "white", // Ensure hover doesn't change background
                },
                "&.Mui-focused": {
                  bgcolor: "white", // Ensure focus doesn't change background
                },
              },
              "& .MuiInputLabel-root": {
                color: "black", // Label text color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black", // Focused label text color
              },
            }}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          className="!bg-green-700 text-white hover:!bg-red-600"
          size="large"
        >
          Convert 🚀
        </Button>
      </form>
      <div className="h-5 w-full max-w-4xl items-center text-center">
        <SnackbarProvider
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
        {/* {error && (
          <p className="text-center text-sm text-red-500 dark:text-white">
            {error}
          </p>
        )} */}
      </div>
    </div>
  );
};

export default InputField;
