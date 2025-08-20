import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface ConnectionGraphProps {
  downloadSpeed: number;
  uploadSpeed: number;
  isRunning: boolean;
}

export const ConnectionGraph: React.FC<ConnectionGraphProps> = ({
  downloadSpeed,
  uploadSpeed,
  isRunning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!chartRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Download (Mbps)',
              borderColor: '#00ffff',
              backgroundColor: 'rgba(0, 255, 255, 0.2)',
              data: [],
            },
            {
              label: 'Upload (Mbps)',
              borderColor: '#ff00ff',
              backgroundColor: 'rgba(255, 0, 255, 0.2)',
              data: [],
            },
          ],
        },
        options: {
          animation: false,
          responsive: true,
          scales: {
            x: { display: false },
            y: { beginAtZero: true },
          },
        },
      });
    }

    if (isRunning && chartRef.current) {
      const chart = chartRef.current;
      chart.data.labels?.push('');
      (chart.data.datasets[0].data as number[]).push(downloadSpeed);
      (chart.data.datasets[1].data as number[]).push(uploadSpeed);

      if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        (chart.data.datasets[0].data as number[]).shift();
        (chart.data.datasets[1].data as number[]).shift();
      }

      chart.update();
    }
  }, [downloadSpeed, uploadSpeed, isRunning]);

  return (
    <div className="bg-black/30 p-4 rounded-xl border border-neon-pink/50">
      <h2 className="text-lg font-semibold text-neon-pink mb-2">Live Speed Graph</h2>
      <canvas ref={canvasRef} />
    </div>
  );
};
