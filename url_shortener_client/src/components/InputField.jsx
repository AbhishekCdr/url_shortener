import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

const InputField = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  // URL validation regex
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents form from reloading the page
    if (!urlRegex.test(inputValue)) {
      setError("Please enter a valid website URL.");
    } else {
      setError("");
      alert("URL is valid: " + inputValue);
      // Add your form submission logic here
    }
  };

  return (
    <div className="first-line flex flex-col items-center space-y-2 px-4">
      <form
        className="flex w-96 max-w-4xl items-center space-x-4"
        onSubmit={handleSubmit}
      >
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            id="outlined-basic"
            label="Enter URL"
            variant="filled"
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
          className="!bg-green-700 text-white hover:!bg-green-800"
          size="large"
        >
          Convert
        </Button>
      </form>
      <div className="h-5 w-full max-w-4xl self-start">
        {/* Reserve space for the error message */}
        {error && (
          <p className="text-sm text-red-500 dark:text-white">{error}</p>
        )}
      </div>
    </div>
  );
};

export default InputField;
