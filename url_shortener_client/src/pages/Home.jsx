import React from "react";
import { useState } from "react";
import ThemeToggleButton from "../components/ThemeToggleButton.jsx";
import Button from "@mui/material/Button";
import UrlTable from "../components/UrlTable.jsx";
import InputField from "../components/InputField.jsx";
import TransitionModal from "../Modal/TransitionModal.jsx";
import SignUp from "./SignUp.jsx";
import SignIn from "./SignIn.jsx";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const SignUpOpen = () => setLogin((old) => !old);

  return (
    <div className="bg-dark-svg flex w-screen flex-grow flex-col items-center gap-12 p-5">
      <div className="flex items-center gap-10 self-end">
        <div>
          <Button
            size="medium"
            variant="contained"
            className="!bg-blue-600 hover:!bg-blue-700"
            onClick={handleOpen}
          >
            LogIn
          </Button>
          <TransitionModal open={open} handleClose={handleClose}>
            {login ? (
              <SignIn SignUpOpen={SignUpOpen} />
            ) : (
              <SignUp SignUpOpen={SignUpOpen} />
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
        <InputField />
      </div>
      <UrlTable />
    </div>
  );
};

export default Home;
