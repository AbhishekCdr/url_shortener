import React, { useState, useRef, useEffect, useContext } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { enqueueSnackbar } from "notistack";
import LoadingSvg from "./Animation/LoadingSvg";
import axios from "axios";
import TransitionModal from "../Modal/TransitionModal";
import ReactCalendar from "./ReactCalendar";
import { ThemeContext } from "../ThemeContext";

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
  const { data, isLoading, fetchData, highlightedId } = props;

  const [open, setOpen] = useState(false);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [selectedData, setSelectedData] = useState({});
  const { url } = useContext(ThemeContext);
  // const handleModalOpen = () => setOpen(true);

  const handleModalClose = () => {
    setOpen(false);
  };
  const handleExpiryChange = (item) => {
    setSelectedData(item);
    setOpen(true);
  };

  const handleRowClick = (item) => {
    if (isSmallScreen) {
      setSelectedItem(item);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const handleCopyToClipboard = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      enqueueSnackbar("Short URL copied to clipboard!", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Failed to copy URL");
    }
  };

  const handleDelete = async (_id) => {
    try {
      setLoadingIds((prev) => new Set(prev).add(_id)); // Add ID to loading state
      const response = await axios.delete(`${url}/v1/api/url/delete/${_id}`);
      if (response.status === 200) {
        enqueueSnackbar("URL deleted successfully", { variant: "success" });
        setLoadingIds((prev) => {
          const updated = new Set(prev);
          updated.delete(_id);
          return updated;
        });
        handleClose();
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting URL:", error);
      enqueueSnackbar("Failed to delete URL", { variant: "error" });
    } finally {
      setLoadingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(_id);
        return updated;
      });
    }
  };

  const rowRefs = useRef({});

  useEffect(() => {
    if (highlightedId && rowRefs.current[highlightedId]) {
      rowRefs.current[highlightedId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedId]);

  return (
    <>
      <div className="flex w-screen flex-col rounded-lg bg-white transition-all duration-500 dark:bg-[#121212] dark:text-white md:w-11/12">
        <div className="overflow-x-auto rounded-lg shadow-lg transition-all duration-500 dark:shadow-blue-900">
          <table className="min-w-full text-center text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-200 text-center transition-all duration-500 dark:bg-[#000000]">
              <tr>
                {isSmallScreen ? (
                  <>
                    <th className="px-3 py-3">Short URL</th>
                    <th className="px-3 py-3">Clicks</th>
                    <th className="px-3 py-3">🗓️ Date Created</th>
                  </>
                ) : (
                  <>
                    <th className="px-3 py-3">URL</th>
                    <th className="px-3 py-3">Short URL</th>
                    <th className="px-3 py-3">Clicks</th>
                    <th className="px-3 py-3">🗓️ Date Created</th>
                    <th className="px-3 py-3">🗓️ Expiry</th>
                    <th className="px-3 py-3">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={isSmallScreen ? 3 : 7} className="text-center">
                    <div className="flex items-center justify-center">
                      <LoadingSvg />
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={isSmallScreen ? 3 : 7}
                    className="px-6 py-4 text-center"
                  >
                    Please create a short URL to display here.
                  </td>
                </tr>
              ) : (
                [...data].reverse().map((item) => (
                  <tr
                    key={item._id}
                    ref={(el) => (rowRefs.current[item.shortUrlID] = el)}
                    className={`cursor-pointer border-b border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-600 ${
                      item.shortUrl === highlightedId
                        ? "bg-yellow-200 transition-all duration-300 ease-in-out dark:bg-slate-100"
                        : ""
                    }`}
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
                          <div className="line-clamp-1 block w-32 text-left text-gray-500">
                            {item.longUrl}
                          </div>
                        </td>
                        <td className="px-3 py-4">{item.clicks}</td>
                        <td className="px-3 py-4 font-semibold">
                          {formatDate(item.createdAt)}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="flex items-center space-x-2 px-5 py-4">
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
                            className="line-clamp-1 block w-32 text-left"
                            title={item.longUrl}
                          >
                            {item.longUrl}
                          </span>
                        </td>
                        <td
                          className="cursor-pointer px-5 py-4 text-left text-blue-500 underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyToClipboard(item.shortUrl);
                          }}
                        >
                          {item.shortUrl}
                        </td>
                        <td className="px-6 py-4">{item.clicks}</td>
                        <td className="px-6 py-4 font-semibold">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-5 py-4 font-semibold text-red-500">
                          <Button
                            variant="text"
                            color="error"
                            size="small"
                            onClick={() => handleExpiryChange(item)}
                          >
                            {formatDate(item.expiresAt)}
                            <EditIcon />
                          </Button>
                        </td>
                        <td className="flex justify-center space-x-2 px-5 py-4">
                          <Button
                            variant="contained"
                            color="error"
                            size="medium"
                            disabled={loadingIds.has(item._id)}
                            onClick={() => handleDelete(item._id)}
                          >
                            {loadingIds.has(item._id) ? (
                              <AutorenewIcon className="animate-spin" />
                            ) : (
                              <DeleteIcon />
                            )}
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
                <strong>Expiry: </strong>
                <Button
                  variant="text"
                  color="error"
                  size="medium"
                  onClick={() => handleExpiryChange(selectedItem)}
                >
                  {formatDate(selectedItem.expiresAt)}
                  <EditIcon />
                </Button>
              </div>
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

        <TransitionModal open={open}>
          <ReactCalendar
            handleModalClose={handleModalClose}
            selectedData={selectedData}
            fetchData={fetchData}
          />
        </TransitionModal>
      </div>
    </>
  );
};

export default UrlTable;
