import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SelectedWorks } from '../components/SelectedWorks';
import { News } from '../components/News';
import { Profile } from '../components/Profile';
import { About } from '../components/About';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <>
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Hero />
        <SelectedWorks />
        <Profile />
        <About />
        <News />
        <Footer />
      </motion.main>
    </>
  );
}
