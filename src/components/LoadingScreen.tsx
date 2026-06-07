import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const words = ['Better', 'workflows', 'with AI'];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);
  const completed = useRef(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const next = Math.min(100, Math.floor(((now - start) / 2700) * 100));
      setCount(next);
      if (next < 100) raf = requestAnimationFrame(tick);
      else if (!completed.current) {
        completed.current = true;
        setTimeout(onComplete, 400);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  useEffect(() => {
    const id = setInterval(() => setWord((i) => (i + 1) % words.length), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-bg">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute left-6 top-6 text-xs uppercase tracking-[0.3em] text-muted">...</motion.div>
      <div className="absolute inset-0 grid place-items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={words[word]} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.45 }} className="font-display text-4xl italic text-text-primary/80 md:text-6xl lg:text-7xl">{words[word]}</motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-8 right-6 font-display text-6xl tabular-nums text-text-primary md:text-8xl lg:text-9xl">{String(count).padStart(3, '0')}</div>
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-stroke/50">
        <div className="accent-gradient h-full origin-left" style={{ transform: `scaleX(${count / 100})`, boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)' }} />
      </div>
    </motion.div>
  );
}
