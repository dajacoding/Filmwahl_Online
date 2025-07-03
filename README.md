# Online-Filmwahl-Projekt

## Überblick

Das Online-Filmwahl-Projekt ist eine webbasierte Anwendung, die es einer Gruppe ermöglicht, vor Ort gemeinsam einen Film für einen gemeinsamen Abend auszuwählen. Die Teilnehmer befinden sich dabei am selben geografischen Ort (z.B. im Wohnzimmer, Vereinsheim oder Seminarraum) und nutzen ihre Smartphones, um über Vorschläge abzustimmen. Die Anwendung setzt auf PHP, MySQL und ein interaktives JavaScript-Frontend.

## 1. Ablauf der Filmwahl

### 1.1. Start der Sitzung

- Initiator ruft die Startseite (`index.php`) auf.
- Es wird eine zufällige Sitzungs-ID (sid) generiert.
- Automatische Weiterleitung zur Vorschlagsseite (`list.php?sid=...`).

### 1.2. Vorschlagsphase (`list.php`)

- Alle Teilnehmer sehen den aktuellen Stand auf einem zentralen Bildschirm (z.B. Fernseher, Beamer, Laptop).
- **Filmvorschläge eintragen:**
  - Jeder kann einen Film per IMDB-ID vorschlagen (aus z.B. URL kopieren, beginnt immer mit tt, gefolgt von Ziffern).
  - Die Vorschläge erscheinen sofort in der Liste.
  - Die Anwendung prüft, ob ein Film bereits in der aktuellen Sitzung vorgeschlagen wurde.
- **Reset-Funktion:** Bei Bedarf kann die Sitzung zurückgesetzt werden (alle Vorschläge werden gelöscht).

### 1.3. Wahl starten

- Wenn alle Vorschläge gesammelt sind, startet der Initiator die Wahl durch Klick auf "Wählen".
- Ein QR-Code wird angezeigt.
- Jeder Teilnehmer scannt den QR-Code mit seinem Smartphone.
- Der QR-Code enthält einen Link zur persönlichen Abstimmungsseite für diese Sitzung.
- Es ist keine Anmeldung oder Registrierung notwendig.

### 1.4. Abstimmungsphase (Smartphone)

- Jeder Teilnehmer sieht die vorgeschlagenen Filme als Karten auf seinem Smartphone.
- Die Karten enthalten Titel, Poster, Kurzbeschreibung und weitere Infos (z.B. Genre, Laufzeit).
- Die Filme können per Drag & Drop (Touch) in die persönliche Wunschreihenfolge gebracht werden.
- Die Reihenfolge spiegelt die persönliche Präferenz wider (oben = Favorit, letzter Platz = am wenigsten gewünscht).
- **Abstimmen:**
  - Nach Sortieren bestätigt der Teilnehmer seine Reihenfolge.
  - Die Votierung wird per AJAX an den Server gesendet und gespeichert.
  - Eine Rückmeldung zeigt an, dass die Votierung gezählt wurde.

### 1.5. Ergebnisanzeige (`result.php`)

- Nach der Abstimmung können die Ergebnisse am zentralen Bildschirm angezeigt werden.
- Verschiedene Wahlsysteme stehen zur Auswahl:
  - Der Organisator kann per Klick zwischen den Auswertungsarten wechseln.
  - Die Ergebnisse werden grafisch angezeigt (Filmposter, Prozentwerte etc.).
- Die Gruppe sieht sofort, welcher Film nach welchem Wahlsystem gewonnen hätte.

## 2. Technische Komponenten

### 2.1. Backend (PHP & MySQL)

- **Sitzungsverwaltung:** Jede Sitzung erhält eine eindeutige ID (sid), die alle Aktionen eindeutig zuordnet.
- **Filmvorschläge:** Filme werden mit IMDB-API-Daten (als JSON) gespeichert.
- **Abstimmung:** Die Reihenfolge jedes Teilnehmers wird als Liste von Film-IDs mit Positionsangabe gespeichert.
- **Ergebnisermittlung:** Die Stimmen werden je nach gewähltem Wahlsystem aggregiert und ausgewertet.

