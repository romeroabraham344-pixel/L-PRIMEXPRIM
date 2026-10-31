import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface IntroVideoProps {
  onComplete: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt to play with sound directly as requested
    if (videoRef.current) {
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts autoplay before user interaction,
          // a tap anywhere starts playback with sound
          const handleFirstClick = () => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.play();
            }
            window.removeEventListener('click', handleFirstClick);
            window.removeEventListener('touchstart', handleFirstClick);
          };
          window.addEventListener('click', handleFirstClick, { once: true });
          window.addEventListener('touchstart', handleFirstClick, { once: true });
        });
      }
    }
  }, []);

  return (
    <div
      onClick={() => {
        // Ensure video is playing with sound if paused
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.muted = false;
          videoRef.current.play();
        }
      }}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Header bar: only shows branding and Skip button, no volume buttons */}
      <div className="relative z-10 w-full p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">
          L-PRIMEXPRIM
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 hover:text-white text-xs font-medium backdrop-blur-md transition-all active:scale-95"
        >
          <span>Saltar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main video area: 100% full view with sound enabled */}
      <div className="flex-1 w-full h-full flex items-center justify-center p-2 relative">
        <video
          ref={videoRef}
          src="/assets/aistudio/l-primexprim-conejo_d966e265.mp4"
          autoPlay
          playsInline
          muted={false}
          onEnded={onComplete}
          className="w-full h-full max-h-[85vh] object-contain drop-shadow-2xl"
        />
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 w-full p-4 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-100 text-xs font-semibold backdrop-blur-md transition-all shadow-lg active:scale-95"
        >
          <span>Continuar al Login</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
