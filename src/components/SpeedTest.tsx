import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ConnectionGraph } from './ConnectionGraph';
import { NetworkStats } from './NetworkStats';

export const SpeedTestDashboard: React.FC = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        // Fake test values (replace with real API or calculation)
        setDownloadSpeed((Math.random() * 100).toFixed(2) as unknown as number);
        setUploadSpeed((Math.random() * 50).toFixed(2) as unknown as number);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-3 text-lg font-bold"
        >
          {isRunning ? 'Stop Test' : 'Start Test'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConnectionGraph
          downloadSpeed={downloadSpeed}
          uploadSpeed={uploadSpeed}
          isRunning={isRunning}
        />
        <NetworkStats />
      </div>
    </div>
  );
};
