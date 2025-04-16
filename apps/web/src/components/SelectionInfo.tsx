import { memo } from "react";

interface LocationInfo {
  country: string;
  countryCode: string;
  region: string;
}

interface SelectionInfoProps {
  polygonPath: google.maps.LatLngLiteral[];
  locationInfo: LocationInfo | null;
  area: number | null;
  onClearPolygon: () => void;
  onRemoveLastPoint: () => void;
}

const SelectionInfo = memo(
  ({
    polygonPath,
    locationInfo,
    area,
    onClearPolygon,
    onRemoveLastPoint,
  }: SelectionInfoProps) => {
    if (polygonPath.length === 0) {
      return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300">
            Click on the map to start drawing a polygon
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full p-4 bg-gray-100 dark:bg-gray-800">
        <div className="flex-grow space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Area Information
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Points:</span>
              <span className="text-gray-900 dark:text-white">
                {polygonPath.length}
              </span>
            </div>

            {area && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Area:</span>
                <span className="text-gray-900 dark:text-white">
                  {area.toFixed(2)} hectares
                </span>
              </div>
            )}

            {locationInfo && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Country:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {locationInfo.country}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Region:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {locationInfo.region}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 flex gap-2">
          {polygonPath.length > 0 && (
            <button
              onClick={onRemoveLastPoint}
              className="flex-1 py-1.5 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors duration-200 text-sm"
            >
              Delete Last Point
            </button>
          )}
          {polygonPath.length >= 3 && (
            <button
              onClick={onClearPolygon}
              className="flex-1 py-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 text-sm"
            >
              Delete Polygon
            </button>
          )}
        </div>
      </div>
    );
  }
);

SelectionInfo.displayName = "SelectionInfo";

export default SelectionInfo;
