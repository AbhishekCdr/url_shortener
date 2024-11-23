import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { WiDaySunny } from "react-icons/wi";
import { MdNightlight } from "react-icons/md";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full bg-blue-500 px-4 py-2 text-white transition-all duration-500 dark:bg-yellow-500"
    >
      {theme === "light" ? <MdNightlight /> : <WiDaySunny />}
    </button>
  );
};

export default ThemeToggleButton;
