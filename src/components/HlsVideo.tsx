import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

type HlsVideoProps = { src: string; className?: string; flipped?: boolean };

export function HlsVideo({ src, className = '', flipped = false }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: Hls | null = null;
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }
    return () => hls?.destroy();
  }, [src]);

  return <video ref={videoRef} autoPlay muted loop playsInline className={`${className} ${flipped ? 'scale-y-[-1]' : ''}`} />;
}
