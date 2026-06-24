// Leaflet ships its marker images as separate files that bundlers can't resolve
// from the CSS automatically, so the default pin renders broken. Import the
// images through Vite (they become URLs) and wire them onto the default icon.
// Importing this module once — anywhere a map is rendered — fixes every marker.
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Sensible default map centre when nothing else is known (Kathmandu, Nepal).
export const DEFAULT_CENTER = [27.7172, 85.324];
export const DEFAULT_ZOOM = 12;

export default L;
