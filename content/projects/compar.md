---
title: CompAr
slug: compar
group: Computational and AI systems
order: 1
year: 2026
location: Berlin
type: Design system / research prototype
status: Prototype — phases 1–5 implemented
role: Sole author
team: Solo
tools: Python, FastAPI, Next.js, TypeScript, Claude API, Perplexity, Rhino 8, Grasshopper
employer: None — own project
cover: /images/compar-cover.jpg
tags: AI, Competition, Grasshopper, Spatial strategy, Python
summary: A system for translating architecture competition briefs into structured, validated design strategies.
---

## Thesis

Architecture emerges from relationships, not from form. CompAr is built on that
premise: instead of generating shapes and looking for a justification afterwards,
it makes the relationships in a competition brief explicit — who needs to be near
whom, what is public and what is private, where movement concentrates — and only
then allows geometry to follow.

## The problem

A competition brief, the *Auslobung*, arrives as a hundred pages of prose,
schedules and constraints. Every practice does the same work at the start: read
it, extract the room programme and the areas, guess at what the jury values, and
convert all of that into a design position under time pressure. The reading is
manual, the conversion is undocumented, and by the time a scheme exists nobody
can reconstruct which decision came from the brief and which came from habit.

The failure mode is not a lack of ideas. It is that the strategy behind a scheme
is never written down, so it cannot be checked against the brief later.

## How the system works

CompAr runs the brief through a sequence of phases, each producing a structured
file that the next phase reads. Nothing is inferred twice, and every later
decision can be traced back to the document it came from.

| Phase | What it does | Output |
|---|---|---|
| 01 Brief | Extracts Bauaufgabe, areas, budget, site and uses | `manifest.json` — the single source of truth |
| 02 Jury analysis | Researches jury composition and previously awarded entries | Strategic read on which positions resonate |
| 03A Programme graph | Builds a weighted relationship graph from the room schedule | `program_graph.json` |
| 03B Organisational logic | Proposes a building typology with justification; the architect confirms or corrects | `organizational_logic.json` |
| 03C Spatial DNA | Public-to-private gradient, movement logic, light, material atmosphere | `spatial_dna.json` |
| 03D Concept directions | Six concrete approaches: linear, courtyard, cluster, layered, radial, hybrid | — |
| 04 Concept lock | The architect selects one | `concept_packet.json`, `geometry_seed.json` |
| 05 Geometry | Seed drives Grasshopper; developed geometry is uploaded back and compared against the strategy | — |

Phases 06–08 — variants, comparison and validation — are specified and partially
built.

The **Organisational Logic Library** is the part I consider the actual
contribution. It is a catalogue of twelve spatial strategies — object field,
negotiated territories, cellular field, sectional landscape, courtyard community,
village cluster, spine, gradient field, platform, programmatic stack, landscape
weave, atrium network — each with the programme types it suits and the way it
distributes private, semi-private, shared and public space. It sits between the
programme graph and the geometry, and it is what stops the system from jumping
straight from a spreadsheet to a shape.

## My contribution

Sole author. I defined the phase architecture and the file contract between phases, wrote the
organisational logic library, built the FastAPI backend and the Next.js
dashboard, and implemented the Grasshopper interface through phase 5.

## Deliberate limits

The architect chooses. The system proposes an organisational logic and can
recommend a variant, but confirmation stays with the architect at every phase —
circulation strategy is presented as five options with no recommendation at all,
because that decision is not one a rule or a model should be making.

## What CompAr is not

- Not a generative design tool. It does not produce a scheme from a prompt.
- Not a jury simulator. The jury analysis informs strategy; it does not predict outcomes.
- Not a submission package generator. Board layout, rendering and final
  submission automation are explicitly out of scope.
- Not authoritative on geometry. Rhino remains the geometric source of truth;
  the language models never place a wall.

## Evidence

Tested end to end on *The Walled Garden* — a Berlin-Neukölln site of 2,400 m²,
40 dwellings, GFZ 2.0, maximum six storeys.

The brief is constructed rather than real. No housing competition was open at the
time, and the other categories that were open did not test the parts of the
system that matter — the programme graph and the organisational logic need a
brief with dense, conflicting spatial relationships to be worth anything. A
constructed brief with honest constraints was the better test.
