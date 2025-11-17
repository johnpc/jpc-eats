import { useState, useEffect } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Coordinates } from "../lib/types";

const DEFAULT_COORDS: Coordinates = {
  latitude: 42.280827,
  longitude: -83.743034,
};

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<Coordinates>(() => {
    const stored = localStorage.getItem("coordinates");
    return stored ? JSON.parse(stored) : DEFAULT_COORDS;
  });

  useEffect(() => {
    Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      maximumAge: 300000,
      timeout: 5000,
    })
      .then((position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoordinates(coords);
        localStorage.setItem("coordinates", JSON.stringify(coords));
      })
      .catch(() => {
        setCoordinates(DEFAULT_COORDS);
        localStorage.setItem("coordinates", JSON.stringify(DEFAULT_COORDS));
      });
  }, []);

  return coordinates;
}
