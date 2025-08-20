import React, { useEffect, useState } from 'react';
import { getNetworkInfo } from '@/utils/NetworkInfo';

export const NetworkStats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setStats(getNetworkInfo());

    if (navigator.connection) {
      navigator.connection.addEventListener('change', () => {
        setStats(getNetworkInfo());
      });
    }
  }, []);

  if (!stats) return null;

  return (
    <div className="bg-black/30 p-4 rounded-xl border border-neon-cyan/50 text-sm">
      <h2 className="text-lg font-semibold text-neon-cyan mb-2">Network Info</h2>
      <ul className="space-y-1">
        <li>Downlink: {stats.downlink ? `${stats.downlink} Mbps` : 'N/A'}</li>
        <li>Effective Type: {stats.effectiveType}</li>
        <li>RTT: {stats.rtt ? `${stats.rtt} ms` : 'N/A'}</li>
      </ul>
    </div>
  );
};
