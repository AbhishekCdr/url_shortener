import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Fab from "@mui/material/Fab";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Fab
      size="medium"
      onClick={toggleTheme}
      className="transition-all duration-500"
    >
      {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </Fab>
  );
};

export default ThemeToggleButton;
