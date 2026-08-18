---
title: CompAr
slug: compar
group: Computational and AI Systems
order: 1
year: 2026
location: Berlin
type: Entwurfssystem / Forschungsprototyp
status: Prototyp — Phasen 1–5 implementiert
role: Alleinige Konzeption und Umsetzung
team: Solo
tools: Python, FastAPI, Next.js, TypeScript, Claude API, Perplexity, Rhino 8, Grasshopper
employer: Eigenes Projekt
cover: /images/compar-cover.jpg
tags: KI, Wettbewerb, Grasshopper, Räumliche Strategie, Python
summary: Ein System, das Auslobungsunterlagen von Architekturwettbewerben in strukturierte, nachvollziehbare und überprüfbare Entwurfsstrategien überführt.
---

Architektur entsteht aus Beziehungen, nicht aus Form. CompAr basiert auf dieser Prämisse: Anstatt zunächst Formen zu erzeugen und nachträglich eine Begründung dafür zu suchen, macht das System die Beziehungen innerhalb einer Auslobung explizit – welche Nutzungen einander zugeordnet sein müssen, was öffentlich oder privat ist und wo sich Bewegungsströme konzentrieren – und lässt erst daraus Geometrie entstehen.

## Das Problem

Eine Wettbewerbsauslobung umfasst schnell hundert Seiten Fließtext, Tabellen und Randbedingungen. Zu Beginn wiederholt nahezu jedes Büro dieselbe Arbeit: Unterlagen lesen, Raumprogramm und Flächen extrahieren, einschätzen, welche Qualitäten das Preisgericht voraussichtlich priorisieren könnte, und all diese Informationen unter Zeitdruck in eine Entwurfshaltung überführen.

Die Auswertung erfolgt manuell, die Übersetzung in Entwurfsentscheidungen bleibt undokumentiert, und sobald ein Entwurf vorliegt, lässt sich kaum noch rekonstruieren, welche Entscheidung aus der Auslobung und welche aus eingeübter Entwurfsroutine entstanden ist.

Das zentrale Risiko ist nicht Ideenmangel. Es besteht darin, dass die Strategie hinter einem Entwurf nicht explizit festgehalten wird und sich deshalb später nicht belastbar gegen die Auslobung prüfen lässt.

## Funktionsweise des Systems

CompAr führt die Auslobung durch eine Abfolge definierter Phasen. Jede Phase erzeugt eine strukturierte Datei, die von der folgenden Phase gelesen wird. Informationen werden nicht mehrfach neu interpretiert; spätere Entscheidungen bleiben bis zu dem Dokument zurückverfolgbar, aus dem sie abgeleitet wurden.

| Phase | Funktion | Output |
|---|---|---|
| 01 Brief | Extrahiert Bauaufgabe, Flächen, Budget, Grundstück und Nutzungen | `manifest.json` — zentrale Referenz- und Datenbasis |
| 02 Jury-Analyse | Recherchiert die Zusammensetzung des Preisgerichts und zuvor prämierte Arbeiten | Strategische Einschätzung, welche Positionen und Entwurfshaltungen Resonanz finden könnten |
| 03A Raumprogramm-Graph | Erzeugt aus dem Raumprogramm einen gewichteten Beziehungsgraphen | `program_graph.json` |
| 03B Organisationslogik | Schlägt eine Gebäudetypologie mit Begründung vor; der Architekt bestätigt oder korrigiert | `organizational_logic.json` |
| 03C Räumliche DNA | Öffentlich-privat-Gradient, Bewegungslogik, Licht und materielle Atmosphäre | `spatial_dna.json` |
| 03D Konzeptansätze | Sechs konkrete Richtungen: linear, Hof, Cluster, geschichtet, radial, hybrid | — |
| 04 Konzeptfestlegung | Der Architekt wählt eine Richtung aus | `concept_packet.json`, `geometry_seed.json` |
| 05 Geometrie | Der Seed steuert Grasshopper; die weiterentwickelte Geometrie wird zurückgespielt und mit der Strategie abgeglichen | — |

Die Phasen 06–08 – Variantenbildung, Vergleich und Validierung – sind spezifiziert und teilweise umgesetzt.

