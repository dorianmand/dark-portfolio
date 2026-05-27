import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SelectedWorks } from './components/SelectedWorks';
import { Journal } from './components/Journal';
import { Explorations } from './components/Explorations';
import { Stats } from './components/Stats';
import { Footer } from './components/Footer';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const complete = useCallback(() => setIsLoading(false), []);
  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen onComplete={complete} />}</AnimatePresence>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
          <Hero />
          <SelectedWorks />
          <Journal />
          <Explorations />
          <Stats />
          <Footer />
        </motion.main>
      </AnimatePresence>
    </>
  );
}
