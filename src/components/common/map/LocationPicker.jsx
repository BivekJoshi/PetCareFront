import { useEffect, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ClearIcon from "@mui/icons-material/Clear";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import MapView from "./MapView";
import { DEFAULT_CENTER } from "./leafletSetup";
import { useResolveMapLink } from "../../../hooks/geo/useResolveMapLink";

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
 * Lets a user set a location any of four ways: tap "Use current location",
 * click / drag a pin on the map, type latitude & longitude manually, or paste a
 * Google Maps link (resolved to coordinates by the backend). Reports the chosen
 * point upward via onChange({ latitude, longitude }); null means "not set".
 */
const LocationPicker = ({ value, onChange, height = 300, label }) => {
  const [map, setMap] = useState(null);
  const [locating, setLocating] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState("");

  // Manual lat/lng fields (strings so partial typing isn't clobbered).
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [link, setLink] = useState("");
  const resolveLink = useResolveMapLink();

  const hasValue = value?.latitude != null && value?.longitude != null;
  const center = hasValue ? [value.latitude, value.longitude] : DEFAULT_CENTER;

  // Keep the manual fields in sync whenever the value changes elsewhere.
  useEffect(() => {
    setLatInput(value?.latitude != null ? String(value.latitude) : "");
    setLngInput(value?.longitude != null ? String(value.longitude) : "");
  }, [value]);

  const flyTo = (latitude, longitude) => {
    if (map) map.flyTo([latitude, longitude], 15);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setError("");
    setLocating(true);
    setAccuracy(null);

    // A single getCurrentPosition often returns the coarse network fix that
    // arrives before the GPS lock settles. Watch for a few seconds and keep
    // the most accurate reading; stop early once it's good enough.
    let best = null;
    const GOOD_ENOUGH_M = 25; // metres — accept and stop watching
    const MAX_WATCH_MS = 12000;

    const finish = () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timer);
      setLocating(false);
      if (best) {
        onChange({ latitude: best.latitude, longitude: best.longitude });
        setAccuracy(best.accuracy);
        flyTo(best.latitude, best.longitude);
      } else {
        setError("Could not get your location.");
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (!best || accuracy < best.accuracy) {
          best = { latitude, longitude, accuracy };
        }
        if (best.accuracy <= GOOD_ENOUGH_M) finish();
      },
      (err) => {
        navigator.geolocation.clearWatch(watchId);
        clearTimeout(timer);
        setLocating(false);
        setError(err.message || "Could not get your location.");
      },
      // maximumAge: 0 forces a fresh fix instead of a stale cached one.
      { enableHighAccuracy: true, timeout: MAX_WATCH_MS, maximumAge: 0 }
    );

    const timer = setTimeout(finish, MAX_WATCH_MS);
  };

  // Apply the manually-typed coordinates (called on blur / Enter).
  const commitManual = () => {
    const latitude = Number(latInput);
    const longitude = Number(lngInput);
    if (latInput.trim() === "" && lngInput.trim() === "") {
      onChange(null);
      return;
    }
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError("Enter a valid latitude (-90..90) and longitude (-180..180).");
      return;
    }
    setError("");
    setAccuracy(null);
    onChange({ latitude, longitude });
    flyTo(latitude, longitude);
  };

  const handleResolveLink = () => {
    if (!link.trim()) return;
    setError("");
    resolveLink.mutate(link.trim(), {
      onSuccess: (coords) => {
        setAccuracy(null);
        onChange(coords);
        flyTo(coords.latitude, coords.longitude);
        setLink("");
      },
      onError: (err) =>
        setError(
          err?.response?.data?.message ||
            "Could not read that link. Paste a Google Maps link or enter values manually."
        ),
    });
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
          {accuracy != null
            ? `Accurate to ~${Math.round(accuracy)} m — drag the pin to fine-tune.`
            : hasValue
            ? "Drag the pin to fine-tune."
            : "Tip: click the map to drop a pin."}
        </Typography>
      </Stack>

      {/* Manual entry */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextField
          label="Latitude"
          size="small"
          type="number"
          value={latInput}
          onChange={(e) => setLatInput(e.target.value)}
          onBlur={commitManual}
          onKeyDown={(e) => e.key === "Enter" && commitManual()}
          inputProps={{ step: "any", min: -90, max: 90 }}
          fullWidth
        />
        <TextField
          label="Longitude"
          size="small"
          type="number"
          value={lngInput}
          onChange={(e) => setLngInput(e.target.value)}
          onBlur={commitManual}
          onKeyDown={(e) => e.key === "Enter" && commitManual()}
          inputProps={{ step: "any", min: -180, max: 180 }}
          fullWidth
        />
      </Stack>

      {/* Paste a Google Maps link */}
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextField
          label="Paste a Google Maps link"
          size="small"
          placeholder="https://maps.app.goo.gl/…"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleResolveLink()}
          fullWidth
        />
        <Button
          variant="outlined"
          onClick={handleResolveLink}
          disabled={resolveLink.isLoading || !link.trim()}
          startIcon={
            resolveLink.isLoading ? (
              <CircularProgress size={16} />
            ) : (
              <TravelExploreIcon />
            )
          }
          sx={{ whiteSpace: "nowrap", mt: 0.25 }}
        >
          Extract
        </Button>
      </Stack>

      <Box>
        <MapView center={center} zoom={hasValue ? 15 : 12} height={height}>
          <MapReady onReady={setMap} />
          <ClickLayer value={value} onChange={onChange} />
        </MapView>
      </Box>

      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Stack>
  );
};

export default LocationPicker;
