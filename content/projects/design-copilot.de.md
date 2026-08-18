---
title: Design Copilot
slug: design-copilot
group: Computational and AI systems
order: 2
year: 2026
location: Berlin
type: Parametrisches Entwurfssystem
status: Funktionsfähiger Prototyp in Grasshopper
role: Alleinige Konzeption und Umsetzung
team: Solo
tools: Rhino, Grasshopper, Python, Ladybug
employer: None — own project
cover: /images/design-copilot-cover.jpg
tags: Grasshopper, Parametrisch, Regelbasiert, Umweltanalyse, Python
summary: Parametrische Gebäudesteuerung in Grasshopper mit regelbasierter Entwurfsprüfung sowie Umwelt- und Tageslichtanalyse.
---

Ein parametrisches Modell, das ausschließlich Geometrie erzeugt, ist im Kern eine Zeichenmaschine. Design Copilot schließt den Rückkopplungskreis: Jede Änderung eines Sliders berechnet die wesentlichen Gebäudekennwerte neu, prüft sie gegen definierte Regeln und meldet die Auswirkungen direkt im Modell zurück. Die Konsequenz einer Entwurfsentscheidung wird damit in dem Moment sichtbar, in dem die Entscheidung getroffen wird – nicht erst Wochen später in einem Fachplanerbericht.

## Das Problem

In frühen Baukörperstudien werden die kostenintensivsten Grundsatzentscheidungen getroffen – und gleichzeitig steht dort die geringste Informationsdichte zur Verfügung. Überbaute Grundstücksfläche, Hofproportion, Anzahl der Erschließungskerne, Wohnungsmix, Tageslicht und Verschattung werden jeweils separat, von unterschiedlichen Beteiligten und zu unterschiedlichen Zeitpunkten geprüft – meist erst dann, wenn die Kubatur bereits weitgehend festgelegt ist. Sobald die Kennwerte vorliegen, sind Änderungen am Gebäude entsprechend aufwendig.

## Funktionsweise des Systems

Das System arbeitet als kontinuierlicher Feedback-Loop auf dem Grasshopper-Canvas. Jede Änderung am Modell stößt die gesamte Prozesskette erneut an.

Sliders → Building Control → JSON-Datenbasis → Critique Loop → Critique Panel → Environmental Analysis

**01 Parametrische Gebäudesteuerung.** Slider steuern Gebäudehöhe, Geschosszahl und Geschosshöhe, Orientierung, Grundstückslänge und -breite, Gebäudetiefe sowie Dachversatz. Jede Änderung berechnet Geometrie und nachgelagerte Daten neu.

**02 Building Control und Datenbasis.** Python berechnet GRZ (*Grundflächenzahl* gemäß deutscher Bauleitplanung), Gebäudegrundfläche, Hoffläche, gesamte nutzbare Fläche und Fassadenfläche. Die Ergebnisse werden in model_v1.json geschrieben. Ein exported_at-Zeitstempel signalisiert den nachgelagerten Komponenten, dass sich der Modellstand geändert hat.

**03 Critique Loop.** Regelbasierte Prüfungen – nicht modellbasierte Bewertungen – kontrollieren unter anderem GRZ-Grenzen nach BauNVO, Proportion und Dimensionierung des Hofes, brandschutztechnische Schwellenwerte im Hochhausbereich sowie die winterliche Besonnung. Der Output wird in Stärken, Risiken und Empfehlungen gegliedert.

**04 Critique Panel.** Ein Panel direkt auf dem Canvas zeigt die wesentlichen Kennwerte, Risiken und Empfehlungen unmittelbar neben der Geometrie, auf die sie sich beziehen.

**05 Umweltanalyse.** Ladybug verknüpft Standort- und Klimadaten mit der parametrischen Geometrie und ermittelt Besonnungs- und Tageslichtkennwerte für Baukörper, Atrium, Loggien und Fassadenvarianten. Die Ergebnisse fließen zurück in die Bewertungsebene.

