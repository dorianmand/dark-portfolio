import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SelectedWorks } from '../components/SelectedWorks';
import { Profile } from '../components/Profile';
import { Research } from '../components/Research';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { IntroExperience } from '../intro/IntroExperience';
import { shouldPlayIntro } from '../intro/introSession';
import { useSeo } from '../lib/seo';

export function HomePage() {
  // Decided once on mount so a resize or re-render can never restart the intro.
  const [playIntro] = useState(shouldPlayIntro);
  const [revealed, setRevealed] = useState(!playIntro);

  useSeo({
    title: 'Dorian Mandzukic | Architect · Computational Designer',
    description:
      'Architect with thirteen years of practice across HOAI phases 1–8, building computational and AI systems for competition strategy, parametric design control and building permit documentation. Berlin.',
  });

  return (
    <>
      {playIntro && <IntroExperience onSiteReveal={() => setRevealed(true)} />}

      {/* Navigation stays mounted throughout so it is never removed from the
          accessibility tree; only its paint is held back. */}
      <div
        className={`transition-opacity duration-700 ease-out ${
          revealed ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Navbar />
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Hero deferReveal={!revealed} />
        <SelectedWorks />
        <Profile />
        <Research />
        <Contact />
      </motion.main>

      <Footer />
    </>
  );
}
