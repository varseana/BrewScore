// ⁘[ MAP VIEW ]⁘
// mapa interactivo con leaflet ~ el corazon de la app

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import type { Establishment } from "@/types";

// ⁘[ CUSTOM MARKER ICON ]⁘

function createMarkerIcon(score: number): L.DivIcon {
  const color = score >= 80 ? "#C8A26B" : score >= 50 ? "#8A8078" : "#4A4440";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${color};border:2px solid rgba(255,255,255,0.2);
      display:flex;align-items:center;justify-content:center;
      font-size:12px;color:#0d0d0d;font-weight:600;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      transition:transform 0.15s ease;
    ">☕</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

// ⁘[ BOUNDS TRACKER ]⁘

function BoundsTracker({ onBoundsChange }: { onBoundsChange: (bounds: string) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      onBoundsChange(`${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}`);
    },
  });
  useEffect(() => {
    const b = map.getBounds();
    onBoundsChange(`${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}`);
  }, [map, onBoundsChange]);
  return null;
}

// ⁘[ RECENTER ]⁘

function RecenterButton({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  return (
    <button
      onClick={() => map.flyTo([lat, lng], 13, { duration: 1 })}
      className="absolute bottom-6 right-6 z-[1000] btn-primary py-2 px-4 text-sm shadow-glass"
      aria-label="Center on my location"
    >
      Near Me
    </button>
  );
}

// ⁘[ CLUSTER LAYER ]⁘

interface ClusterProps {
  establishments: Establishment[];
  onSelect: (est: Establishment) => void;
}

function ClusterLayer({ establishments, onSelect }: ClusterProps) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (clusterRef.current) map.removeLayer(clusterRef.current);

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      // click en cluster → zoom in
      zoomToBoundsOnClick: true,
      iconCreateFunction: (c) => {
        const count = c.getChildCount();
        return L.divIcon({
          html: `<div style="
            width:36px;height:36px;border-radius:50%;
            background:linear-gradient(135deg,#C8A26B,#8B6F47);
            display:flex;align-items:center;justify-content:center;
            color:#0d0d0d;font-weight:700;font-size:13px;
            border:2px solid rgba(255,255,255,0.15);
            box-shadow:0 2px 12px rgba(200,162,107,0.3);
          ">${count}</div>`,
          className: "custom-cluster",
          iconSize: L.point(36, 36),
        });
      },
    });

    establishments.forEach((est) => {
      const marker = L.marker([est.lat, est.lng], {
        icon: createMarkerIcon(est.transparencyScore),
      });

      // click en marker → seleccionar establecimiento (no popup)
      marker.on("click", () => {
        onSelect(est);
        // centrar suavemente
        map.flyTo([est.lat, est.lng], Math.max(map.getZoom(), 14), { duration: 0.5 });
      });

      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    clusterRef.current = cluster;

    return () => {
      if (clusterRef.current) map.removeLayer(clusterRef.current);
    };
  }, [map, establishments, onSelect]);

  return null;
}

// ⁘[ USER LOCATION MARKER ]⁘

function UserLocationMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (markerRef.current) map.removeLayer(markerRef.current);
    const icon = L.divIcon({
      className: "user-location",
      html: `<div style="
        width:16px;height:16px;border-radius:50%;
        background:#4A9EFF;border:3px solid #fff;
        box-shadow:0 0 12px rgba(74,158,255,0.6),0 0 24px rgba(74,158,255,0.3);
        animation:userPulse 2s ease-in-out infinite;
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    markerRef.current = L.marker([lat, lng], { icon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup("You are here", { className: "brewscore-popup", closeButton: false });
    return () => { if (markerRef.current) map.removeLayer(markerRef.current); };
  }, [map, lat, lng]);

  return null;
}

// ⁘[ MAP VIEW PRINCIPAL ]⁘

interface MapViewProps {
  establishments: Establishment[];
  userLat: number | null;
  userLng: number | null;
  onBoundsChange: (bounds: string) => void;
  onSelectEstablishment: (est: Establishment) => void;
}

export function MapView({ establishments, userLat, userLng, onBoundsChange, onSelectEstablishment }: MapViewProps) {
  const center: [number, number] = [userLat ?? 9.9281, userLng ?? -84.0907];

  return (
    <div className="relative w-full h-full">
      <MapContainer center={center} zoom={12} className="w-full h-full z-0" zoomControl={true}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <BoundsTracker onBoundsChange={onBoundsChange} />
        <ClusterLayer establishments={establishments} onSelect={onSelectEstablishment} />
        {userLat && userLng && (
          <>
            <UserLocationMarker lat={userLat} lng={userLng} />
            <RecenterButton lat={userLat} lng={userLng} />
          </>
        )}
      </MapContainer>

      <style>{`
        .brewscore-popup .leaflet-popup-content-wrapper {
          background: rgba(26,26,26,0.95); backdrop-filter: blur(12px);
          border: 1px solid #2E2A26; border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4); padding: 0;
        }
        .brewscore-popup .leaflet-popup-content { margin: 12px 16px; }
        .brewscore-popup .leaflet-popup-tip { background: rgba(26,26,26,0.95); border: 1px solid #2E2A26; }
        .custom-marker, .custom-cluster, .user-location { background: transparent !important; border: none !important; }
        @keyframes userPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(74,158,255,0.6), 0 0 24px rgba(74,158,255,0.3); }
          50% { box-shadow: 0 0 20px rgba(74,158,255,0.8), 0 0 40px rgba(74,158,255,0.4); }
        }
      `}</style>
    </div>
  );
}
