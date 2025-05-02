import { useState, useCallback, memo } from "react";
import { LoadScript } from "@react-google-maps/api";
import { libraries } from "../config/googleMaps";
import Map from "./Map";
import SelectionInfo from "./SelectionInfo";

const defaultCenter = {
  lat: -32.5,
  lng: -55.5,
};

const AreaSelection = memo(() => {
  const [polygonPath, setPolygonPath] = useState<google.maps.LatLngLiteral[]>(
    []
  );
  const [mapCenter, setMapCenter] =
    useState<google.maps.LatLngLiteral>(defaultCenter);
  const [locationInfo, setLocationInfo] = useState<{
    country: string;
    countryCode: string;
    region: string;
  } | null>(null);
  const [area, setArea] = useState<number | null>(null);
  const MAX_AREA_HECTARES = 1000000; // 1,000,000 hectáreas = 10,000 km²

  const updateLocationInfo = useCallback(async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng },
      });

      if (response.results.length > 0) {
        const addressComponents = response.results[0].address_components;
        let country = "";
        let countryCode = "";
        let region = "";

        for (const component of addressComponents) {
          if (component.types.includes("country")) {
            country = component.long_name;
            countryCode = component.short_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            region = component.long_name;
          }
        }

        if (country) {
          setLocationInfo({ country, countryCode, region });
        } else {
          setLocationInfo(null);
        }
      } else {
        setLocationInfo(null);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setLocationInfo(null);
    }
  }, []);

  const calculateArea = useCallback((polygon: google.maps.Polygon) => {
    const area = google.maps.geometry.spherical.computeArea(polygon.getPath());
    const hectares = area / 10000;
    setArea(hectares);
  }, []);

  const handlePolygonPathChange = useCallback(
    (newPath: google.maps.LatLngLiteral[]) => {
      setPolygonPath(newPath);
      if (newPath.length >= 3) {
        const tempPolygon = new google.maps.Polygon({
          paths: newPath,
        });
        const area = google.maps.geometry.spherical.computeArea(
          tempPolygon.getPath()
        );
        const hectares = area / 10000;

        if (hectares > MAX_AREA_HECTARES) {
          alert(
            `El área seleccionada es demasiado grande (${hectares.toFixed(2)} hectáreas). El máximo permitido es ${MAX_AREA_HECTARES.toFixed(2)} hectáreas.`
          );
          setPolygonPath([]);
          setLocationInfo(null);
          setArea(null);
          return;
        }

        // Usar el primer punto del polígono como referencia para la ubicación
        const referencePoint = newPath[0];
        setMapCenter(referencePoint);
        updateLocationInfo(referencePoint.lat, referencePoint.lng);
        calculateArea(tempPolygon);
      } else {
        setLocationInfo(null);
        setArea(null);
      }
    },
    [updateLocationInfo, calculateArea]
  );

  const handlePolygonUpdate = useCallback(
    (polygon: google.maps.Polygon) => {
      const area = google.maps.geometry.spherical.computeArea(
        polygon.getPath()
      );
      const hectares = area / 10000;

      if (hectares > MAX_AREA_HECTARES) {
        alert(
          `El área seleccionada es demasiado grande (${hectares.toFixed(2)} hectáreas). El máximo permitido es ${MAX_AREA_HECTARES.toFixed(2)} hectáreas.`
        );
        setPolygonPath([]);
        setLocationInfo(null);
        setArea(null);
        return;
      }

      calculateArea(polygon);
      const path = polygon.getPath();
      const points: google.maps.LatLngLiteral[] = [];
      path.forEach((latLng) => {
        points.push({ lat: latLng.lat(), lng: latLng.lng() });
      });
      // Usar el primer punto del polígono como referencia para la ubicación
      const referencePoint = points[0];
      updateLocationInfo(referencePoint.lat, referencePoint.lng);
    },
    [calculateArea, updateLocationInfo]
  );

  const handleClearPolygon = useCallback(() => {
    setPolygonPath([]);
    setLocationInfo(null);
    setArea(null);
  }, []);

  const handleRemoveLastPoint = useCallback(() => {
    if (polygonPath.length > 0) {
      const newPath = polygonPath.slice(0, -1);
      setPolygonPath(newPath);

      if (newPath.length >= 3) {
        const tempPolygon = new google.maps.Polygon({
          paths: newPath,
        });
        const area = google.maps.geometry.spherical.computeArea(
          tempPolygon.getPath()
        );
        const hectares = area / 10000;

        if (hectares > MAX_AREA_HECTARES) {
          setPolygonPath([]);
          setLocationInfo(null);
          setArea(null);
          return;
        }

        const referencePoint = newPath[0];
        setMapCenter(referencePoint);
        updateLocationInfo(referencePoint.lat, referencePoint.lng);
        calculateArea(tempPolygon);
      } else {
        setLocationInfo(null);
        setArea(null);
      }
    }
  }, [polygonPath, updateLocationInfo, calculateArea]);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="grid grid-cols-1 md:grid-cols-[3fr,1fr]">
        <Map
          polygonPath={polygonPath}
          onPolygonPathChange={handlePolygonPathChange}
          onPolygonUpdate={handlePolygonUpdate}
          mapCenter={mapCenter}
        />
        <SelectionInfo
          polygonPath={polygonPath}
          locationInfo={locationInfo}
          area={area}
          onClearPolygon={handleClearPolygon}
          onRemoveLastPoint={handleRemoveLastPoint}
        />
      </div>
    </LoadScript>
  );
});

AreaSelection.displayName = "AreaSelection";

export default AreaSelection;
