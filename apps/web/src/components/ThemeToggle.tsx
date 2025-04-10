import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      <div className="absolute left-1.5 right-1.5 flex items-center justify-between">
        <SunIcon className="h-4 w-4 text-yellow-500" />
        <MoonIcon className="h-4 w-4 text-gray-600" />
      </div>
      <span
        className={`${
          theme === "dark" ? "translate-x-6" : "translate-x-0.5"
        } inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm transition-transform`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggle;
