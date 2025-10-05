import { useState, useEffect } from 'react';
import VehicleMap from '@/components/VehicleMap';
import SpeedDisplay from '@/components/SpeedDisplay';
import TripStats from '@/components/TripStats';
import PlaybackControls from '@/components/PlaybackControls';
import SpeedChart from '@/components/SpeedChart';
import { Car } from 'lucide-react';

interface DataPoint {
  timestamp: number;
  latitude: number;
  longitude: number;
  speed: number;
}

const Index = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [trail, setTrail] = useState<[number, number][]>([]);

  useEffect(() => {
    fetch('/vehicle-data.csv')
      .then((response) => response.text())
      .then((text) => {
        const lines = text.trim().split('\n');
        const parsed = lines.slice(1).map((line) => {
          const [timestamp, latitude, longitude, speed] = line.split(',');
          return {
            timestamp: Number(timestamp),
            latitude: Number(latitude),
            longitude: Number(longitude),
            speed: Number(speed),
          };
        });
        setData(parsed);
      });
  }, []);

  useEffect(() => {
    if (!isPlaying || !data.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= data.length) {
          setIsPlaying(false);
          return prev;
        }

        const point = data[next];
        setTrail((prevTrail) => [...prevTrail, [point.longitude, point.latitude]]);
        return next;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, data, playbackSpeed]);

  const currentPosition = data[currentIndex]
    ? {
        lat: data[currentIndex].latitude,
        lng: data[currentIndex].longitude,
        speed: data[currentIndex].speed,
        timestamp: data[currentIndex].timestamp,
      }
    : null;

  const route: [number, number][] = data.map((d) => [d.longitude, d.latitude]);

  const calculateDistance = () => {
    let total = 0;
    for (let i = 1; i < currentIndex; i++) {
      const lat1 = data[i - 1].latitude;
      const lon1 = data[i - 1].longitude;
      const lat2 = data[i].latitude;
      const lon2 = data[i].longitude;
      total += Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111;
    }
    return total;
  };

  const avgSpeed =
    currentIndex > 0
      ? data.slice(0, currentIndex + 1).reduce((sum, d) => sum + d.speed, 0) / (currentIndex + 1)
      : 0;

  const maxSpeed = currentIndex > 0 ? Math.max(...data.slice(0, currentIndex + 1).map((d) => d.speed)) : 0;

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setTrail([]);
  };

  const handleProgressChange = (progress: number) => {
    const newIndex = Math.floor((progress / 100) * (data.length - 1));
    setCurrentIndex(newIndex);
    setTrail(data.slice(0, newIndex + 1).map((d) => [d.longitude, d.latitude]));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <Car className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vehicle Tracker</h1>
            <p className="text-muted-foreground">Real-time tracking and analytics</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[500px] rounded-xl overflow-hidden border border-border shadow-lg">
              <VehicleMap currentPosition={currentPosition} route={route} trail={trail} />
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <PlaybackControls
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onReset={handleReset}
                onSpeedChange={setPlaybackSpeed}
                playbackSpeed={playbackSpeed}
                progress={(currentIndex / (data.length - 1)) * 100}
                onProgressChange={handleProgressChange}
              />
            </div>
          </div>

          <div className="space-y-6">
            <SpeedDisplay speed={currentPosition?.speed || 0} />
            
            <TripStats
              distance={calculateDistance()}
              avgSpeed={avgSpeed}
              maxSpeed={maxSpeed}
              duration={currentIndex * 5}
            />

            <SpeedChart
              data={data.map((d) => ({ timestamp: d.timestamp, speed: d.speed }))}
              currentTime={currentPosition?.timestamp || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
