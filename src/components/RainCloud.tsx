import React from 'react';
import { CloudRain, CloudLightning } from 'lucide-react';

interface RainCloudProps {
  size?: 'sm' | 'md' | 'lg';
  withLightning?: boolean;
}

export const RainCloud: React.FC<RainCloudProps> = ({ size = 'sm', withLightning = true }) => {
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7';

  return (
    <div className="relative inline-flex items-center justify-center group" title="Nube de tormenta">
      {withLightning ? (
        <CloudLightning className={`${iconSize} text-cyan-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)] transition-transform group-hover:scale-110`} />
      ) : (
        <CloudRain className={`${iconSize} text-cyan-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.4)] transition-transform group-hover:scale-110`} />
      )}
    </div>
  );
};
