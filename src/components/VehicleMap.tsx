import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface VehiclePosition {
  lat: number;
  lng: number;
  speed: number;
  timestamp: number;
}

interface VehicleMapProps {
  currentPosition: VehiclePosition | null;
  route: [number, number][];
  trail: [number, number][];
}

const VehicleMap = ({ currentPosition, route, trail }: VehicleMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const trailLayerRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([-33.8688, 151.2093], 13);

    // Add dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map.current);

    // Add route line
    if (route.length > 0) {
      const routeLatLngs = route.map(([lng, lat]) => [lat, lng] as [number, number]);
      routeLayerRef.current = L.polyline(routeLatLngs, {
        color: 'hsl(189, 94%, 55%)',
        weight: 3,
        opacity: 0.3,
      }).addTo(map.current);
    }

    // Add trail line
    trailLayerRef.current = L.polyline([], {
      color: 'hsl(189, 94%, 55%)',
      weight: 4,
      opacity: 0.8,
    }).addTo(map.current);

    // Create custom vehicle icon
    const vehicleIcon = L.divIcon({
      className: 'vehicle-marker',
      html: '<div style="width: 32px; height: 32px; background: hsl(189, 94%, 55%); border-radius: 50%; border: 3px solid hsl(220, 26%, 6%); box-shadow: 0 0 20px hsl(189, 94%, 55%); display: flex; align-items: center; justify-content: center; font-size: 16px;">🚗</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Add vehicle marker
    if (currentPosition) {
      markerRef.current = L.marker([currentPosition.lat, currentPosition.lng], {
        icon: vehicleIcon,
      }).addTo(map.current);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update trail
  useEffect(() => {
    if (!trailLayerRef.current || !trail.length) return;

    const trailLatLngs = trail.map(([lng, lat]) => [lat, lng] as [number, number]);
    trailLayerRef.current.setLatLngs(trailLatLngs);
  }, [trail]);

  // Update vehicle marker position
  useEffect(() => {
    if (!map.current || !currentPosition) return;

    const vehicleIcon = L.divIcon({
      className: 'vehicle-marker',
      html: '<div style="width: 32px; height: 32px; background: hsl(189, 94%, 55%); border-radius: 50%; border: 3px solid hsl(220, 26%, 6%); box-shadow: 0 0 20px hsl(189, 94%, 55%); display: flex; align-items: center; justify-content: center; font-size: 16px;">🚗</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (!markerRef.current) {
      markerRef.current = L.marker([currentPosition.lat, currentPosition.lng], {
        icon: vehicleIcon,
      }).addTo(map.current);
    } else {
      markerRef.current.setLatLng([currentPosition.lat, currentPosition.lng]);
    }

    // Smoothly pan to current position
    map.current.panTo([currentPosition.lat, currentPosition.lng], {
      animate: true,
      duration: 1,
    });
  }, [currentPosition]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />;
};

export default VehicleMap;
