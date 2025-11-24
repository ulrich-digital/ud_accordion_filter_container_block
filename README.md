# UD Block: Accordion Filter Container

Ein WordPress-Block, der als Container für mehrere UD-Accordion-Blöcke dient und deren Anzeige dynamisch anhand von Filter-Interaktionen steuert.
Der Block erweitert bestehende Filtermechanismen um ein optionales, zusätzliches Verhalten für Accordions, ohne das ursprüngliche System zu ersetzen.

## Funktionen
- Container-Block für mehrere ud/accordion-block-Instanzen
- Reagiert auf externe Filter-Trigger (z. B. Buttons, Kategorien, Attribute)
- Zusätzliche Klasse .ud-accordion-filter-active für erweitertes Verhalten
- Geschlossene Accordions können optional klickbar werden, wenn der Filtermodus aktiv ist
- Nahtlose Erweiterung des bestehenden Filter-Systems (keine Ablösung)
- Frontend-Optimierung über frontend.js und frontend.css
- Editor-Darstellung mit Hinweisen und Container-Styling

## Technische Details
### Block-Definition
Der Block wird über block.json registriert und bindet eigene Editor- und Frontend-Dateien ein.

### Wesentliche Dateien
- block.json – Block-Definition (Name, Scripts, Styles, Meta)
- index.js – Editor-Logik
- style.css – Editor-Styles
- frontend.js – Filter-Erweiterung für Accordions
- frontend.css – Frontend-Styles für Filter-Ausblendungen und Übergänge

### Relevante CSS-Klassen
- .accordion-block-container – Grundcontainer
- .ud-accordion-filter-active – aktiviert erweitertes Klickverhalten
- .wp-block-ud-accordion-block.is-filtered-out – ausgeblendete Accordions

### Verhalten im Frontend
- Bei aktivem Filtermodus kann der Container automatisch alle geschlossenen Accordions mit cursor: pointer markieren.
- Accordions, die nicht den Filterkriterien entsprechen, werden ausgeblendet (Opacity 0, kein Layout-Platz, keine Pointer-Events).
- Verschachtelte Accordions bleiben funktionsfähig.

### Beispiel (vereinfachtes Markup)
```
<div class="accordion-block-container ud-accordion-filter-active">
    <div class="wp-block-ud-accordion-block">
        …
    </div>
    <div class="wp-block-ud-accordion-block">
        …
    </div>
</div>
```

## Installation
- Plugin-Ordner in wp-content/plugins/ ablegen
- Plugin in WordPress aktivieren
- Im Site-Editor oder Block-Editor den Block Accordion Filter Container hinzufügen
- Beliebig viele UD-Accordion-Blöcke einfügen

## Anforderungen
- WordPress 6.4+
- Gutenberg / Block-Editor aktiviert
- UD Accordion Block installiert (Abhängigkeit)

## Autor
[ulrich.digital gmbh](https://ulrich.digital)

## Lizenz

GPL v2 or later  
https://www.gnu.org/licenses/gpl-2.0.html
