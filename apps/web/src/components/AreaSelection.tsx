import { useState, useEffect } from "react";
import Map from "./Map";
import SelectionInfo from "./SelectionInfo";
import * as turf from "@turf/turf";

export interface Point {
  id: number;
  lat: number;
  lng: number;
}

const AreaSelection = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [showPolygon, setShowPolygon] = useState(false);
  const [centroid, setCentroid] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [area, setArea] = useState<number>(0);

  const calculatePolygonMetrics = (currentPoints: Point[]) => {
    if (currentPoints.length < 3) {
      setCentroid(null);
      setArea(0);
      return;
    }

    // Crear un polígono de Turf.js
    const coordinates = currentPoints.map((point) => [point.lng, point.lat]);
    coordinates.push(coordinates[0]); // Cerrar el polígono
    const polygon = turf.polygon([coordinates]);

    // Calcular el centroide usando Turf.js
    const centroidPoint = turf.centroid(polygon);
    setCentroid({
      lat: centroidPoint.geometry.coordinates[1],
      lng: centroidPoint.geometry.coordinates[0],
    });

    // Calcular el área en metros cuadrados y convertir a hectáreas
    const areaInSquareMeters = turf.area(polygon);
    const areaInHectares = areaInSquareMeters / 10000;
    setArea(areaInHectares);
  };

  useEffect(() => {
    calculatePolygonMetrics(points);
  }, [points]);

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
            centroid={centroid}
          />
        </div>
        <div className="w-full lg:w-1/3 lg:h-[500px]">
          <SelectionInfo
            points={points}
            onDeleteLastPoint={handleDeleteLastPoint}
            onDeletePolygon={handleDeletePolygon}
            showPolygon={showPolygon}
            area={area}
            centroid={centroid}
          />
        </div>
      </div>
    </div>
  );
};

export default AreaSelection;
