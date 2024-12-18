import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Switch,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { enqueueSnackbar } from "notistack";
import LoadingSvgDark from "./Animation/LoadingSvgDark";
import LoadingSvgLight from "./Animation/LoadingSvgLight";
import axios from "axios";
import { isActive } from "../../../url_shortener_api/controllers/url.controller";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${suffix} ${month} ${year}`;
};

const UrlTable = (props) => {
  const { data, isLoading, fetchData } = props;

  const [selectedItem, setSelectedItem] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const handleRowClick = (item) => {
    if (isSmallScreen) {
      setSelectedItem(item);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const handleDelete = (_id) => {
    const filteredData = data.filter((item) => item._id !== _id);
    // Assuming setData is defined elsewhere
    setData(filteredData);
    handleClose();
  };

  const handleCopyToClipboard = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      enqueueSnackbar("Short URL copied to clipboard!", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Failed to copy URL");
    }
  };

  // const toggleActiveStatus = async (_id) => {
  //   try {
  //     const url = `http://localhost:3000/v1/api/url/isActive/${_id}`;

  //     const response = await axios.patch(url);

  //     enqueueSnackbar(response.data?.message, { variant: "info" });
  //     fetchData();
  //   } catch (error) {
  //     enqueueSnackbar(error.message, {
  //       variant: "error",
  //     });
  //   }
  // };

  // const toggleActiveStatus = (_id) => {
  //   setData((prevData) =>
  //     prevData.map((item) =>
  //       item._id === _id ? { ...item, isActive: !item.isActive } : item,
  //     ),
  //   );
  //   enqueueSnackbar("URL status updated successfully!", { variant: "info" });
  // };

  return (
    <div className="flex flex-col rounded-lg bg-white transition-all duration-500 dark:bg-[#121212] dark:text-white md:w-11/12">
      {isLoading ? (
        localStorage.getItem("theme") === "dark" ? (
          <div className="flex self-center">
            <LoadingSvgDark />
          </div>
        ) : (
          <div className="flex self-center">
            <LoadingSvgLight />
          </div>
        )
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg transition-all duration-500 dark:shadow-blue-900">
          <table className="min-w-full text-center text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-200 text-center transition-all duration-500 dark:bg-[#121212]">
              <tr>
                {isSmallScreen ? (
                  <>
                    <th className="px-3 py-3">Short URL</th>
                    <th className="px-3 py-3">Clicks</th>
                    <th className="px-3 py-3">Date Created</th>
                  </>
                ) : (
                  <>
                    <th className="px-3 py-3">URL</th>
                    <th className="px-3 py-3">Short URL</th>
                    <th className="px-3 py-3">Clicks</th>
                    <th className="px-3 py-3">Date Created</th>
                    <th className="px-3 py-3">Expiry</th>
                    {/* <th className="px-3 py-3">Status</th> */}
                    <th className="px-3 py-3">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={isSmallScreen ? 3 : 7}
                    className="px-6 py-4 text-center"
                  >
                    No data found. Please create a short URL to display here.
                  </td>
                </tr>
              ) : (
                [...data].reverse().map((item) => (
                  <tr
                    key={item._id}
                    className="cursor-pointer border-b border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-600"
                    onClick={() => handleRowClick(item)}
                  >
                    {isSmallScreen ? (
                      <>
                        <td className="px-3 py-4">
                          <div
                            className="cursor-pointer text-left text-blue-500 underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyToClipboard(item.shortUrl);
                            }}
                          >
                            {item.shortUrl}
                          </div>
                          <div className="block w-32 truncate text-left text-gray-500">
                            {item.longUrl}
                          </div>
                        </td>
                        <td className="px-3 py-4">{item.clicks}</td>
                        <td className="px-3 py-4">
                          {formatDate(item.createdAt)}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="flex items-center space-x-2 px-6 py-4">
                          <span
                            className={`relative inline-flex h-3 w-3 rounded-full ${
                              item.isActive ? "bg-green-400" : "bg-red-400"
                            }`}
                          >
                            <span
                              className={`absolute inline-flex h-full w-full rounded-full ${
                                item.isActive
                                  ? "animate-ping bg-green-400 opacity-75"
                                  : "bg-red-400 opacity-75"
                              }`}
                            ></span>
                          </span>
                          <span
                            className="block w-32 truncate text-left"
                            title={item.longUrl}
                          >
                            {item.longUrl}
                          </span>
                        </td>
                        <td
                          className="cursor-pointer px-6 py-4 text-left text-blue-500 underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyToClipboard(item.shortUrl);
                          }}
                        >
                          {item.shortUrl}
                        </td>
                        <td className="px-6 py-4">{item.clicks}</td>
                        <td className="px-6 py-4">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          {formatDate(item.expiresAt)}
                        </td>
                        {/* <td className="px-6 py-4">
                          <Switch
                            checked={item.isActive}
                            onChange={() => toggleActiveStatus(item._id)}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </td> */}
                        <td className="flex space-x-2 px-6 py-4">
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup (Modal) */}
      {isSmallScreen && selectedItem && (
        <Dialog
          open={!!selectedItem}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle className="bg-gray-100 dark:bg-[#121212] dark:text-white">
            URL Details
          </DialogTitle>
          <DialogContent className="bg-white dark:bg-[#121212] dark:text-gray-300">
            <div className="mb-4">
              <strong>URL:</strong> {selectedItem.longUrl}
            </div>
            <div className="mb-4">
              <strong>Short URL:</strong>{" "}
              <span
                className="cursor-pointer text-blue-500 underline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyToClipboard(selectedItem.shortUrl);
                }}
              >
                {selectedItem.shortUrl}
              </span>{" "}
            </div>
            <div className="mb-4">
              <strong>Clicks:</strong> {selectedItem.clicks}
            </div>
            <div className="mb-4">
              <strong>Date Created:</strong>{" "}
              {formatDate(selectedItem.createdAt)}
            </div>
            <div>
              <strong>Expiry:</strong> {formatDate(selectedItem.expiresAt)}
            </div>
            {/* <div className="mt-4 flex items-center">
              <strong>Status:</strong>
              <Switch
                checked={selectedItem.isActive}
                onChange={() => {
                  toggleActiveStatus(selectedItem._id);
                  setSelectedItem({
                    ...selectedItem,
                    isActive: !selectedItem.isActive,
                  });
                }}
                inputProps={{ "aria-label": "controlled" }}
                className="ml-4"
              />
            </div> */}
          </DialogContent>
          <DialogActions className="bg-gray-100 dark:bg-[#121212]">
            <Button
              onClick={() => handleDelete(selectedItem._id)}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
            <Button onClick={handleClose} color="primary" variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default UrlTable;
