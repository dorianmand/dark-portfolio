const fields = [
  {
    title: 'Architecture',
    body: 'HOAI phases 1–6. Project leadership, permit and construction documentation, consultant coordination.',
  },
  {
    title: 'Computational design',
    body: 'Rhino and Grasshopper. Parametric control, rule-based evaluation, geometry treated as data.',
  },
  {
    title: 'Applied AI',
    body: 'Agent workflows, structured document processing, and decision support that stays accountable to the architect.',
  },
];

export function Profile() {
  return (
    <section id="profile" className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <p className="mb-12 text-xs uppercase tracking-[0.3em] text-muted">
          Fields of work
        </p>

        <div className="grid gap-10 border-t border-stroke/20 pt-10 md:grid-cols-3 md:gap-12">
          {fields.map((field) => (
            <div key={field.title}>
              <h3 className="mb-3 text-xl tracking-tight md:text-2xl">
                {field.title}
              </h3>

              <p className="text-base leading-relaxed text-muted">
                {field.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-2xl border-t border-stroke/20 pt-10">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">
            Profile
          </p>

          <div className="space-y-5 text-base leading-relaxed text-muted md:text-lg">
            <p>
              I trained in Zagreb and have practised in Berlin and Munich since
              2013 — at OOW, June14 Meyer-Grohbrügge &amp; Chermayeff, Lena
              Wimmer Architects, Aukett + Heese, Graft, and most recently Wiel
              Arets Architects, where I led the German office and delivered a
              4,660 m² special education centre through planning permission.
            </p>

            <p>
              That work is where the software comes from. Every tool here began
              as something I needed on a project and could not buy: a way to hold
              a competition strategy together, a way to test a massing against
              its own rules, a way to fill a Bauantrag without transcribing the
              same data eleven times.
            </p>

            <p>
              Member of the Architektenkammer Berlin since 2025.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