Die **Organisationslogik-Bibliothek** ist der Teil, den ich als eigentlichen konzeptionellen Beitrag betrachte. Sie ist ein Katalog aus zwölf räumlichen Strategien: Objektfeld, ausgehandelte Territorien, zellulares Feld, Schnittlandschaft, Hofgemeinschaft, Dorfcluster, Erschließungsrückgrat, Gradientenfeld, Plattform, Programmstapel, Landschaftsgeflecht und Atrium-Netzwerk.

Für jede Strategie wird beschrieben, für welche Programmtypen sie geeignet ist und wie private, halbprivate, gemeinschaftliche und öffentliche Bereiche organisiert werden. Die Bibliothek liegt zwischen Raumprogramm-Graph und Geometrie und verhindert, dass das System direkt von einer Tabelle zu einer Form springt.

## Das System in Anwendung

![Brief Intake — Die Auslobung wird in Raumprogramm, Flächen und Fristen strukturiert.](/images/compar-01.jpg)

![Programm — Raumprogramm mit Klassifizierung in öffentlich, halböffentlich und privat.](/images/compar-02.jpg)

![Organisationslogik — Geeignete Typologien werden anhand der Auslobung bewertet.](/images/compar-03.jpg)

![Organisationslogik 01 — Hofgemeinschaft, vertieft dargestellt.](/images/compar-04.jpg)

![Organisationslogik 02 — Plattform.](/images/compar-05.jpg)

![Organisationslogik 03 — Erschließungsrückgrat / Spine Organization.](/images/compar-06.jpg)

![Konzeptfestlegung — Der terrassierte Hof wird durch den Architekten bestätigt.](/images/compar-07.jpg)

![Dashboard — Brief, Baufeld, Variantenerzeugung und Vergleich.](/images/compar-08.jpg)

![Poster 01 — Organisationslogik-Bibliothek (Phase 3B), zwölf räumliche Strategien.](/images/compar-09.jpg)

![Poster 02 — Behavioral Logic Library (Phase 3C).](/images/compar-10.jpg)

![Poster 03 — Morphology Library (Phase 3D).](/images/compar-11.jpg)

![Poster 04 — Section Strategy Library (Phase 3C).](/images/compar-12.jpg)

## Mein Beitrag

Alleinige Konzeption und Umsetzung. Ich habe die Phasenarchitektur und die Datenschnittstellen zwischen den Phasen definiert, die Organisationslogik-Bibliothek entwickelt, das FastAPI-Backend und das Next.js-Dashboard aufgebaut und die Grasshopper-Schnittstelle bis einschließlich Phase 5 implementiert.

## Bewusst gesetzte Grenzen

Der Architekt entscheidet. Das System schlägt eine Organisationslogik vor und kann eine Variante empfehlen; die Bestätigung bleibt jedoch in jeder Phase beim Architekten.

Die Erschließungsstrategie wird beispielsweise als fünf gleichberechtigte Optionen ohne Empfehlung dargestellt, weil diese Entscheidung weder einer Regel noch einem Sprachmodell überlassen werden sollte.

## Was CompAr nicht ist

- Kein Generative-Design-Tool. Es erzeugt keinen Entwurf aus einem Prompt.

- Kein Jury-Simulator. Die Jury-Analyse informiert die Strategie; sie prognostiziert keine Wettbewerbsergebnisse.

- Kein Generator für Wettbewerbsabgaben. Boardlayout, Rendering und die Automatisierung der finalen Abgabe sind ausdrücklich nicht Bestandteil des Systems.

- Keine geometrische Entscheidungshoheit. Rhino bleibt die geometrische Referenz; Sprachmodelle platzieren keine Wand.

## Nachweis / Testfall

End-to-End getestet mit *The Walled Garden* – einem Standort in Berlin-Neukölln mit 2.400 m² Grundstücksfläche, 40 Wohneinheiten, GFZ 2,0 und maximal sechs Geschossen.

Die Auslobung wurde eigens für diesen Test erstellt und ist kein reales Wettbewerbsdokument. Zum Testzeitpunkt war kein geeigneter Wohnungsbauwettbewerb offen; die verfügbaren Wettbewerbe anderer Kategorien hätten gerade die für das System relevanten Teile – Raumprogramm-Graph und Organisationslogik – nicht ausreichend beansprucht.

Beide benötigen eine Aufgabenstellung mit dichten, teilweise widersprüchlichen räumlichen Beziehungen. Eine konstruierte Auslobung mit transparent benannten Randbedingungen war daher der belastbarere Test.
