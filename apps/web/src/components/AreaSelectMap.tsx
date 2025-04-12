import { useState, useCallback, memo } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import { libraries } from "../config/googleMaps";

/**
 * Container style for the Google Map component
 * @constant {Object}
 */
const containerStyle = {
  width: "100%",
  height: "500px",
};

/**
 * Default center coordinates for the map
 * @constant {Object}
 */
const defaultCenter = {
  lat: 0,
  lng: 0,
};

/**
 * AreaSelectMap Component
 *
 * A React component that provides an interactive map for drawing and editing polygons.
 * Features include:
 * - Click to add points
 * - Drag points to adjust positions
 * - Add intermediate points on polygon edges
 * - Delete last point
 * - Automatic GeoJSON generation
 *
 * @component
 * @returns {JSX.Element} The rendered map component
 */
const AreaSelectMap = memo(() => {
  // State for storing the polygon's path points
  const [polygonPath, setPolygonPath] = useState<google.maps.LatLngLiteral[]>(
    []
  );
  // Reference to the Google Maps Polygon instance
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  const [mapCenter, setMapCenter] =
    useState<google.maps.LatLngLiteral>(defaultCenter);
  const [locationInfo, setLocationInfo] = useState<{
    country: string;
    region: string;
  } | null>(null);

  /**
   * Calculates the centroid of a polygon
   * @param {google.maps.LatLngLiteral[]} points - Array of polygon points
   * @returns {google.maps.LatLngLiteral} The centroid coordinates
   */
  const calculateCentroid = useCallback(
    (points: google.maps.LatLngLiteral[]): google.maps.LatLngLiteral => {
      let x = 0;
      let y = 0;
      let z = 0;

      points.forEach((point) => {
        const lat = (point.lat * Math.PI) / 180;
        const lng = (point.lng * Math.PI) / 180;
        x += Math.cos(lat) * Math.cos(lng);
        y += Math.cos(lat) * Math.sin(lng);
        z += Math.sin(lat);
      });

      const total = points.length;
      x = x / total;
      y = y / total;
      z = z / total;

      const lng = Math.atan2(y, x);
      const hyp = Math.sqrt(x * x + y * y);
      const lat = Math.atan2(z, hyp);

      return {
        lat: (lat * 180) / Math.PI,
        lng: (lng * 180) / Math.PI,
      };
    },
    []
  );

  const getLocationInfo = useCallback(async (lat: number, lng: number) => {
    try {
      console.log("Geocoding for centroid:", { lat, lng });
      const geocoder = new google.maps.Geocoder();

      // Try geocoding with the centroid coordinates
      const response = await geocoder.geocode({
        location: { lat, lng },
      });

      console.log("Geocoding response:", response);

      if (response.results.length > 0) {
        const addressComponents = response.results[0].address_components;
        console.log("Address components:", addressComponents);

        let country = "";
        let region = "";

        // Look for country and region in the address components
        for (const component of addressComponents) {
          console.log("Checking component:", component);
          if (component.types.includes("country")) {
            country = component.long_name;
            console.log("Found country:", country);
          }
          if (component.types.includes("administrative_area_level_1")) {
            region = component.long_name;
            console.log("Found region:", region);
          }
        }

        if (country) {
          setLocationInfo({ country, region });
          console.log("Setting location info:", { country, region });
        } else {
          console.log("No country found in address components");
          setLocationInfo(null);
        }
      } else {
        console.log("No results from geocoding");
        setLocationInfo(null);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setLocationInfo(null);
    }
  }, []);

  /**
   * Handles map click events to add new points to the polygon
   * @param {google.maps.MapMouseEvent} e - The map click event
   */
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        const newPath = [...polygonPath, newPoint];
        setPolygonPath(newPath);
        if (newPath.length >= 3) {
          const centroid = calculateCentroid(newPath);
          setMapCenter(centroid);
          getLocationInfo(centroid.lat, centroid.lng);
          const geoJson = {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [
                [...newPath, newPath[0]].map((point) => [point.lng, point.lat]),
              ],
            },
          };
          console.log("Polygon GeoJSON:", JSON.stringify(geoJson, null, 2));
        } else {
          setLocationInfo(null);
        }
      }
    },
    [polygonPath, calculateCentroid, getLocationInfo]
  );

  /**
   * Removes the last point from the polygon path
   */
  const handleDeleteLastPoint = useCallback(() => {
    const newPath = polygonPath.slice(0, -1);
    setPolygonPath(newPath);
    if (newPath.length >= 3) {
      const geoJson = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [...newPath, newPath[0]].map((point) => [point.lng, point.lat]),
          ],
        },
      };
      console.log("Polygon GeoJSON:", JSON.stringify(geoJson, null, 2));
    } else {
      setLocationInfo(null);
    }
  }, [polygonPath]);

  /**
   * Updates the polygon path state when the polygon is edited
   * This function is called after any modification to the polygon:
   * - Moving points
   * - Adding intermediate points
   * - Dragging the entire polygon
   */
  const handlePolygonUpdate = useCallback(() => {
    if (polygon) {
      const path = polygon.getPath();
      const newPath: google.maps.LatLngLiteral[] = [];
      path.forEach((latLng) => {
        newPath.push({ lat: latLng.lat(), lng: latLng.lng() });
      });
      setPolygonPath(newPath);
      if (newPath.length >= 3) {
        const centroid = calculateCentroid(newPath);
        setMapCenter(centroid);
        getLocationInfo(centroid.lat, centroid.lng);
        const geoJson = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [...newPath, newPath[0]].map((point) => [point.lng, point.lat]),
            ],
          },
        };
        console.log("Polygon GeoJSON:", JSON.stringify(geoJson, null, 2));
      } else {
        setLocationInfo(null);
      }
    }
  }, [polygon, calculateCentroid, getLocationInfo]);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg relative">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={2}
          onClick={handleMapClick}
          options={{
            mapTypeId: "hybrid",
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            rotateControl: true,
            fullscreenControl: true,
            clickableIcons: true,
            gestureHandling: "greedy",
            streetViewControl: false,
            disableDoubleClickZoom: true,
            draggable: true,
            keyboardShortcuts: false,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {polygonPath.length > 0 && (
            <Polygon
              paths={polygonPath}
              options={{
                fillColor: "#9ACD32",
                fillOpacity: 0.35,
                strokeColor: "#9ACD32",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                editable: true,
                draggable: false,
                clickable: true,
              }}
              onLoad={setPolygon}
              onMouseUp={handlePolygonUpdate}
            />
          )}
        </GoogleMap>
      </LoadScript>
      {polygonPath.length > 0 && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleDeleteLastPoint}
            className="px-6 py-3 bg-red-600 text-white text-lg font-bold rounded-lg shadow-xl hover:bg-red-700 transition-colors border-2 border-white"
          >
            Delete last point
          </button>
        </div>
      )}
      {locationInfo && (
        <div className="absolute bottom-4 left-4 z-50 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
            Location Info:
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Country: {locationInfo.country}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Region: {locationInfo.region}
          </p>
        </div>
      )}
    </div>
  );
});

AreaSelectMap.displayName = "AreaSelectMap";

export default AreaSelectMap;
