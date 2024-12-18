import React from "react";
import { useState, useEffect } from "react";
import ThemeToggleButton from "../components/ThemeToggleButton.jsx";
import Button from "@mui/material/Button";
import UrlTable from "../components/UrlTable.jsx";
import InputField from "../components/InputField.jsx";
import TransitionModal from "../Modal/TransitionModal.jsx";
import SignUp from "./SignUp.jsx";
import SignIn from "./SignIn.jsx";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(true);
  const [user, setUser] = useState(localStorage.getItem("username"));
  const [data, setData] = useState([]);
  const [cookie, setCookie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const SignUpOpen = () => setLogin((old) => !old);

  const userName = () => setUser(localStorage.getItem("username"));

  const handleSignout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/v1/api/auth/signout",
        { withCredentials: true },
      );
      console.log(response.data);

      enqueueSnackbar(`${response.data}`, { variant: "success" });
      localStorage.removeItem("username");
      setUser(null);
      fetchData();
    } catch (error) {
      enqueueSnackbar(`${error?.message || "Error while logging out"}`, {
        variant: "error",
      });
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const userName = localStorage.getItem("username") || "null";

    if (userName === "null") {
      console.log("No username found");
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      setCookie(document.cookie);

      const url = cookie
        ? `http://localhost:3000/v1/api/url/get-all-short-urls-user/${userName}`
        : `http://localhost:3000/v1/api/url/get-all-short-urls/${userName}`;

      const response = await axios.get(url, {
        withCredentials: !!cookie,
      });

      setData(response.data.urls);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      enqueueSnackbar(error.message, {
        variant: "error",
      });
      // setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-dark-svg flex w-screen flex-grow flex-col items-center gap-12 p-5">
      <div className="flex items-center gap-10 self-end">
        <div className="dark:text-white">
          <div className="flex items-center gap-3">
            {!user?.startsWith("system") && user ? (
              <span>
                Welcome <span className="text-lg font-semibold">{user}</span>
              </span>
            ) : (
              <Button
                size="medium"
                variant="contained"
                className="!bg-blue-600 hover:!bg-blue-700"
                onClick={handleOpen}
              >
                LogIn
              </Button>
            )}
            {user && !user.startsWith("system") && (
              <Button
                size="medium"
                variant="contained"
                className="!bg-red-600 hover:!bg-red-700"
                onClick={handleSignout}
              >
                LogOut
              </Button>
            )}
          </div>

          <TransitionModal open={open} handleClose={handleClose}>
            {login ? (
              <SignIn
                SignUpOpen={SignUpOpen}
                handleClose={handleClose}
                userName={userName}
                fetchData={fetchData}
              />
            ) : (
              <SignUp
                SignUpOpen={SignUpOpen}
                handleClose={handleClose}
                fetchData={fetchData}
              />
            )}
          </TransitionModal>
        </div>

        <div className="flex">
          <ThemeToggleButton />
        </div>
      </div>

      <h1 className="text-4xl font-semibold text-black dark:text-white">
        URL Shortener
      </h1>
      <div>
        <InputField fetchData={fetchData} />
      </div>
      <UrlTable data={data} isLoading={isLoading} fetchData={fetchData} />
      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        disableWindowBlurListener={true}
        preventDuplicate={true}
      />
    </div>
  );
};

export default Home;
