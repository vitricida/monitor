import AreaSelection from "../components/AreaSelection";

const AddArea = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        New monitored area
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Add a new monitored area to your list
      </p>
      <AreaSelection />
    </div>
  );
};

export default AddArea;
