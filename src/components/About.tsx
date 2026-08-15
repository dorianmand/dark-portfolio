const principles = [
  {
    title: 'Architectural judgment comes first',
    body: 'A tool that produces an answer nobody can justify has produced nothing. Every system here ends with a decision a person has to be willing to defend.',
  },
  {
    title: 'Structure before generation',
    body: 'Most bad output is a structuring failure, not a model failure. Get the relationships, constraints and boundaries explicit, and generation becomes the easy part.',
  },
  {
    title: 'Control is part of creativity',
    body: 'Constraints are not the opposite of design freedom. Knowing exactly which rules a proposal breaks is what makes it possible to break one deliberately.',
  },
  {
    title: 'Tools should belong to the real workflow',
    body: 'Something that only works in a demo has not been built yet. These began as problems on live projects — a competition brief, a massing study, a permit application.',
  },
];

export function About() {
  return (
    <section id="about" className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <p className="mb-12 text-xs uppercase tracking-[0.3em] text-muted">
          About
        </p>

        <div className="border-t border-stroke/20 pt-10">
          <p className="mb-16 max-w-2xl text-lg leading-relaxed text-text-primary md:text-2xl">
            AI should support professional responsibility, not replace it. Clarity
            is a design quality, and a tool that obscures authorship has taken
            something away rather than added it.
          </p>

          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {principles.map((principle) => (
              <div key={principle.title}>
                <h3 className="mb-3 text-lg tracking-tight md:text-xl">
                  {principle.title}
                </h3>
                <p className="max-w-md text-base leading-relaxed text-muted">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
