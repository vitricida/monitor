import { useState } from "react";
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

  const handleMapClick = (lat: number, lng: number) => {
    setPoints([...points, { id: points.length + 1, lat, lng }]);
  };

  const handleDeleteLastPoint = () => {
    if (points.length === 0) return;

    // Eliminar el último punto
    const newPoints = points.slice(0, -1);

    // Si después de eliminar quedan menos de 3 puntos, ocultar el polígono
    if (newPoints.length < 3) {
      setShowPolygon(false);
    }

    // Actualizar los IDs de los puntos restantes
    const updatedPoints = newPoints.map((point, i) => ({
      ...point,
      id: i + 1,
    }));

    setPoints(updatedPoints);
  };

  const handleMarkerDragEnd = (pointId: number, lat: number, lng: number) => {
    setPoints(
      points.map((point) =>
        point.id === pointId ? { ...point, lat, lng } : point
      )
    );
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
