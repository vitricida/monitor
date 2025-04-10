import { Link } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="flex items-center space-x-4">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
          404
        </h1>
      </div>
      <p className="text-xl text-gray-600 dark:text-gray-300">Page not found</p>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
      >
        <span>Back to home</span>
      </Link>
    </div>
  );
};

export default NotFound;
