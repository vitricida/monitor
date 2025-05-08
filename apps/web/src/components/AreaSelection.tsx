import { useState, useEffect } from "react";
import Map from "./Map";
import SelectionInfo from "./SelectionInfo";

export interface Point {
  id: number;
  lat: number;
  lng: number;
}

const AreaSelection = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [showPolygon, setShowPolygon] = useState(false);

  useEffect(() => {
    if (showPolygon && points.length >= 3) {
      const geojson = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              ...points.map((point) => [point.lng, point.lat]),
              [points[0].lng, points[0].lat], // Cerrar el polígono
            ],
          ],
        },
      };
      console.log(JSON.stringify(geojson));
    }
  }, [points, showPolygon]);

  const handleMapClick = (lat: number, lng: number) => {
    const newPoints = [...points, { id: points.length + 1, lat, lng }];
    setPoints(newPoints);
  };

  const handleDeleteLastPoint = () => {
    if (points.length === 0) return;

    const newPoints = points.slice(0, -1);

    if (newPoints.length < 3) {
      setShowPolygon(false);
    }

    const updatedPoints = newPoints.map((point, i) => ({
      ...point,
      id: i + 1,
    }));

    setPoints(updatedPoints);
  };

  const handleMarkerDragEnd = (pointId: number, lat: number, lng: number) => {
    const updatedPoints = points.map((point) =>
      point.id === pointId ? { ...point, lat, lng } : point
    );
    setPoints(updatedPoints);
  };

  const handleDeletePolygon = () => {
    setPoints([]);
    setShowPolygon(false);
  };

  const handleMarkerClick = (pointId: number) => {
    if (points.length >= 3 && pointId === 1) {
      setShowPolygon(true);
    }
  };

  const handleMidpointDragEnd = (index: number, lat: number, lng: number) => {
    const newPoint = {
      id: index + 2,
      lat,
      lng,
    };

    const newPoints = [...points];
    newPoints.splice(index + 1, 0, newPoint);

    const updatedPoints = newPoints.map((point, i) => ({
      ...point,
      id: i + 1,
    }));

    setPoints(updatedPoints);
  };

  return (
    <div className="w-full mpb-4 lg:pb-0">
      <div className="flex flex-col lg:flex-row gap-4 lg:h-[500px] p-4 lg:p-0">
        <div className="w-full lg:w-2/3 h-[500px]">
          <Map
            onMapClick={handleMapClick}
            points={points}
            onMarkerDragEnd={handleMarkerDragEnd}
            onMarkerClick={handleMarkerClick}
            showPolygon={showPolygon}
            onMidpointDragEnd={handleMidpointDragEnd}
          />
        </div>
        <div className="w-full lg:w-1/3 lg:h-[500px]">
          <SelectionInfo
            points={points}
            onDeleteLastPoint={handleDeleteLastPoint}
            onDeletePolygon={handleDeletePolygon}
            showPolygon={showPolygon}
          />
        </div>
      </div>
    </div>
  );
};

export default AreaSelection;
