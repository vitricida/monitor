import React from "react";
import AreaSelectMap from "../components/AreaSelectMap";
const Home = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        New monitored area
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Add a new monitored area to your list
      </p>
      <AreaSelectMap />
    </div>
  );
};

export default Home;