### 2.2. Frontend (HTML, CSS, JavaScript)

- **Zentrale Anzeige:** Die Vorschlags- und Ergebnislisten sind für alle sichtbar (z.B. auf einem großen Bildschirm).
- **Mobile Abstimmung:** Die Abstimmungsseite ist für Touch-Bedienung optimiert (große Buttons, Drag & Drop).
- **QR-Code:** Ein externer Service generiert den QR-Code für den Abstimmungslink.
- **Canvas-Rendering:** Die Darstellung der Filme und Ergebnisse erfolgt dynamisch im Canvas.
- **AJAX-Kommunikation:** Votierung wird asynchron übertragen, ohne die Seite neu zu laden.

## 3. Datenbankstruktur (vereinfachte Übersicht)

**filme**

- `filme_id` (Primärschlüssel)
- `filme_imdb_id`
- `filme_imdb_json` (JSON mit Filmdaten)
- `filme_datum`
- `filme_sid` (Sitzungs-ID)

**waehler**

- `waehler_id` (Primärschlüssel)
- `waehler_anmeldung` (Status)

**wahl**

- `wahl_id` (Primärschlüssel)
- `wahl_waehler_id` (Fremdschlüssel zu `waehler`)
- `wahl_filme_id` (Fremdschlüssel zu `filme`)
- `wahl_filme_position` (Platzierung des Films in der Votierung)

## 4. Wahlsysteme (Beispiele)

- **Nur 1. Stimme:** Es zählen nur die Erstplatzierungen.
- **1. und 2. Stimme gleich:** Sowohl Erst- als auch Zweitplatzierungen zählen gleichwertig.
- **Durchschnittsplatzierung:** Filme mit der höchsten durchschnittlichen Platzierung gewinnen.
- **Negativer Konsens:** Filme, die auf dem letzten Platz landen, scheiden aus.
- **Platzhalter:** Für eigene Wahlsysteme erweiterbar.

*Die Wahlsysteme sind als JavaScript-Klassen implementiert und können einfach erweitert werden.*

## 5. Besonderheiten und Vorteile

- **Keine Registrierung:** Jeder kann sofort teilnehmen, es reicht ein Smartphone mit Browser.
- **Vor-Ort-Nutzung:** Die Anwendung ist für Gruppen gedacht, die sich gemeinsam an einem Ort befinden.
- **Schnelle Abstimmung:** Die Abstimmung dauert nur wenige Minuten und ist intuitiv bedienbar.
- **Flexibel:** Neue Wahlsysteme können einfach ergänzt werden.
- **Transparenz:** Die Ergebnisse sind für alle sichtbar und nachvollziehbar.
- **Sicherheit:** Doppelte Vorschläge werden verhindert, die Datenübertragung ist robust gestaltet.

## 6. Typischer Ablauf vor Ort (Beispiel)

1. Initiator öffnet die Startseite auf dem Laptop und projiziert sie für alle sichtbar.
2. Alle schlagen gemeinsam Filme vor (z.B. per Zuruf, zentrale Eingabe).
3. Wenn alle Vorschläge stehen, wird die Wahl gestartet und der QR-Code angezeigt.
4. Jeder scannt den QR-Code und sortiert die Filme auf seinem Smartphone.
5. Nach der Abstimmung werden die Ergebnisse gemeinsam am Bildschirm ausgewertet.
6. Die Gruppe entscheidet sich für einen Film und der Filmabend kann beginnen!

## 7. Erweiterungsmöglichkeiten

- Weitere Wahlsysteme (z.B. STV, Borda, Approval Voting)
- Integration von Trailer-Links
- Benachrichtigung, wenn alle abgestimmt haben
- Statistiken über vergangene Sitzungen

## Fazit

Das Online-Filmwahl-Projekt ist ein vielseitiges, modernes Tool für Gruppenentscheidungen rund um Filme. Es ist speziell für die Nutzung vor Ort konzipiert und ermöglicht eine demokratische, faire und transparente Auswahl des nächsten Films. Die Anwendung ist flexibel, leicht zu bedienen und kann an viele weitere Anwendungsfälle angepasst werden.
