---
title: Formwerk
slug: formwerk
group: Computational and AI systems
order: 3
year: 2026
location: Berlin
type: Web application
status: Berlin pilot — three official forms, tested on sample data
role: Sole author
team: Solo
tools: Python, FastAPI, Next.js, PDF automation
employer: None — own project
cover: /images/formwerk-cover.jpg
tags: AI, Regulation, Automation, Web app, Germany
summary: A rule-based engine for German building permit forms, with state-specific rule packages.
---

## Thesis

German building permit law is organised at state level. The forms, the mandatory
fields and the checking rules differ from one Bundesland to the next, but the
*process* underneath them is the same everywhere. Formwerk separates the two:
one reusable engine, and per-state rule packages that plug into it.

## The problem

A *Bauantrag* — a German building permit application — is a stack of official
forms in which the same project data is transcribed by hand, repeatedly, into
different layouts. The same address, plot designation, client and building
description reappear across a dozen documents. Every transcription is a chance
to introduce an inconsistency, and an inconsistency between forms is a reason for
the authority to return the application.

This is administrative work, not design work. It absorbs a disproportionate share
of an architect's time and none of their judgement.

## How the system works

Project data goes in once. The engine maps it to the fields of the official
forms, checks mandatory entries, and produces completed PDFs.

**Architecture.** A Next.js frontend for data entry and form interaction, a
FastAPI backend for processing, rules and PDF generation. The domain logic lives
in the backend — that is what makes Formwerk a state-aware application system
rather than a PDF filler.

**Rule and form logic.** Each supported form carries several coordinated
definitions: the field mapping between project data and form fields, the layout
definition for the interface, the mandatory-field specification, and the state
rules with their dependencies. Together these ensure forms are filled correctly
and that missing or contradictory entries surface early.

**Backend modules.** An entity resolver that unifies and reconciles entries, a
fill engine that populates the PDF fields, an upload analyser for documents the
user supplies, and a version check for form revisions — official forms change,
and an application built on a superseded version is rejected.

**Berlin as pilot.** Tested on sample data, not on a submitted application. The
current implementation supports three official Berlin forms — `bau_101`, `bau_111`, `bau_120`. Each has its own field mapping, UI
structure and mandatory-field definition; the Berlin package adds the
state-specific checking rules on top.

**State extensibility.** The engine stays identical across states. A further
Bundesland is added by writing a new rule and form package — Bayern is planned
next — without touching the core.

**Project data structure.** Every application is organised as its own case:
input data, classification, prepared form data, and generated output PDFs kept
separate and traceable.

## My contribution

Sole author. I designed the engine/rule-package separation, wrote the Berlin
rule package, built the backend modules and the frontend, and specified the form
field mappings against the official Berlin forms.

## What Formwerk is

- A tool for the administrative part of the permit process
- Automates form completion
- Checks mandatory fields
- Applies state rules
- Produces document output

## What Formwerk is not

- It does not generate architecture
- It does not develop design variants
- It does not assess planning quality
- It does not make any professional or regulatory approval decision

That distinction is the point of the project, not a disclaimer attached to it.
The permit process contains a large amount of work that is genuinely mechanical,
and a much smaller amount that requires an architect's liability and judgement.
Formwerk is deliberately confined to the first.

