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
cover: /images/synantics-cover.jpg
demoUrl: 
demoNote: The live build sleeps when idle, so the first load takes about a minute. The walkthrough and stage captures below need no server.
tags: AI, Naming, Web app, Process design
summary: A structured naming studio that turns brand naming into a traceable process rather than a single prompt.
---

## Thesis

The tool named itself. *Synantics* is a compound of synthesised semantics, and it
came out of the system's own six stages — which is the shortest available proof
that the process works.

A name is the output of a decision sequence, not of a prompt. Synantics makes
that sequence explicit: six stages, each one approved by the user before the next
begins, so that by the time names are generated the meaning, the boundaries and
the evaluation criteria already exist.

## The problem

It began as *Brandon*, a custom GPT for brand naming, and I found the experience
neither creative nor enjoyable. The questions blurred into one long prompt, there was no
sense of progression, and it was impossible to see how an insight became a
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
| **Frame** | Defines what is being named, who needs it, the before-to-after change, and the plausible-but-wrong assumptions to exclude. Produces a strategic foundation — no names, no metaphors. |
| **Distill** | Reduces the material to what the name must carry: what is felt immediately, what is discovered later, what tension shapes it, what must never lead. Produces a strategic core and an avoid list. |
| **Disrupt** | Deliberately pushes past obvious category language — movement, behaviour, environments, unexpected associations, and ideas that are attractive but strategically wrong. |
| **Connect** | Links approved fragments into recurring patterns and distinct constellations. Still not names — a structured strategic field. |
| **Crystallize** | Turns patterns into a naming brief: leading territory, supporting territory, strategic role, emotional quality, vocabulary families, boundaries. |
| **Express** | Generates candidates with rationale and sound logic, then reviews and scores them against the approved criteria. |

The rule underneath all six is that the raw input is never overwritten. AI
normalisation is stored alongside the user's own words, and later stages consume
only values the user has approved — never an unapproved summary.

## Walkthrough

::video /media/synantics-walkthrough.mp4 | /images/synantics-poster.jpg | Full session, four and a half minutes — the aperitif brief taken through all six stages.

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

![Frame — the naming challenge is defined and the first raw material comes in](/images/synantics-01.jpg)

![Frame — the moment of need; answers are selected as bubbles, with a custom field on every page](/images/synantics-03.jpg)

![Distill — reducing the material to what the name has to carry](/images/synantics-05.jpg)

![Disrupt — pushing deliberately past obvious category language](/images/synantics-06.jpg)

![Connect — approved fragments linked into recurring patterns and constellations](/images/synantics-07.jpg)

![Crystallize — patterns become a naming brief with vocabulary families and boundaries](/images/synantics-10.jpg)

![Express — candidates with rationale, then scored against the approved criteria](/images/synantics-11.jpg)

## My contribution

Sole author. I designed the six-stage model, wrote the stage specifications and
the system prompt, built the Express backend and the PostgreSQL schema, and
implemented the frontend interaction.

## What Synantics is not

- Not a name generator. Generation is the last stage, not the product.
- Not a legal or domain clearance service. Availability and conflict notes are
  directional only, and the interface says so — formal trademark and domain
  review remains a separate professional step.
- Not autonomous. No stage advances on the model's own judgement; every one
  passes through an explicit user approval.
- Not a deployed product. It runs locally, without public accounts.

## What I learned

The interesting problem was not generation quality — it was traceability. Once
each stage stored the user's raw answer, the model's interpretation and the
approved value as three separate things, it became possible to look at a final
name and walk backwards to the decision that produced it. That audit trail is
the same requirement I keep meeting in architectural work, where a result nobody
can justify is a result nobody can defend.
