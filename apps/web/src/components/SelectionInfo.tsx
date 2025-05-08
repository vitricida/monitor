import { Point } from "./AreaSelection";
import {
  TrashIcon,
  XMarkIcon,
  MapPinIcon,
  PlusCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface SelectionInfoProps {
  points: Point[];
  onDeleteLastPoint: () => void;
  onDeletePolygon: () => void;
  showPolygon: boolean;
}

const SelectionInfo = ({
  points,
  onDeleteLastPoint,
  onDeletePolygon,
  showPolygon,
}: SelectionInfoProps) => {
  return (
    <div className="bg-white shadow-lg p-4 h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Selected area</h2>
      <div className="flex-1 overflow-y-auto min-h-0">
        {!showPolygon ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="text-gray-500 space-y-4">
              {points.length === 0 ? (
                <MapPinIcon className="w-12 h-12 mx-auto text-gray-400" />
              ) : points.length < 3 ? (
                <PlusCircleIcon className="w-12 h-12 mx-auto text-gray-400" />
              ) : (
                <CheckCircleIcon className="w-12 h-12 mx-auto text-gray-400" />
              )}
              <p className="font-medium">Draw your area on the map</p>
              <p className="text-sm">
                {points.length === 0
                  ? "Enter the first point on the map"
                  : points.length < 3
                    ? "Add more points to create a polygon. You can drag any point to adjust its position"
                    : "Click on the first point (blue) to close the polygon, or continue adding more points if needed"}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="text-gray-500 space-y-4">
              <CheckCircleIcon className="w-12 h-12 mx-auto text-green-500" />
              <p className="font-medium">Area selected successfully!</p>
              <p className="text-sm">
                You can drag any point to adjust the area, or use the midpoint
                markers to add new points
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2 shrink-0">
        <button
          onClick={onDeleteLastPoint}
          disabled={points.length === 0}
          className="flex-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 font-medium"
        >
          <XMarkIcon className="w-3 h-3" />
          Delete Last Point
        </button>
        <button
          onClick={onDeletePolygon}
          disabled={!showPolygon}
          className="flex-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 font-medium"
        >
          <TrashIcon className="w-3 h-3" />
          Delete Polygon
        </button>
      </div>
    </div>
  );
};

export default SelectionInfo;
