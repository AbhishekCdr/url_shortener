import React, { useContext, useState } from "react";
import { Box, Button, Switch, styled, TextField } from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import TransitionModal from "../Modal/TransitionModal";
import CustomUrl from "./CustomUrl";
import { ThemeContext } from "../ThemeContext";

const InputField = (props) => {
  const { fetchData, setHighlight, cookie, custom, handleCustom } = props;
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const [open, setOpen] = useState(false);
  const { url } = useContext(ThemeContext);

  const clearInput = () => setInputValue("");

  const handleClose = () => {
    setOpen(false);
    setButtonDisable(false);
  };

  const CustomSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#80C4E9", // Custom color
      "&:hover": {
        backgroundColor: alpha("#80C4E9", theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#80C4E9", // Custom color for the track when checked
    },
  }));

  const handleCustomSubmit = async (event) => {
    event.preventDefault();
    setButtonDisable(true);
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlRegex.test(inputValue)) {
      setError("Please enter a valid website URL.");
      enqueueSnackbar("Please enter a valid website URL.", {
        variant: "error",
      });
      setButtonDisable(false);
      return;
    } else {
      setError("");
    }
    setError("");
    setOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonDisable(true);
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlRegex.test(inputValue)) {
      setError("Please enter a valid website URL.");
      enqueueSnackbar("Please enter a valid website URL.", {
        variant: "error",
      });
      setButtonDisable(false);
      return;
    } else {
      setError("");
    }
    setError("");

    let username = localStorage.getItem("username");
    if (!username) {
      username = `system_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem("username", username);
    }

    const payload = {
      longUrl: inputValue,
      userName: username,
    };

    try {
      const response = await axios.post(
        `${url}/v1/api/url/create-short-url`,
        payload,
      );

      if (response.status === 201) {
        enqueueSnackbar(`${response.data.message}`, {
          variant: "success",
        });
        // console.log("Short URL created successfully:", response.data);
        setInputValue("");
        setButtonDisable(false);
        fetchData();
      } else if (response.status === 200) {
        enqueueSnackbar(`${response.data.message}`, {
          variant: "warning",
        });
        setButtonDisable(false);

        setInputValue("");
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
    <div className="first-line flex w-screen flex-col items-center space-y-2 px-4">
      <form
        className="flex w-full items-center space-x-4 sm:w-1/2 md:w-1/2 lg:w-1/2"
        onSubmit={custom ? handleCustomSubmit : handleSubmit}
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
            error={!!error}
            sx={{
              "& .MuiFilledInput-root": {
                bgcolor: "white",
                color: "black",
                "&:hover": {
                  bgcolor: "white",
                },
                "&.Mui-focused": {
                  bgcolor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black",
              },
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={buttonDisable}
          className="transform bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          size="large"
        >
          {custom ? <span> Custom</span> : <span>Shorten</span>}
          {cookie && (
            <CustomSwitch
              checked={custom}
              onClick={handleCustom}
              size="small"
            />
          )}
        </Button>
      </form>
      <TransitionModal open={open}>
        <CustomUrl
          handleClose={handleClose}
          inputValue={inputValue}
          clearInput={clearInput}
          setHighlight={setHighlight}
          fetchData={fetchData}
        />
      </TransitionModal>
    </div>
  );
};

export default InputField;
