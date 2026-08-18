---
title: Synantics
slug: synantics
group: Computational and AI systems
order: 1
year: 2026
location: Berlin
type: Webanwendung
status: Abschlussprojekt — sechs Stufen implementiert
role: Alleinige Konzeption und Umsetzung
team: Solo
tools: Node.js, Express, PostgreSQL, Zod, vanilla JavaScript, Three.js
employer: None — own project
cover: /images/synantics-title.gif
poster: /images/synantics-poster.webp
demoUrl: https://synantics.layeroff.ai
demoNote: Der Live-Build geht bei Inaktivität in den Ruhezustand; der erste Ladevorgang dauert daher ungefähr eine Minute. Der Walkthrough und die unten gezeigten Stage-Captures benötigen keinen Server.
tags: KI, Naming, Webanwendung, Prozessdesign
summary: Ein strukturiertes System zur Namensentwicklung, das Naming als nachvollziehbaren Entscheidungsprozess statt als einzelnen Prompt organisiert.
---

Das Werkzeug hat sich selbst benannt. *Synantics* ist eine Wortbildung aus *synthesised semantics* und entstand aus den sechs eigenen Prozessstufen des Systems – der kürzeste verfügbare Beleg dafür, dass der Ablauf funktioniert.

Ein Name ist das Ergebnis einer Entscheidungskette, nicht eines einzelnen Prompts. Synantics macht diese Kette explizit: sechs Stufen, die jeweils vom Nutzer freigegeben werden, bevor die nächste beginnt. Wenn schließlich Namen erzeugt werden, sind Bedeutung, Grenzen und Bewertungskriterien bereits definiert.

## Das Problem

Das Projekt begann als *Brandon*, ein Custom GPT für Markennamen. Die Nutzung empfand ich weder als kreativ noch als angenehm. Die Fragen verschwammen zu einem langen Prompt, es gab kein erkennbares Fortschreiten im Prozess und es war nicht nachvollziehbar, wie aus einer Beobachtung zunächst ein strategisches Territorium und daraus schließlich ein Name entstand.

Kommerzielle KI-Namensgeneratoren folgen meist demselben Muster: Keywords eingeben, Liste erhalten. Für die Qualität eines Namens ist jedoch das Briefing entscheidend – Zielgruppe, Kategorie, Tonalität, Richtung und Ausschlussbegriffe – und kaum jemand möchte dafür zunächst ein Formular mit zwölf Feldern ausfüllen.

## Funktionsweise des Systems

Sechs miteinander verknüpfte Stufen. Jede verbindet eine feste Struktur mit individuellem Input. In jedem Schritt schlägt das System eine Interpretation vor, die der Nutzer überarbeiten, ablehnen oder freigeben kann, bevor es weitergeht.

| **Stage**   | **Was geschieht**                                                                                                                                                                                                                                          |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Frame       | Definiert, was benannt wird, für wen es relevant ist, welche Vorher-Nachher-Veränderung gemeint ist und welche plausiblen, aber falschen Annahmen ausgeschlossen werden müssen. Ergebnis ist eine strategische Grundlage – noch ohne Namen oder Metaphern. |
| Distill     | Reduziert das Material auf das, was der Name tragen muss: Was unmittelbar spürbar sein soll, was erst später entdeckt wird, welche Spannung ihn prägt und was niemals führend sein darf. Ergebnis sind ein strategischer Kern und eine Ausschlussliste.    |
| Disrupt     | Verlässt bewusst die naheliegende Kategoriesprache und untersucht Bewegung, Verhalten, Umgebungen, unerwartete Assoziationen sowie Ideen, die attraktiv wirken, strategisch jedoch falsch sind.                                                            |
| Connect     | Verknüpft freigegebene Fragmente zu wiederkehrenden Mustern und eigenständigen Konstellationen. Noch keine Namen – sondern ein strukturiertes strategisches Feld.                                                                                          |
| Crystallize | Überführt die Muster in ein Naming-Briefing: führendes Territorium, unterstützendes Territorium, strategische Rolle, emotionale Qualität, Wortschatzfamilien und Grenzen.                                                                                  |
| Express     | Erzeugt Namenskandidaten mit Begründung und Klanglogik und prüft bzw. bewertet sie anschließend gegen die freigegebenen Kriterien.                                                                                                                         |

Die Grundregel unter allen sechs Stufen lautet: Rohinput wird niemals überschrieben. Die KI-Normalisierung wird parallel zu den eigenen Formulierungen des Nutzers gespeichert; spätere Stufen verwenden ausschließlich Werte, die der Nutzer ausdrücklich freigegeben hat – niemals eine nicht bestätigte Zusammenfassung.

## Architektur

