// ⁘[ GEOLOCATION HOOK ]⁘

import { useState, useEffect, useCallback } from "react";

interface GeoState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    lat: null, lng: null, error: null, loading: true,
  });

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ lat: null, lng: null, error: "Geolocation not supported", loading: false });
      return;
    }

    setState((s) => ({ ...s, loading: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        // fallback a san jose, costa rica
        setState({
          lat: 9.9281,
          lng: -84.0907,
          error: err.message,
          loading: false,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => { locate(); }, [locate]);

  return { ...state, locate };
}
