import { useEffect, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ClearIcon from "@mui/icons-material/Clear";
import MapView from "./MapView";
import { DEFAULT_CENTER } from "./leafletSetup";

// Grabs the Leaflet map instance and hands it to the parent so the
// "use current location" button can pan/zoom to a new point.
const MapReady = ({ onReady }) => {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
};

// Drops / moves the pin when the user clicks the map.
const ClickLayer = ({ value, onChange }) => {
  useMapEvents({
    click(e) {
      onChange({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });
  if (value?.latitude == null || value?.longitude == null) return null;
  return (
    <Marker
      position={[value.latitude, value.longitude]}
      draggable
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = e.target.getLatLng();
          onChange({ latitude: lat, longitude: lng });
        },
      }}
    />
  );
};

/**
 * Lets a user set a location either by tapping "Use current location" or by
 * clicking / dragging a pin on the map. Reports the chosen point upward via
 * onChange({ latitude, longitude }). A null value means "no location set".
 */
const LocationPicker = ({ value, onChange, height = 300, label }) => {
  const [map, setMap] = useState(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const hasValue = value?.latitude != null && value?.longitude != null;
  const center = hasValue ? [value.latitude, value.longitude] : DEFAULT_CENTER;

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setError("");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        onChange({ latitude, longitude });
        if (map) map.flyTo([latitude, longitude], 15);
        setLocating(false);
      },
      (err) => {
        setError(err.message || "Could not get your location.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <Stack spacing={1.25}>
      {label && (
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      )}

      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <Button
          size="small"
          variant="outlined"
          startIcon={
            locating ? <CircularProgress size={16} /> : <MyLocationIcon />
          }
          onClick={useCurrentLocation}
          disabled={locating}
        >
          Use current location
        </Button>
        {hasValue && (
          <Button
            size="small"
            color="inherit"
            startIcon={<ClearIcon />}
            onClick={() => onChange(null)}
          >
            Clear
          </Button>
        )}
        <Typography variant="caption" color="text.secondary">
          {hasValue
            ? `${value.latitude.toFixed(5)}, ${value.longitude.toFixed(5)}`
            : "Tip: click the map to drop a pin"}
        </Typography>
      </Stack>

      <MapView center={center} zoom={hasValue ? 15 : 12} height={height}>
        <MapReady onReady={setMap} />
        <ClickLayer value={value} onChange={onChange} />
      </MapView>

      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Stack>
  );
};

export default LocationPicker;
