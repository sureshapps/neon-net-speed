// components/SpeedTestDashboard.tsx
import React, { useState, useEffect } from 'react';
import { NetworkStats } from './NetworkStats';
import { ConnectionGraph } from './ConnectionGraph';
import { Button } from '@/components/ui/button';

// Utility to fetch ISP, IP, Location & Connection type
const useNetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState({
    ip: '',
    isp: '',
    city: '',
    country: '',
    connection: ''
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();

        const conn =
          (navigator as any).connection?.effectiveType ||
          (navigator as any).connection?.type ||
          'Unknown';

        setNetworkInfo({
          ip: data.ip || '—',
          isp: data.org || '—',
          city: data.city || '—',
          country: data.country_name || '—',
          connection: conn
        });
      } catch (err) {
        console.error('Failed to fetch network info', err);
      }
    };

    fetchInfo();
  }, []);

  return networkInfo;
};

export const SpeedTestDashboard: React.FC = () => {
  // Speed test values
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Network info
  const { ip, isp, city, country, connection } = useNetworkInfo();

  const toggleTest = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }

    setIsRunning(true);

    // Example: simulate values (replace with real test later)
    const interval = setInterval(() => {
      setPing(Math.random() * 80);
      setJitter(Math.random() * 15);
      setDownloadSpeed(Math.random() * 300);
      setUploadSpeed(Math.random() * 100);
    }, 800);

    // Stop after 20s
    setTimeout(() => {
      clearInterval(interval);
      setIsRunning(false);
    }, 20000);
  };

  return (
    <div className="space-y-6">
      {/* Start/Stop Button */}
      <div className="flex justify-center">
        <Button
          onClick={toggleTest}
          variant={isRunning ? 'destructive' : 'neon'}
        >
          {isRunning ? 'Stop Test' : 'Start Test'}
        </Button>
      </div>

      {/* Stats Panel */}
      <NetworkStats
        ping={ping}
        jitter={jitter}
        downloadSpeed={downloadSpeed}
        uploadSpeed={uploadSpeed}
        isp={isp}
        ip={ip}
        city={city}
        country={country}
        connection={connection}
      />

      {/* Live Graph */}
      <ConnectionGraph
        downloadSpeed={downloadSpeed}
        uploadSpeed={uploadSpeed}
        isRunning={isRunning}
      />
    </div>
  );
};
