import { Clock, MapPin, TrendingUp } from 'lucide-react';

interface TripStatsProps {
  distance: number;
  avgSpeed: number;
  maxSpeed: number;
  duration: number;
}

const TripStats = ({ distance, avgSpeed, maxSpeed, duration }: TripStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground">Distance</p>
        </div>
        <p className="text-2xl font-bold text-foreground">{distance.toFixed(1)} km</p>
      </div>

      <div className="p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground">Duration</p>
        </div>
        <p className="text-2xl font-bold text-foreground">{Math.floor(duration / 60)}m {duration % 60}s</p>
      </div>

      <div className="p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground">Avg Speed</p>
        </div>
        <p className="text-2xl font-bold text-foreground">{avgSpeed.toFixed(0)} km/h</p>
      </div>

      <div className="p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-[hsl(var(--speed-high))]" />
          <p className="text-xs text-muted-foreground">Max Speed</p>
        </div>
        <p className="text-2xl font-bold text-foreground">{maxSpeed.toFixed(0)} km/h</p>
      </div>
    </div>
  );
};

export default TripStats;
