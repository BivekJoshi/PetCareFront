import { useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { Box, Chip, Link, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import MapView from "./MapView";
import L, { DEFAULT_CENTER, vetsWithLocation } from "./leafletSetup";
import { fullName } from "../../../utility/format";

// Pans/zooms the map so every plotted vet fits in view.
const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      map.fitBounds(L.latLngBounds(points).pad(0.2));
    }
  }, [map, points]);
  return null;
};

/**
 * Renders every located vet as a pin with a contact popup (name, specialization,
 * phone, address). Used on both the owner and admin "find a vet" map.
 */
const VetsMap = ({ vets = [], height = 420, onSelect }) => {
  const located = vetsWithLocation(vets);
  const points = located.map((v) => [v.latitude, v.longitude]);
  const center = points[0] ?? DEFAULT_CENTER;

  return (
    <MapView center={center} height={height}>
      <FitBounds points={points} />
      {located.map((v) => (
        <Marker
          key={v.id}
          position={[v.latitude, v.longitude]}
          eventHandlers={onSelect ? { click: () => onSelect(v) } : undefined}
        >
          <Popup>
            <Box sx={{ minWidth: 180 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {fullName(v.user)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {v.specialization || "General Practice"}
              </Typography>
              <Stack spacing={0.5} sx={{ mt: 1 }}>
                {v.user?.phone && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PhoneIcon sx={{ fontSize: 16 }} color="action" />
                    <Link href={`tel:${v.user.phone}`} variant="body2">
                      {v.user.phone}
                    </Link>
                  </Stack>
                )}
                {v.address && (
                  <Stack direction="row" spacing={0.5} alignItems="flex-start">
                    <PlaceIcon sx={{ fontSize: 16, mt: "2px" }} color="action" />
                    <Typography variant="body2">{v.address}</Typography>
                  </Stack>
                )}
                <Chip
                  size="small"
                  label={v.isAvailable ? "Available" : "Unavailable"}
                  color={v.isAvailable ? "success" : "default"}
                  sx={{ alignSelf: "flex-start", mt: 0.5 }}
                />
              </Stack>
            </Box>
          </Popup>
        </Marker>
      ))}
    </MapView>
  );
};

export default VetsMap;
