import { MapContainer, TileLayer } from "react-leaflet";
import { Box } from "@mui/material";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "./leafletSetup";

/**
 * Thin wrapper around a Leaflet map with the OpenStreetMap tile layer and our
 * default centre/zoom. Pass markers (and any other react-leaflet children)
 * inside. `height` controls the rendered box; the map fills it.
 */
const MapView = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  height = 360,
  children,
  whenCreated,
  sx,
}) => (
  <Box
    sx={{
      height,
      width: "100%",
      borderRadius: 3,
      overflow: "hidden",
      border: "1px solid",
      borderColor: "divider",
      "& .leaflet-container": { height: "100%", width: "100%" },
      ...sx,
    }}
  >
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      whenCreated={whenCreated}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  </Box>
);

export default MapView;
