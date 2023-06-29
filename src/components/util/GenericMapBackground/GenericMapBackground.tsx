import { MapContainer, TileLayer } from "react-leaflet";

const GenericMapBackground = () => {
  return (
    <MapContainer
      center={[-14.235004, -51.925282]}
      zoom={8}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default GenericMapBackground;
