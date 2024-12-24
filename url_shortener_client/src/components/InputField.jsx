import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const InputField = (props) => {
  const { fetchData, setHighlight } = props;
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from reloading the page
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlRegex.test(inputValue)) {
      setError("Please enter a valid website URL.");
      enqueueSnackbar("Please enter a valid website URL.", {
        variant: "error",
      });
      return;
    } else {
      setError("");
    }
    setError("");

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

      if (response.status === 201) {
        enqueueSnackbar(`${response.data.message}`, {
          variant: "success",
        });
        // console.log("Short URL created successfully:", response.data);
        setInputValue("");
        fetchData();
      } else if (response.status === 200) {
        enqueueSnackbar(`${response.data.message}`, {
          variant: "warning",
        });

        setInputValue("");
        setHighlight(response.data.shortUrl);
        setTimeout(() => {
          setHighlight("");
        }, 3000);
        // link already present
      } else {
        enqueueSnackbar;
        setError("Failed to create short URL. Please try again.");
      }
    } catch (error) {
      console.error("Error creating short URL:", error);
      enqueueSnackbar(error.message, {
        variant: "error",
      });
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
          <span>Convert 🚀</span>
        </Button>
      </form>
    </div>
  );
};

export default InputField;
