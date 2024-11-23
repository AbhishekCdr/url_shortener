import React from "react";
import ThemeToggleButton from "../components/ThemeToggleButton.jsx";

const Home = () => {
  return (
    <div className="flex flex-grow flex-col items-center gap-10 p-5">
      <div className="flex self-end">
        <ThemeToggleButton />
      </div>

      <h1 className="text-4xl text-blue-500 dark:text-white">URL Shortener</h1>
    </div>
  );
};

export default Home;