**06–10 Gebäudesystem.** Erschließungstypologie – Einspänner, Zweispänner, Laubengang – mit Anzahl und Position der Erschließungskerne in Abhängigkeit von Geschossfläche und zulässigen Fluchtweglängen; Wohnungsmix im Abgleich mit einer Zielverteilung; parametrische Fassade mit Fensterflächenanteil, Achsraster und Materialzonen; Atriumeinschnitt zur Tageslichtversorgung mit Prüfung von Höhen-Breiten-Verhältnis und Entrauchung; Loggien und Balkone mit Bewertung ihrer Auswirkungen auf nutzbare Nettofläche, Verschattung der darunterliegenden Geschosse und den Anteil der Wohnungen mit privatem Außenraum.

Die Entwicklung, die das System beschreibt, führt vom reinen Baukörper-Checker zu einem Gebäudesystem: Jedes Modul ergänzt eine zusätzliche Ebene, ohne die darunterliegende zu ersetzen.

## Das System in Anwendung

![Grasshopper-Canvas — Building Control speist den Critique Loop.](/images/design-copilot-01.jpg)

![Ladybug-Zweig — Sonnenlauf und direkte Sonnenstunden bezogen auf den parametrischen Baukörper.](/images/design-copilot-02.jpg)

![Rhino-Viewport — direkte Sonnenstunden auf dem erzeugten Volumen.](/images/design-copilot-03.jpg)

![Grasshopper-Output — kollektiver Wohnungsbau von der Organisationslogik bis zur parametrischen Geometrie.](/images/design-copilot-04.jpg)

![Baukörpermodulierungsbibliothek — modulares Typologiesystem für analysierbare Varianten.](/images/design-copilot-05.jpg)

![Residential Circulation Library — zwölf Erschließungstypologien mit Treppen- und Aufzugskernen.](/images/design-copilot-06.jpg)

![Poster 05 — Transformation and Facade Library (Phase 3D).](/images/design-copilot-07.jpg)

## Mein Beitrag

Alleinige Konzeption und Umsetzung. Ich habe die parametrische Definition aufgebaut, die Python-basierte Bewertungs- und Regellogik geschrieben, die JSON-Schnittstelle zwischen den Komponenten definiert und Ladybug in den Critique Loop integriert.

## Bekannte Einschränkung

Das Critique Panel wertet aktuell einmal beim Laden aus. Die automatische Live-Neuberechnung nach jeder Slider-Änderung ist spezifiziert, aber noch nicht vollständig verdrahtet; nach einer Parameteränderung ist daher derzeit ein manueller Re-Run erforderlich. Dies ist der nächste Umsetzungsschritt.

## Was Design Copilot nicht ist

- Keine vollständige bauordnungsrechtliche Prüfung. Die hinterlegten Regeln bilden einen Arbeitsausschnitt ab und keine vollständige Prüfung von BauNVO oder Landesbauordnung.
- Kein Entwurfsgenerator. Das System bewertet eine vom Architekten gesteuerte Kubatur; es schlägt keine eigenständige Form vor.
- Kein zertifizierter Umwelt- oder Tageslichtnachweis. Die Ladybug-Ergebnisse dienen der richtungsweisenden Variantenbewertung und ersetzen keinen Fachnachweis.
- Kein Produkt. Das System läuft innerhalb einer Grasshopper-Definition und nicht als allgemein installierbare Software.

Der wertvollste Teil erwies sich als die JSON-Ebene – nicht die Geometrie. Sobald die Gebäudekennwerte als Daten mit Änderungszeitstempel vorlagen, ließ sich jede weitere Bewertung – Tageslicht, Wohnungsmix, Fassade – additiv ergänzen, anstatt das System jeweils neu aufzubauen. Die Zwischenrepräsentation ist die eigentliche Entwurfsentscheidung.
