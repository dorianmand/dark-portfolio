---
title: Formwerk
slug: formwerk
group: Computational and AI systems
order: 3
year: 2026
location: Berlin
type: Webanwendung
status: Berlin-Pilot — drei amtliche Formulare, mit Beispieldaten getestet
role: Alleinige Konzeption und Umsetzung
team: Solo
tools: Python, FastAPI, Next.js, PDF automation
employer: None — own project
cover: /images/formwerk-cover.jpg
coverFit: contain
tags: KI, Bauordnungsrecht, Automatisierung, Webanwendung, Deutschland
summary: Eine regelbasierte Anwendung zur Bearbeitung deutscher Bauantragsformulare mit landesspezifischen Regelpaketen.
---

Das Bauordnungsrecht ist in Deutschland Ländersache. Formulare, Pflichtfelder und Prüflogiken unterscheiden sich von Bundesland zu Bundesland – der zugrunde liegende *Prozess* ist jedoch weitgehend gleich. Formwerk trennt diese beiden Ebenen: eine wiederverwendbare Engine und bundeslandspezifische Regel- und Formularpakete, die daran angebunden werden.

## Das Problem

Ein *Bauantrag* besteht aus einer Vielzahl amtlicher Formblätter, in die identische Projektdaten wiederholt manuell übertragen werden. Adresse, Flurstücksbezeichnung, Bauherrschaft und Baubeschreibung tauchen in mehreren Dokumenten erneut auf. Jede Übertragung birgt das Risiko einer Inkonsistenz; widersprüchliche Angaben zwischen Formularen können zu Rückfragen, Nachforderungen oder einer Rückgabe durch die Bauaufsichtsbehörde führen.

Das ist Verwaltungsarbeit, keine Entwurfsarbeit. Sie bindet einen unverhältnismäßig hohen Anteil architektonischer Arbeitszeit, ohne gestalterisches Urteilsvermögen zu erfordern.

## Funktionsweise des Systems

Projektdaten werden einmal eingegeben. Die Engine ordnet sie den Feldern der amtlichen Formulare zu, prüft Pflichtangaben und erzeugt ausgefüllte PDF-Dokumente.

**Systemarchitektur.** Ein Next.js-Frontend dient der Dateneingabe und Formularinteraktion, ein FastAPI-Backend übernimmt Verarbeitung, Regellogik und PDF-Erzeugung. Die fachliche Domänenlogik liegt im Backend – genau dadurch wird Formwerk zu einem bundeslandspezifisch regelbewussten Antragssystem und nicht lediglich zu einem PDF-Ausfüller.

**Regel- und Formularlogik.** Für jedes unterstützte Formular werden mehrere aufeinander abgestimmte Definitionen geführt: die Feldzuordnung zwischen Projektdaten und PDF-Feldern, die Layoutdefinition für die Benutzeroberfläche, die Pflichtfelddefinition sowie bundeslandspezifische Regeln mit ihren Abhängigkeiten. Zusammen sorgen sie dafür, dass Formulare konsistent befüllt werden und fehlende oder widersprüchliche Angaben frühzeitig sichtbar werden.

**Backend-Module.** Ein Entity Resolver vereinheitlicht und gleicht Einträge ab; die Fill Engine befüllt die PDF-Felder; ein Upload Analyzer untersucht vom Nutzer bereitgestellte Dokumente; eine Versionsprüfung kontrolliert Revisionen der amtlichen Formblätter. Amtliche Formulare ändern sich – wird ein Bauantrag auf Grundlage einer überholten Formularversion erstellt, kann dies zur Zurückweisung oder Nachforderung führen.

**Berlin als Pilot.** Getestet mit Beispieldaten, nicht anhand eines tatsächlich eingereichten Bauantrags. Die aktuelle Implementierung unterstützt drei amtliche Berliner Formulare: bau_101, bau_111 und bau_120. Jedes besitzt eine eigene Feldzuordnung, UI-Struktur und Pflichtfelddefinition; das Berlin-Paket ergänzt darüber hinaus die bundeslandspezifischen Prüfregeln.

**Erweiterbarkeit auf weitere Bundesländer.** Die Kern-Engine bleibt länderübergreifend identisch. Ein weiteres Bundesland wird über ein neues Regel- und Formularpaket ergänzt – Bayern ist als nächster Schritt vorgesehen – ohne den Kern des Systems anzupassen.

**Projektdatenstruktur.** Jeder Bauantrag wird als eigener Vorgang geführt: Eingabedaten, Klassifikation, aufbereitete Formulardaten und erzeugte Ausgabe-PDFs bleiben voneinander getrennt und vollständig nachvollziehbar.

## Mein Beitrag

Alleinige Konzeption und Umsetzung. Ich habe die Trennung zwischen Kern-Engine und Regelpaketen entworfen, das Berliner Regelpaket erstellt, Backend-Module und Frontend aufgebaut und die Formularfeld-Zuordnungen anhand der amtlichen Berliner Bauantragsformulare spezifiziert.

## Was Formwerk ist

- Ein Werkzeug für den administrativen Teil des Genehmigungsverfahrens
- Automatisiert die Befüllung von Bauantragsformularen
- Prüft Pflichtfelder und Pflichtangaben
- Wendet bundeslandspezifische Regeln an
- Erzeugt dokumentierte PDF-Ausgaben

## Was Formwerk nicht ist

- Es generiert keine Architektur.
- Es entwickelt keine Entwurfsvarianten.
- Es bewertet keine architektonische oder städtebauliche Qualität.
- Es trifft keine fachliche, bauordnungsrechtliche oder behördliche Genehmigungsentscheidung.

Diese Abgrenzung ist der Kern des Projekts und kein nachträglich ergänzter Haftungsausschluss. Das Genehmigungsverfahren enthält einen großen Anteil tatsächlich mechanischer Arbeit und einen deutlich kleineren Anteil, der architektonische Verantwortung, Fachurteil und Haftung erfordert. Formwerk ist bewusst auf den ersten Bereich beschränkt.
