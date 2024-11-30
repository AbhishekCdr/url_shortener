import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  useMediaQuery,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const UrlTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      url: "https://example.combfhieafc",
      shortUrl: "https://short.ly/abc123",
      timeCreated: "2024-11-28 10:00 AM",
      expiry: "2024-12-01",
      clickCount: 5, // New property to track clicks
    },
    {
      id: 2,
      url: "https://anotherexample.com",
      shortUrl: "https://short.ly/xyz789",
      timeCreated: "2024-11-28 11:30 AM",
      expiry: "2024-12-05",
      clickCount: 12,
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(null); // Selected item for the popup
  const isSmallScreen = useMediaQuery("(max-width: 600px)"); // Media query for small screens

  const handleRowClick = (item) => {
    if (isSmallScreen) {
      setSelectedItem(item);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const handleDelete = (id) => {
    const filteredData = data.filter((item) => item.id !== id);
    setData(filteredData);
    handleClose();
  };

  const handleCopyToClipboard = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert("Short URL copied to clipboard!");
    } catch (err) {
      alert("Failed to copy URL. Please try again.");
    }
  };

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 dark:text-white">
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              {isSmallScreen ? (
                <>
                  <th className="px-6 py-3">Short URL</th>
                  <th className="px-6 py-3">Clicks</th>
                  <th className="px-6 py-3">Time Created</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3">URL</th>
                  <th className="px-6 py-3">Short URL</th>
                  <th className="px-6 py-3">Clicks</th>
                  <th className="px-6 py-3">Time Created</th>
                  <th className="px-6 py-3">Expiry</th>
                  <th className="px-6 py-3">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={isSmallScreen ? 3 : 6}
                  className="px-6 py-4 text-center"
                >
                  No data found. Please create a short URL to display here.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer border-b border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-600"
                  onClick={() => handleRowClick(item)}
                >
                  {isSmallScreen ? (
                    <>
                      <td
                        className="cursor-pointer px-6 py-4 text-blue-500 underline"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering row click
                          handleCopyToClipboard(item.shortUrl);
                        }}
                      >
                        {item.shortUrl}
                      </td>
                      <td className="px-6 py-4">{item.clickCount}</td>
                      <td className="px-6 py-4">{item.timeCreated}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">{item.url}</td>
                      <td
                        className="cursor-pointer px-6 py-4 text-blue-500 underline"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering row click
                          handleCopyToClipboard(item.shortUrl);
                        }}
                      >
                        {item.shortUrl}
                      </td>
                      <td className="px-6 py-4">{item.clickCount}</td>
                      <td className="px-6 py-4">{item.timeCreated}</td>
                      <td className="px-6 py-4">{item.expiry}</td>
                      <td className="px-6 py-4">
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(item.id)}
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

      {/* Popup (Modal) */}
      {isSmallScreen && selectedItem && (
        <Dialog
          open={!!selectedItem}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle className="bg-gray-100 dark:bg-gray-800 dark:text-white">
            URL Details
          </DialogTitle>
          <DialogContent className="bg-white dark:bg-gray-900 dark:text-gray-300">
            <div className="mb-4">
              <strong>URL:</strong> {selectedItem.url}
            </div>
            <div className="mb-4">
              <strong>Short URL:</strong> {selectedItem.shortUrl}
            </div>
            <div className="mb-4">
              <strong>Clicks:</strong> {selectedItem.clickCount}
            </div>
            <div className="mb-4">
              <strong>Time Created:</strong> {selectedItem.timeCreated}
            </div>
            <div>
              <strong>Expiry:</strong> {selectedItem.expiry}
            </div>
          </DialogContent>
          <DialogActions className="bg-gray-100 dark:bg-gray-800">
            <Button
              onClick={() => handleDelete(selectedItem.id)}
              startIcon={<DeleteIcon />}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Delete
            </Button>
            <Button
              onClick={handleClose}
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default UrlTable;
