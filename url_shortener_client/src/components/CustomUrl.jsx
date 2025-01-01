import { Button } from "@mui/material";
import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { ThemeContext } from "../ThemeContext";

const CustomUrl = (props) => {
  const [custom, setCustom] = useState("");
  const [error, setError] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);

  const { url } = useContext(ThemeContext);

  const { handleClose, inputValue, clearInput, setHighlight, fetchData } =
    props;

  const handleChange = (e) => {
    const words = e.target.value;
    if (words.length > 15) {
      setError(true);
      enqueueSnackbar("Input Limit exceeded");
    } else {
      setError(false);
      setCustom(e.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let username = localStorage.getItem("username");
    if (!username) {
      username = `system_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem("username", username);
    }

    const payload = {
      longUrl: inputValue,
      userName: username,
      urlId: custom,
    };

    try {
      setButtonDisable(true);
      const response = await axios.post(
        `${url}/v1/api/url/create-custom-url`,
        payload,
      );

      if (response.status === 201) {
        enqueueSnackbar(`${response.data.message}`, {
          variant: "success",
        });
        clearInput();
        setButtonDisable(false);
        fetchData();
        handleClose();
      } else if (response.status === 200) {
        enqueueSnackbar(`${response.data.message}`, {
          variant: "warning",
        });
        setButtonDisable(false);
        handleClose();
        clearInput();
        setHighlight(response.data.shortUrl);
        setTimeout(() => {
          setHighlight("");
        }, 3000);
        // link already present
      } else {
        enqueueSnackbar;
        setButtonDisable(false);
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
      setButtonDisable(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-5">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-medium">Create Custom URL</h1>
        <p className="text-xs">Enter custom URL upto 10 words</p>
      </div>

      <Box
        component="form"
        sx={{ "& > :not(style)": { m: 0 } }}
        noValidate
        autoComplete="off"
        className="flex items-center gap-0"
      >
        <span className="text-md">{url}/</span>
        <Input
          placeholder="custom"
          value={custom}
          onChange={handleChange}
          error={error}
        />
      </Box>

      <div className="flex gap-10">
        <Button
          size="medium"
          variant="contained"
          color="error"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          size="medium"
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={buttonDisable}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default CustomUrl;
