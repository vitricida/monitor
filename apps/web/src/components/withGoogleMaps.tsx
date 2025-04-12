import { LoadScript } from "@react-google-maps/api";
import { libraries } from "../config/googleMaps";

const withGoogleMaps = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithGoogleMaps = (props: P) => {
    return (
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <WrappedComponent {...props} />
      </LoadScript>
    );
  };

  WithGoogleMaps.displayName = `WithGoogleMaps(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
  return WithGoogleMaps;
};

export default withGoogleMaps;
