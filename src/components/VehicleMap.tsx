import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

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
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [needsToken, setNeedsToken] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [151.2093, -33.8688],
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;

      // Add route line
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        },
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'hsl(189, 94%, 55%)',
          'line-width': 3,
          'line-opacity': 0.3,
        },
      });

      // Add trail
      map.current.addSource('trail', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      });

      map.current.addLayer({
        id: 'trail',
        type: 'line',
        source: 'trail',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'hsl(189, 94%, 55%)',
          'line-width': 4,
          'line-opacity': 0.8,
        },
      });
    });

    return () => {
      markerRef.current?.remove();
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update trail
  useEffect(() => {
    if (!map.current || !trail.length) return;

    const source = map.current.getSource('trail') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: trail,
        },
      });
    }
  }, [trail]);

  // Update vehicle marker
  useEffect(() => {
    if (!map.current || !currentPosition) return;

    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.background = 'hsl(189, 94%, 55%)';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid hsl(220, 26%, 6%)';
      el.style.boxShadow = '0 0 20px hsl(189, 94%, 55%)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.innerHTML = '🚗';

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat([currentPosition.lng, currentPosition.lat])
        .addTo(map.current);
    } else {
      markerRef.current.setLngLat([currentPosition.lng, currentPosition.lat]);
    }

    map.current.easeTo({
      center: [currentPosition.lng, currentPosition.lat],
      duration: 1000,
    });
  }, [currentPosition]);

  if (needsToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card rounded-lg border border-border">
        <div className="max-w-md p-8 space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground">
            Get your free token at{' '}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <input
            type="text"
            placeholder="Enter Mapbox token"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <button
            onClick={() => {
              if (mapboxToken) setNeedsToken(false);
            }}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Start Tracking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
  );
};

export default VehicleMap;
