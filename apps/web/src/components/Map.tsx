import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";
import { Point } from "./AreaSelection";
import { useEffect, useRef, useState } from "react";

interface MapProps {
  onMapClick: (lat: number, lng: number) => void;
  points: Point[];
  onMarkerDragEnd: (pointId: number, lat: number, lng: number) => void;
  onMarkerClick: (pointId: number) => void;
  showPolygon: boolean;
  onMidpointDragEnd: (index: number, lat: number, lng: number) => void;
  centroid: { lat: number; lng: number } | null;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -32.5228, // Centro geográfico de Uruguay
  lng: -55.7658,
};

const mapOptions = {
  mapTypeId: "hybrid",
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: false,
  draggableCursor: "crosshair",
  draggingCursor: "grab",
};

const polygonOptions = {
  fillColor: "#22C55E",
  fillOpacity: 0.35,
  strokeColor: "#16A34A",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
};

const Map = ({
  onMapClick,
  points,
  onMarkerDragEnd,
  onMarkerClick,
  showPolygon,
  onMidpointDragEnd,
  centroid,
}: MapProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [tempPolygonPoints, setTempPolygonPoints] = useState<Point[]>([]);

  useEffect(() => {
    if (showPolygon && points.length >= 3 && mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      points.forEach((point) => {
        bounds.extend({ lat: point.lat, lng: point.lng });
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [showPolygon, points]);

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onMapClick(e.latLng.lat(), e.latLng.lng());
    }
  };

  const handleMarkerDrag = (pointId: number, e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onMarkerDragEnd(pointId, e.latLng.lat(), e.latLng.lng());
    }
  };

  const handleMarkerDragEnd = (
    pointId: number,
    e: google.maps.MapMouseEvent
  ) => {
    if (e.latLng) {
      onMarkerDragEnd(pointId, e.latLng.lat(), e.latLng.lng());
    }
  };

  const handleMidpointDrag = (index: number, e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      // Crear una copia temporal de los puntos con el midpoint actualizado
      const tempPoints = [...points];
      tempPoints.splice(index + 1, 0, {
        id: index + 2,
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
      setTempPolygonPoints(tempPoints);
    }
  };

  const handleMidpointDragEnd = (
    index: number,
    e: google.maps.MapMouseEvent
  ) => {
    if (e.latLng) {
      setTempPolygonPoints([]); // Limpiar puntos temporales
      onMidpointDragEnd(index, e.latLng.lat(), e.latLng.lng());
    }
  };

  const getPolygonPath = () => {
    // Usar puntos temporales si existen, sino usar los puntos normales
    const pointsToUse =
      tempPolygonPoints.length > 0 ? tempPolygonPoints : points;
    return pointsToUse.map((point) => ({
      lat: point.lat,
      lng: point.lng,
    }));
  };

  const getMidpoints = () => {
    if (points.length < 3) return [];

    const midpoints = [];
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];

      const midLat = (current.lat + next.lat) / 2;
      const midLng = (current.lng + next.lng) / 2;

      midpoints.push({
        index: i,
        lat: midLat,
        lng: midLng,
      });
    }
    return midpoints;
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={6}
          options={mapOptions}
          onClick={handleClick}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {points.map((point) => (
            <Marker
              key={point.id}
              position={{ lat: point.lat, lng: point.lng }}
              icon={
                point.id === 1
                  ? {
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 5,
                      fillColor: "#1E40AF",
                      fillOpacity: 1,
                      strokeColor: "#ffffff",
                      strokeWeight: 2,
                    }
                  : {
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 5,
                      fillColor: "#16A34A",
                      fillOpacity: 1,
                      strokeColor: "#ffffff",
                      strokeWeight: 2,
                    }
              }
              label={undefined}
              draggable={true}
              onDrag={(e) => handleMarkerDrag(point.id, e)}
              onDragEnd={(e) => handleMarkerDragEnd(point.id, e)}
              onClick={() => onMarkerClick(point.id)}
            />
          ))}
          {showPolygon && points.length >= 3 && (
            <>
              <Polygon paths={getPolygonPath()} options={polygonOptions} />
              {getMidpoints().map((midpoint) => (
                <Marker
                  key={`mid-${midpoint.index}`}
                  position={{ lat: midpoint.lat, lng: midpoint.lng }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 2.5,
                    fillColor: "#16A34A",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 1,
                  }}
                  draggable={true}
                  cursor="move"
                  onDrag={(e) => handleMidpointDrag(midpoint.index, e)}
                  onDragEnd={(e) => handleMidpointDragEnd(midpoint.index, e)}
                  clickable={true}
                />
              ))}
            </>
          )}
          {centroid && showPolygon && (
            <Marker
              position={{ lat: centroid.lat, lng: centroid.lng }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#DC2626",
                fillOpacity: 0.8,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
              clickable={false}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
