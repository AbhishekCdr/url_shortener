import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button,
} from "@mui/material";

const InputField = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  // URL validation regex
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  const handleSubmit = () => {
    if (!urlRegex.test(inputValue)) {
      setError("Please enter a valid website URL.");
    } else {
      setError("");
      alert("URL is valid: " + inputValue);
      // Add your form submission logic here
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 px-4">
      <div className="flex w-96 max-w-4xl items-center space-x-4">
        <FormControl
          fullWidth
          className="w-96"
          sx={{
            flexGrow: 1,
            maxWidth: { xs: "100%", sm: "75%", lg: "600px" },
          }}
        >
          <InputLabel
            htmlFor="outlined-adornment-url"
            className="dark:text-white"
          >
            Website URL
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            startAdornment={
              <InputAdornment position="start">🌐</InputAdornment>
            }
            label="Website URL"
            className="dark:text-white"
          />
        </FormControl>
        <Button
          variant="contained"
          className="!bg-green-700 text-white hover:!bg-green-800"
          onClick={handleSubmit}
          size="large"
        >
          Submit
        </Button>
      </div>
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
