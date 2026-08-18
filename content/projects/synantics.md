---
title: Synantics
slug: synantics
group: Computational and AI systems
order: 4
year: 2026
location: Berlin
type: Web application
status: Graduation project — six stages implemented
role: Sole author
team: Solo
tools: Node.js, Express, PostgreSQL, Zod, vanilla JavaScript, Three.js
employer: None — own project
cover: /images/synantics-poster.webp
poster: /images/synantics-poster.webp
featured: true
demoUrl: https://synantics.layeroff.ai
demoNote: The live build sleeps when idle, so the first load takes about a minute. The walkthrough and stage captures below need no server.
tags: AI, Naming, Web app, Process design
summary: Synantics is live. [Try it](https://synantics.layeroff.ai), a structured AI naming workflow that turns scattered thoughts into a clear naming direction. For the best results, add your own answers along the way. The more personal the input, the better the outcome.
---

The tool named itself. *Synantics* is a compound of synthesised semantics, and it
came out of the system's own six stages — which is the shortest available proof
that the process works.

A name is the output of a decision sequence, not of a prompt. Synantics makes
that sequence explicit: six stages, each one approved by the user before the next
begins, so that by the time names are generated the meaning, the boundaries and
the evaluation criteria already exist.

Synantics is live. For the best results, add your own answers along the way. The
more personal the input, the better the outcome.

[Try it →](https://synantics.layeroff.ai/)

Note: Please allow a couple of seconds for Render to load.

## The problem

It began as *Brandon*, a custom GPT for brand naming, and I found the experience
neither creative nor enjoyable. The questions blurred into one long prompt, there was no
sense of progression and it was impossible to see how an insight became a
territory and then a name.

Commercial AI namers have the same shape: type keywords, receive a list. The
brief — audience, category, tone, direction, avoid-lists — is what actually
determines name quality, and nobody enjoys filling in a twelve-field form to
produce one.

## How the system works

Six connected stages. Each combines fixed structure with custom input, and at
every step the system proposes an interpretation that the user can revise,
reject or approve before moving on.

| Stage | What happens |
|---|---|
| **Frame** | Defines what is being named, who needs it, the before-to-after change and the plausible-but-wrong assumptions to exclude. Produces a strategic foundation — no names, no metaphors. |
| **Distill** | Reduces the material to what the name must carry: what is felt immediately, what is discovered later, what tension shapes it, what must never lead. Produces a strategic core and an avoid list. |
| **Disrupt** | Deliberately pushes past obvious category language — movement, behaviour, environments, unexpected associations and ideas that are attractive but strategically wrong. |
| **Connect** | Links approved fragments into recurring patterns and distinct constellations. Still not names — a structured strategic field. |
| **Crystallize** | Turns patterns into a naming brief: leading territory, supporting territory, strategic role, emotional quality, vocabulary families, boundaries. |
| **Express** | Generates candidates with rationale and sound logic, then reviews and scores them against the approved criteria. |

The rule underneath all six is that the raw input is never overwritten. AI
normalisation is stored alongside the user's own words, and later stages consume
only values the user has approved — never an unapproved summary.


## Architecture

A full-stack web application. A vanilla JavaScript frontend carries the
interactive experience — answers appear as selectable bubbles that assemble into
clusters. A Node and Express backend holds sessions, territories, candidates,
shortlists and generation batches in PostgreSQL, with Zod validating the
structured output the model returns. The LLM key stays server-side; the browser
never talks to the provider directly. Tests mock the model client entirely, so
the suite runs without network access.

The final score is calculated deterministically from the approved criteria. The
model proposes; the arithmetic is not the model's.

## Tested against three deliberately different briefs

- **Repair Club** — a neighbourhood repair club and tool library, driven entirely
  by custom input, testing whether everyday language can become a distinctive
  naming direction. Taboo words included *repair, fix, tool, eco, community, hub*.
- **Architecture AI Assistant** — a workflow companion for architecture studios,
  which had to feel credible and architectural without sounding like software.
  Taboo words included *AI, automation, agent, workflow, BIM, smart, architect*.
- **Botanical Evening Aperitif** — a non-alcoholic aperitif that had to lead with
  desire and atmosphere rather than absence. Taboo words included *sober, zero,
  clean, detox, wellness, alcohol-free*.

Each case sets a naming character, an approach, a must-avoid list and a single
success test — the question the result has to answer.

## The six stages

![Frame — what are we naming; answers chosen as bubbles, custom input on every card](/images/synantics-01.jpg)

![Distill — the frame assembled back for approval before anything proceeds](/images/synantics-02.jpg)

![Disrupt — the field opened past obvious category language, rejections marked in red](/images/synantics-03.jpg)

![Connect — fragments dragged into constellations; a theme can be made the heart](/images/synantics-04.jpg)

![Crystallize — the territory and what it suggests](/images/synantics-05.jpg)

![Review — thirty elements assembled into a brief before any name exists](/images/synantics-06.jpg)

![Express — first pass, instinct only; reasons and logic come later](/images/synantics-07.jpg)

![Express — generation controls: construction, semantics, batch size](/images/synantics-08.jpg)

![Review and export — the naming brief with directional screening only](/images/synantics-09.jpg)

## My contribution

Sole author. I designed the six-stage model, wrote the stage specifications and
the system prompt, built the Express backend and the PostgreSQL schema and
implemented the frontend interaction.

## What Synantics is not

- Not a name generator. Generation is the last stage, not the product.
- Not a legal or domain clearance service. Availability and conflict notes are
  directional only, and the interface says so — formal trademark and domain
  review remains a separate professional step.
- Not autonomous. No stage advances on the model's own judgement; every one
  passes through an explicit user approval.
- Not account-based. The live deployment runs sessions without sign-in or saved user accounts.

The interesting problem was not generation quality — it was traceability. Once
each stage stored the user's raw answer, the model's interpretation and the
approved value as three separate things, it became possible to look at a final
name and walk backwards to the decision that produced it. That audit trail is
the same requirement I keep meeting in architectural work, where a result nobody
can justify is a result nobody can defend.
