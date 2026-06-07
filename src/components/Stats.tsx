import { motion } from 'framer-motion';

const stats = [
  ['Architecture', 'Spatial thinking'],
  ['Technology', 'Digital systems'],
  ['Sustainability', 'Responsible workflows'],
];

export function Stats() {
  return (
    <section id="stats" className="bg-white py-16 md:py-24">
  <div className="mx-auto max-w-[1200px] px-6 text-center md:px-10 lg:px-16">
    <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">
  ABOUT
</p>
    <div className="font-display text-4xl italic text-black md:text-6xl">
      
    </div>
  <div className="mx-auto mt-8 max-w-2xl space-y-5 text-sm leading-relaxed text-muted md:text-base">
  <p>
    Layer_off helps architecture offices move from AI curiosity to controlled, useful workflows.
  </p>

  <p>
    We work with practices that are cautious, curious or unsure where to begin — helping them test tools, identify realistic use cases and integrate AI without losing authorship, design intent or professional responsibility.
  </p>

  <p>
    Not hype. Not generic automation. Architecture-specific workflows that make invisible systems clearer, support better decisions and help teams work with more focus and control.
  </p>
</div>
  </div>
</section>
  );
}
