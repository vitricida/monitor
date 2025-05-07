import { Point } from "./AreaSelection";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
      <h2 className="text-xl font-bold text-gray-900 mb-4">Selected Points</h2>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-2">
          {points.map((point) => (
            <div
              key={point.id}
              className="bg-gray-50 p-2 rounded flex justify-between items-center"
            >
              <span className="font-medium text-gray-900">
                Point {point.id}
              </span>
              <span className="text-sm text-gray-600 font-mono">
                {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
              </span>
            </div>
          ))}
        </div>
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
