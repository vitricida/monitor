import AreaSelectMap from "../components/AreaSelectMap";

const Home = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Welcome to the home page
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        This is the main page of the application
      </p>
      <div className="mt-8">
        <AreaSelectMap />
      </div>
    </div>
  );
};

export default Home;
