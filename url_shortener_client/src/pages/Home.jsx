import React, { useContext } from "react";
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
import Logo from "../assets/Logo.jsx";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import RefreshIcon from "@mui/icons-material/Refresh";
import GitHubIcon from "@mui/icons-material/GitHub";
import { ThemeContext } from "../ThemeContext.jsx";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(true);
  const [user, setUser] = useState(localStorage.getItem("username"));
  const [data, setData] = useState([]);
  const [cookie, setCookie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedId, setHighlightedId] = useState("null");
  const [custom, setCustom] = useState(false);
  const { url } = useContext(ThemeContext);
  const api = url;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const SignUpOpen = () => setLogin((old) => !old);

  const userName = () => setUser(localStorage.getItem("username"));

  const setHighlight = (ids) => {
    setHighlightedId(ids);
  };

  const handleCustom = () => {
    setCustom(() => !custom);
  };

  const handleSignout = async () => {
    try {
      const response = await axios.get(`${api}/v1/api/auth/signout`, {
        withCredentials: true,
      });
      console.log(response.data);

      enqueueSnackbar(`${response.data}`, { variant: "success" });
      localStorage.removeItem("username");
      setUser(null);
      setCookie(null);
      setCustom(false);
      fetchData();
    } catch (error) {
      enqueueSnackbar(`${error?.message || "Error while logging out"}`, {
        variant: "error",
      });
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const user = localStorage.getItem("username") || "null";

    if (user === "null") {
      console.log("No User");
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      setCookie(document.cookie);
      const url = cookie
        ? `${api}/v1/api/url/get-all-short-urls-user/${user}`
        : `${api}/v1/api/url/get-all-short-urls/${user}`;

      const response = await axios.get(url, {
        withCredentials: !!cookie,
      });

      // console.log(response);

      if (response.data.urls) {
        setData(response.data.urls);
        return;
      }
      setData([]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      enqueueSnackbar(error.message, {
        variant: "error",
      });
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
              <div>
                <Button
                  size="medium"
                  variant="contained"
                  className="!bg-red-600 hover:!bg-red-700"
                  onClick={handleSignout}
                >
                  LogOut
                </Button>
              </div>
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
                userName={userName}
              />
            )}
          </TransitionModal>
        </div>

        <div className="flex">
          <ThemeToggleButton />
        </div>
      </div>

      <div className="text-4xl font-semibold text-black dark:text-white">
        <Logo />
      </div>
      <div>
        <InputField
          fetchData={fetchData}
          setHighlight={setHighlight}
          cookie={cookie}
          custom={custom}
          handleCustom={handleCustom}
        />
      </div>

      <div className="flex w-screen flex-col items-center gap-3 p-5">
        <Box sx={{ "& > :not(style)": { m: 0 } }} className="self-end">
          <Fab
            aria-label="add"
            size="small"
            color="primary"
            disabled={data.length == 0}
            onClick={fetchData}
          >
            <RefreshIcon
              className={isLoading ? `animate-spin` : `animate-none`}
            />
          </Fab>
        </Box>
        <UrlTable
          data={data}
          isLoading={isLoading}
          fetchData={fetchData}
          highlightedId={highlightedId}
        />
      </div>

      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        disableWindowBlurListener={true}
        preventDuplicate={true}
      />
      {/* <div className="absolute bottom-2 flex items-center gap-2 text-xs text-gray-800 dark:text-gray-300">
        <p>Made with ❤️ in India</p>
        <a
          href="https://github.com/AbhishekCdr/url_shortener"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </a>
      </div> */}
    </div>
  );
};

export default Home;
