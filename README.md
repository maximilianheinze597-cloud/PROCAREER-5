# PROCAREER – 3D-Fußball-Karrierespiel (Version 4)

Browserspiel für iPhone (Querformat) und PC. Reines HTML/CSS/JS, kein Backend, Spielstand im `localStorage`.

## Starten / GitHub Pages
1. Neues Repository auf GitHub anlegen, den **entpackten Inhalt** dieser ZIP (nicht den Ordner selbst) hochladen – `index.html` liegt im Root.
2. Repository → Settings → Pages → Source: *Deploy from a branch* → Branch `main`, Ordner `/ (root)` → Save.
3. Nach 1–2 Minuten erreichbar unter `https://<name>.github.io/<repo>/`. Auf dem iPhone: Teilen → „Zum Home-Bildschirm".
Lokal testen: `python3 -m http.server` im Projektordner, dann http://localhost:8000.

## Struktur
- **Neu in v2:** 24 Fantasievereine in 3 Ligen (Elite Liga, Aufstiegsliga, Regionalliga) mit Auf-/Abstieg (2 Plätze), Wechsel auch in andere Ligen im Sommer, detailliertere 3D-Figuren (Rückennummern, Stiefel, Haare, Kniegelenke, Schussbewegung), Ball-Textur, automatische Grafik-Anpassung bei niedriger FPS, Vereinsnamen im Menü *System* selbst änderbar.
- **Neu in v4:** Aufladbarer Schuss (Taste/Button halten, Schussbalken, höher/härter) mit Effet über die Joystick-Richtung beim Loslassen; *Sprint & Skill* (halten = Sprint, kurz tippen = Roulette-Drehung, schützt kurz vor Tacklings); Tor-Inszenierung mit Zeitlupe, Zoom auf den Torschützen, Bildschirm-Blitz, goldenem GOAL!-Schriftzug, Gold-Partikeln und zuckendem Tornetz; Coins (Start 50.000), Shop mit 10.000-Coins-Packs (5 Spieler, Walkout-Animation ab GES 88), Mein Team (Taktikfeld, Live-GES, Spiel gegen CPU, Verkaufen), Coins durch Siege auch in der Karriere. Spielerliste der Walkouts im Menü *System* editierbar.
- **Neu in v3:** Online-Freundschaftsspiel per WebRTC (Direktverbindung, Host rechnet, Gast sieht Snapshots; Austausch der Codes per Kopieren/Einfügen), deutscher Kommentator (Sprachausgabe des Geräts + Untertitel), Stadion-Atmosphäre, FC-Mobile-ähnliche Kamera/HUD, kontextabhängige Buttons (Pass/Steil/Schuss bzw. Slide/2nd DEF), 2nd-DEF-Pressing, Namensschild über dem gesteuerten Spieler, Trikotmuster, Werbebanden.
- Neues Speicherformat (v2): alte Spielstände aus Version 1 sind nicht kompatibel.
- **`index.html` ist eigenständig** (CSS und JavaScript eingebettet) – das Spiel läuft, sobald diese eine Datei plus `manifest.json`/`sw.js`/`assets/` im Repo-Root liegen.
- `src/build.py` baut `index.html` aus `src/` neu (`python3 src/build.py`).
- `src/` enthält dieselben Quellmodule getrennt (nur zum Weiterentwickeln, wird zur Laufzeit nicht geladen).
- `src/js/data.js` Vereine, Formationen, Spielergenerierung, Gesamtstärke-Formel
- `src/js/career.js` Karriere, Training, Saison, Transfers, Speichern (Format v1)
- `src/js/match.js` 3D-Match-Engine (Three.js), KI, Ballphysik, Torwart, Jubel
- `src/js/audio.js` WebAudio-Sounds (synthetisch, abschaltbar)
- `src/js/app.js` Oberfläche und Steuerung; `sw.js` + `manifest.json` PWA

## Steuerung
PC: WASD/Pfeile, J Pass, K Steilpass, L/Leertaste Schuss, Shift Sprint, U Grätsche, Q Spielerwechsel.
Mobil: Joystick links, Buttons rechts.

## Abhängigkeiten / Lizenzen
- Three.js r128 (MIT) per CDN (cdnjs, Fallback jsDelivr, jeweils Version 0.128/r128) (benötigt Internet beim ersten Laden)
- Alle Vereine, Namen und Spieler sind frei erfunden. Keine fremden Modelle, Wappen oder Audiodateien; Sounds werden per WebAudio erzeugt; der Kommentator nutzt die Sprachsynthese des Geräts (Web Speech API, Qualität je nach System). Eigene GLB-Modelle/Wappen können in `assets/` ergänzt werden.

## Echte Vereine, Spieler und Modelle
Offizielle Vereinsnamen, Wappen, Spielernamen und Fotorealismus-Modelle (wie in EA FC) sind lizenzpflichtig und werden hier nicht mitgeliefert. Vereinsnamen kannst du im Menü *System* selbst überschreiben. Eigene GLB-Modelle sind noch nicht eingebunden (nur prozedurale Figuren).

## Mein Team, Packs, Tasten
PC: L/Leertaste halten = Schuss laden, E = Skill, O = 2nd DEF. Die Pack-Spieler sind frei erfundene Fantasiefiguren; echte Namen und Werte (z. B. von dir gewünschte Stars) trägst du in *System → Packs: Top-Spieler anpassen* selbst ein. Die Pack-Animation ist reines CSS (keine Three.js-Vorschau der gezogenen Spieler).

## Online – Einschränkungen
Kein Matchmaking, keine Rangliste, keine Konten: dafür wäre ein Server nötig. Die Verbindung nutzt den öffentlichen Google-STUN-Server (stun.l.google.com) und kann hinter strengen Firewalls/Mobilfunk-NAT scheitern (kein TURN). Nicht über das echte Internet getestet, nur zwischen zwei Browserfenstern. Der Gast spielt mit leichter Verzögerung (Latenz zum Host).

## Bekannte Einschränkungen
- Spieler sind **prozedurale Figuren** (Zylinder/Quader) mit einfacher Lauf-, Grätsch-, Hecht- und Jubelanimation – keine GLB-Modelle, keine Rückennummern, kein Kopfball, keine Flanken, keine Elfmeter, keine Auswechslungen im Spiel, keine Abseitspfiffe (KI hält nur die Abseitslinie).
- Standards vereinfacht: Einwurf, Ecke, Abstoß, Freistoß werden als Neustart mit Ballübergabe umgesetzt; nur gelbe Karten; Seitenwechsel zur Halbzeit fehlt.
- Eine Liga (8 Vereine, 14 Spieltage), kein Pokal, keine internationalen Wettbewerbe, keine Leihen, Transfermarkt nur als Ansicht; Angebote anderer Vereine an den eigenen Spieler funktionieren.
- Aufstellung wird automatisch gewählt (kein Drag-and-Drop), Kapitän/Standardschützen fehlen.
- Grafik: einfach, keine Spielermodelle auf Niveau von EA FC.
- Nicht im Browser getestet (siehe Testprotokoll in der Chat-Antwort).
