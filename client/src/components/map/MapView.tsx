// ⁘[ MAP VIEW ]⁘
// mapa interactivo con leaflet ~ el corazon de la app

import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import { HoverCard } from "./HoverCard";
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

interface BoundsTrackerProps {
  onBoundsChange: (bounds: string) => void;
}

function BoundsTracker({ onBoundsChange }: BoundsTrackerProps) {
  const map = useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      onBoundsChange(
        `${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}`
      );
    },
  });

  // disparar bounds iniciales
  useEffect(() => {
    const b = map.getBounds();
    onBoundsChange(
      `${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}`
    );
  }, [map, onBoundsChange]);

  return null;
}

// ⁘[ RECENTER CONTROL ]⁘

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
  userLat: number | null;
  userLng: number | null;
}

function ClusterLayer({ establishments, userLat, userLng }: ClusterProps) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
    }

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
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

      // popup con hover card ~ renderizado como html string por limitacion de leaflet
      const popupContent = document.createElement("div");
      popupContent.innerHTML = `
        <div style="font-family:Inter,sans-serif;color:#E8E0D8;min-width:200px">
          <div style="font-weight:600;font-size:14px;margin-bottom:4px">${est.name}</div>
          <div style="color:#8A8078;font-size:12px;margin-bottom:4px">${est.city}, ${est.country}</div>
          <div style="font-size:12px;margin-bottom:6px">
            ${"★".repeat(Math.round(est.avgRating))}${"☆".repeat(5 - Math.round(est.avgRating))}
            <span style="color:#8A8078;margin-left:4px">${est.avgRating.toFixed(1)}</span>
          </div>
          <div style="display:flex;gap:4px;margin-bottom:8px">
            ${(est.coffeeProgram?.brewingMethods?.slice(0, 2) ?? [])
              .map((m) => `<span style="background:rgba(200,162,107,0.15);color:#E0C99A;padding:2px 8px;border-radius:12px;font-size:10px;border:1px solid rgba(200,162,107,0.3)">${m}</span>`)
              .join("")}
          </div>
          <a href="/establishment/${est.id}" style="color:#C8A26B;font-size:12px;text-decoration:none">View Profile →</a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: "brewscore-popup",
        closeButton: false,
        maxWidth: 260,
      });

      marker.on("mouseover", () => marker.openPopup());

      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    clusterRef.current = cluster;

    return () => {
      if (clusterRef.current) map.removeLayer(clusterRef.current);
    };
  }, [map, establishments, userLat, userLng]);

  return null;
}

// ⁘[ MAP VIEW PRINCIPAL ]⁘

interface MapViewProps {
  establishments: Establishment[];
  userLat: number | null;
  userLng: number | null;
  onBoundsChange: (bounds: string) => void;
}

export function MapView({ establishments, userLat, userLng, onBoundsChange }: MapViewProps) {
  const center: [number, number] = [userLat ?? 9.9281, userLng ?? -84.0907];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-full z-0"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <BoundsTracker onBoundsChange={onBoundsChange} />
        <ClusterLayer
          establishments={establishments}
          userLat={userLat}
          userLng={userLng}
        />
        {userLat && userLng && <RecenterButton lat={userLat} lng={userLng} />}
      </MapContainer>

      {/* popup styles override */}
      <style>{`
        .brewscore-popup .leaflet-popup-content-wrapper {
          background: rgba(26,26,26,0.95);
          backdrop-filter: blur(12px);
          border: 1px solid #2E2A26;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          padding: 0;
        }
        .brewscore-popup .leaflet-popup-content {
          margin: 12px 16px;
        }
        .brewscore-popup .leaflet-popup-tip {
          background: rgba(26,26,26,0.95);
          border: 1px solid #2E2A26;
        }
        .custom-marker, .custom-cluster {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
