import { useState, useCallback, memo } from "react";
import { GoogleMap, Polygon } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: -32.5,
  lng: -55.5,
};

const defaultZoom = 6;

interface MapProps {
  polygonPath: google.maps.LatLngLiteral[];
  onPolygonPathChange: (path: google.maps.LatLngLiteral[]) => void;
  onPolygonUpdate: (polygon: google.maps.Polygon) => void;
  mapCenter?: google.maps.LatLngLiteral;
}

const Map = memo(
  ({
    polygonPath,
    onPolygonPathChange,
    onPolygonUpdate,
    mapCenter = defaultCenter,
  }: MapProps) => {
    const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);

    const handleMapClick = useCallback(
      (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          const newPath = [...polygonPath, newPoint];
          onPolygonPathChange(newPath);
        }
      },
      [polygonPath, onPolygonPathChange]
    );

    const handlePolygonUpdate = useCallback(() => {
      if (polygon) {
        const path = polygon.getPath();
        const newPath: google.maps.LatLngLiteral[] = [];
        path.forEach((latLng) => {
          newPath.push({ lat: latLng.lat(), lng: latLng.lng() });
        });
        onPolygonPathChange(newPath);
        onPolygonUpdate(polygon);
      }
    }, [polygon, onPolygonPathChange, onPolygonUpdate]);

    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={defaultZoom}
        onClick={handleMapClick}
        mapTypeId="hybrid"
        options={{
          streetViewControl: false,
        }}
      >
        {polygonPath.length > 0 && (
          <Polygon
            path={polygonPath}
            editable={true}
            draggable={true}
            onLoad={setPolygon}
            onMouseUp={handlePolygonUpdate}
            onDragEnd={handlePolygonUpdate}
          />
        )}
      </GoogleMap>
    );
  }
);

Map.displayName = "Map";

export default Map;
