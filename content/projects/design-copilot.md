---
title: Design Copilot
slug: design-copilot
group: Computational and AI systems
order: 3
year: 2026
location: Berlin
type: Parametric design system
status: Working prototype in Grasshopper
role: Sole author
team: Solo
tools: Rhino, Grasshopper, Python, Ladybug
employer: None — own project
cover: /images/design-copilot-cover.jpg
tags: Grasshopper, Parametric, Rule-based, Environmental analysis, Python
summary: Parametric building control in Grasshopper with rule-based design critique and environmental analysis.
---

A parametric model that only produces geometry is a drawing machine. Design
Copilot closes the loop: every slider change recomputes the building's key
figures, tests them against defined rules and reports back inside the model —
so the consequence of a decision arrives at the moment the decision is made,
not three weeks later in a consultant's report.

## The problem

Early massing work is where the expensive decisions get made, and it is where
the least information is available. Plot coverage, courtyard proportion, core
count, unit mix, daylight, overshadowing — each is checked separately, by a
different person, at a different time, usually after the massing has already
hardened. By the time the numbers arrive, changing the building is costly.

## How the system works

The system is a continuous feedback loop on the Grasshopper canvas. Any change
to the model re-triggers the whole chain.

```
Sliders → Building Control → JSON data basis → Critique loop → Critique panel → Environmental analysis
```

**01 Parametric building control.** Sliders drive building height, storey count
and storey height, orientation, plot length and width, building depth and roof
offset. Each change recomputes the downstream geometry and data.

**02 Building control and data basis.** Python computes GRZ (*Grundflächenzahl*,
the plot coverage ratio fixed by German zoning), building footprint, courtyard
area, total usable area and façade area. Results are written to `model_v1.json`
with an `exported_at` timestamp that tells downstream components the model has
changed.

**03 Critique loop.** Rule-based checks, not model-based: GRZ limits under
BauNVO, courtyard proportion and dimensioning, fire-safety thresholds for
high-rise, winter solar access. Output is grouped as strengths, risks and
recommendations.

**04 Critique panel.** A panel on the canvas showing the key figures, risks and
recommendations next to the geometry they refer to.

**05 Environmental analysis.** Ladybug combines site and climate data with the
parametric geometry to produce insolation and daylight figures for the massing,
atrium, loggias and façade variants. Results feed back into the critique layer.

**06–10 Building system.** Circulation typology (single-loaded, double-loaded,
gallery access) with core count and position derived from floor area and escape
distances; unit mix against a target distribution; parametric façade with window
ratio, bay grid and material zones; atrium cut for daylight penetration, checked
for height-to-width ratio and smoke extraction; loggias and balconies rated on
their effect on net floor area, overshadowing of lower storeys and the
proportion of dwellings with outdoor space.

The progression the system describes is from mass checker to building system:
each module adds a layer without replacing the one beneath it.

## The system in use

![Grasshopper canvas — building control feeding the critique loop](/images/design-copilot-01.jpg)

![Ladybug branch — sun path and direct sun hours against the parametric massing](/images/design-copilot-02.jpg)

![Rhino viewport — direct sun hours on the generated volume](/images/design-copilot-03.jpg)

![Grasshopper output — collective housing, from organisational profile to parametric geometry](/images/design-copilot-04.jpg)

![Baukörpermodulierungsbibliothek — modular typology system for analysable variants](/images/design-copilot-05.jpg)

![Residential Circulation Library — twelve access typologies with stair and elevator cores](/images/design-copilot-06.jpg)

![Poster 05 — Transformation and Facade Library (Phase 3D)](/images/design-copilot-07.jpg)

## My contribution

Sole author. I built the parametric definition, wrote the Python evaluation and
rule layer, defined the JSON contract between components and integrated Ladybug
into the critique loop.

## Known limitation

The critique panel currently evaluates once on load. Live re-linkage on every
slider change is specified but not yet wired, so a manual re-run is needed after
a parameter change. This is the next piece of work.

## What Design Copilot is not

- Not a code compliance checker. The rules encoded are a working subset, not a
  complete reading of BauNVO or any state building code.
- Not a design generator. It evaluates a massing the architect has controlled;
  it does not propose one.
- Not a certified environmental analysis. Ladybug outputs are directional, for
  comparing variants — not a substitute for a specialist's report.
- Not a product. It runs inside a Grasshopper definition, not as software anyone
  can install.

The valuable part turned out to be the JSON layer, not the geometry. Once the
building's figures existed as data with a change timestamp, adding a new
evaluation — daylight, unit mix, façade — became an additive operation rather
than a rebuild. The intermediate representation is the design decision.