Eine Full-Stack-Webanwendung. Ein Frontend in vanilla JavaScript trägt die interaktive Nutzung: Antworten erscheinen als auswählbare Bubbles, die sich zu Clustern zusammensetzen. Ein Node- und Express-Backend speichert Sessions, Territorien, Kandidaten, Shortlists und Generierungs-Batches in PostgreSQL; Zod validiert die strukturierten Ausgaben des Modells. Der LLM-Key verbleibt serverseitig, der Browser kommuniziert niemals direkt mit dem Provider. In den Tests wird der Model Client vollständig gemockt, sodass die Testsuite ohne Netzwerkzugriff läuft.

Die finale Bewertung wird deterministisch aus den freigegebenen Kriterien berechnet. Das Modell macht Vorschläge; die Berechnung selbst stammt nicht vom Modell.

## Getestet mit drei bewusst unterschiedlichen Briefings

- **Repair Club** — ein nachbarschaftlicher Reparaturtreff mit Werkzeugbibliothek, vollständig aus individuellem Input entwickelt. Getestet wurde, ob Alltagssprache in eine eigenständige Namensrichtung überführt werden kann. Tabuwörter waren unter anderem *repair, fix, tool, eco, community, hub*.
- **Architecture AI Assistant** — ein Workflow-Begleiter für Architekturbüros, der glaubwürdig und architektonisch wirken sollte, ohne nach Software zu klingen. Tabuwörter waren *AI, automation, agent, workflow, BIM, smart, architect*.
- **Botanical Evening Aperitif** — ein alkoholfreier Aperitif, bei dem Begehren und Atmosphäre im Vordergrund stehen sollten, nicht der Verzicht. Tabuwörter waren *sober, zero, clean, detox, wellness, alcohol-free*.

Jeder Testfall definiert einen Naming-Charakter, einen Ansatz, eine Muss-vermeiden-Liste und einen einzelnen Erfolgstest – also die Frage, die das Ergebnis beantworten muss.

## Die sechs Stufen

![Frame — Was wird benannt? Antworten werden als Bubbles ausgewählt; jede Karte erlaubt individuellen Input.](/images/synantics-01.jpg)

![Distill — Der Frame wird vor jedem weiteren Schritt zur Freigabe wieder zusammengesetzt.](/images/synantics-02.jpg)

![Disrupt — Das Feld wird über naheliegende Kategoriesprache hinaus geöffnet; Ablehnungen sind rot markiert.](/images/synantics-03.jpg)

![Connect — Fragmente werden in Konstellationen gezogen; ein Thema kann zum Kern erklärt werden.](/images/synantics-04.jpg)

![Crystallize — Das Territorium und die daraus abgeleiteten Implikationen.](/images/synantics-05.jpg)

![Review — Dreißig Elemente werden zu einem Briefing zusammengesetzt, bevor überhaupt ein Name existiert.](/images/synantics-06.jpg)

![Express — Erster Durchlauf nur nach Intuition; Begründung und Logik folgen später.](/images/synantics-07.jpg)

![Express — Generierungssteuerung: Konstruktion, Semantik, Batch-Größe.](/images/synantics-08.jpg)

![Review and Export — Naming-Briefing mit ausschließlich orientierender Vorprüfung.](/images/synantics-09.jpg)

## Mein Beitrag

Alleinige Konzeption und Umsetzung. Ich habe das sechsstufige Modell entworfen, die Spezifikationen der einzelnen Stufen und den System Prompt geschrieben, das Express-Backend und das PostgreSQL-Schema aufgebaut und die Frontend-Interaktion implementiert.

## Was Synantics nicht ist

- Kein Namensgenerator. Die Generierung ist die letzte Stufe, nicht das Produkt selbst.
- Kein Dienst für rechtliche Marken- oder Domainfreigabe. Hinweise zu Verfügbarkeit und möglichen Konflikten dienen ausschließlich der Orientierung; die Oberfläche weist ausdrücklich darauf hin. Eine formale Marken- und Domainprüfung bleibt ein separater professioneller Schritt.
- Nicht autonom. Keine Stufe wird allein aufgrund eines Modellurteils fortgesetzt; jede Stufe erfordert eine ausdrückliche Freigabe durch den Nutzer.
- Kein ausgerolltes Produkt. Das System läuft lokal und besitzt keine öffentlichen Benutzerkonten.

Die interessante Fragestellung war nicht die Qualität der Generierung, sondern die Nachvollziehbarkeit. Sobald jede Stufe die ursprüngliche Nutzereingabe, die Interpretation des Modells und den freigegebenen Wert als drei getrennte Ebenen speicherte, konnte man von einem finalen Namen rückwärts bis zu der Entscheidung gehen, aus der er entstanden war. Dieser Audit Trail entspricht derselben Anforderung, die mir in der architektonischen Arbeit immer wieder begegnet: Ein Ergebnis, das niemand begründen kann, ist ein Ergebnis, das niemand fachlich vertreten kann.
