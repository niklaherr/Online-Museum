# Online Museum Frontend - Dokumentation

## Überblick

Das Online Museum Frontend ist eine moderne React-Webanwendung, die als digitale Plattform für kulturelle und kreative Inhalte dient. Benutzer können ihre eigenen "Items" (Kunstwerke, Sammlungen) hochladen, in Listen organisieren und die Inhalte anderer Nutzer entdecken.

## 🏗 Projektstruktur

```
src/
├── components/           # Wiederverwendbare Komponenten
│   ├── easter-eggs/     # Snake Game Easter Egg
│   ├── helper/          # Utility-Komponenten (Loading, NoResults)
│   └── layout/          # Layout-Komponenten (Header, Footer, Sidebar)
├── interfaces/          # TypeScript Interface-Definitionen
├── pages/              # Hauptseiten der Anwendung
│   ├── admin/          # Admin-Funktionen
│   ├── auth/           # Authentifizierung
│   ├── editorial/      # Funktionen für kuratierte Listen
│   ├── gallery/        # Galerie-Ansichten
│   ├── itemlist/       # Listen-Verwaltung
│   └── legal/          # Rechtliche Seiten
└── services/           # API-Services und Business Logic
```

---

## 🎯 Hauptfunktionen

### 1. Authentifizierung & Benutzerverwaltung
Das Authentifizierungssystem bietet umfassende Benutzerkonten-Verwaltung mit Sicherheitsfragen für die Registrierung und einen robusten Passwort-Reset-Mechanismus. Benutzer können ihr Passwort sowohl über Sicherheitsfragen als auch mit dem aktuellen Passwort zurücksetzen. Die Profilverwaltung ermöglicht die Bearbeitung von Benutzerdaten, während die Rollenverwaltung zwischen normalen Benutzern und Administratoren unterscheidet.

### 2. Item-Management
Das Herzstück der Anwendung ermöglicht den Upload von Bildern mit Titel, Kategorie und Beschreibung. Ein besonderes Feature ist die KI-unterstützte Beschreibungsgenerierung über Mistral AI, die automatisch relevante Beschreibungen basierend auf Titel und Kategorie erstellt. Das System unterstützt:

- Datenschutz-Einstellungen für private/öffentliche Items
- Vollständige CRUD-Operationen für eigene Items
- Bildformat-Unterstützung: PNG, JPG, GIF bis 10MB

### 3. Listen-System
Das innovative Listen-System organisiert Items in thematischen Sammlungen, die als digitale Erinnerungsräume fungieren. Benutzer können Banner-Bilder für ihre Listen hochladen und Beschreibungen mit KI-Unterstützung erstellen lassen. Die Sichtbarkeits-Kontrolle ermöglicht private oder öffentliche Listen, wobei die KI-Beschreibungen basierend auf den enthaltenen Items generiert werden.

### 4. Redaktionelle Inhalte (Admin)
Administratoren können kuratierte Sammlungen erstellen, die verschiedene Items zusammenstellen und als redaktionellen Inhalt veröffentlichen. Eine umfassende Suchfunktion durchsucht alle öffentlichen Items, während das Editorial-Management die Erstellung und Verwaltung redaktioneller Listen ermöglicht.

### 5. Galerie & Entdeckung
Die Galerie präsentiert Items in einer kategorisierten Ansicht mit responsivem Grid-Layout, das sich automatisch an verschiedene Bildschirmgrößen anpasst. Eine Volltextsuche durchsucht Titel, Kategorien und Benutzernamen, während Item-Details umfassende Metadaten anzeigen.

### 6. Dashboard & Analytics
Das personalisierte Dashboard bietet eine zentrale Übersicht mit Statistiken und interaktiven Diagrammen für Item- und Listen-Entwicklung. Ein chronologischer Aktivitäts-Feed dokumentiert alle Benutzeraktionen, während Schnellaktionen direkten Zugang zu häufig genutzten Funktionen bieten.

### 7. Admin-Funktionen
Das umfassende Admin-Panel ermöglicht Benutzerverwaltung mit Such- und Verwaltungsfunktionen, Rechtevergabe für Admin-Status, ein Support-System für Kontaktanfragen und Redaktions-Tools für kuratierte Inhalte.

## 🎨 UI/UX Features

### Design-Prinzipien
Das Design folgt modernen Prinzipien mit Gradients, Schatten und abgerundeten Ecken für eine zeitgemäße Ästhetik. Der Mobile-First-Ansatz gewährleistet optimale Darstellung auf allen Geräten, während Loading States mit Spinner und Skeleton-Loading für wahrgenommene Performance-Verbesserung sorgen. Das Error Handling über die Notyf Library bietet benutzerfreundliche Fehlermeldungen.

### Interaktive Elemente
- Hover-Effekte mit Scale-Transformationen und Farbwechseln
- Toast-Notifications für Erfolgs- und Fehlermeldungen
- Modal-Dialoge für Bestätigungen und Formulare
- Progress-Tracking mit Status-Anzeigen für mehrstufige Prozesse

## 🔧 Services & API Integration

Die Service-Layer abstrahiert die gesamte Business Logic von den UI-Komponenten und stellt eine saubere Trennung zwischen Datenverarbeitung und Präsentation sicher. Der **UserService** handhabt Authentifizierung und Session-Management mit Token-basierter Autorisierung und Benutzerprofil-Verwaltung. Der **ItemService** verwaltet CRUD-Operationen für Items, Listen-Management, Datei-Upload mit FormData und Aktivitäts-Tracking.

Der **EditorialService** stellt Admin-spezifische Funktionen bereit, einschließlich Item-Suche über alle Benutzer und redaktionelle Listen-Verwaltung. Die KI-Integration erfolgt über den **ItemAssistantService** mit Mistral AI für automatische Beschreibungsgenerierung und Prompt-Engineering für verschiedene Kontexte. Weitere Services umfassen **AdminService** für Benutzerverwaltung und **ContactFormService** für Support-Anfragen.

## 🔒 Sicherheitsfeatures

Das Sicherheitskonzept basiert auf JWT-basierter Authentifizierung mit Role-based Access Control (RBAC) für verschiedene Benutzerrollen. Input-Validierung erfolgt sowohl auf Frontend- als auch Backend-Ebene, während React's eingebauter XSS-Schutz zusätzliche Sicherheit bietet. Sichere Datei-Uploads mit Typ- und Größenvalidierung verhindern schädliche Uploads, und das Session-Management mit automatischem Logout sorgt für sichere Benutzersitzungen.

## 📱 Responsive Design

Die Anwendung ist vollständig responsive gestaltet und folgt einem Mobile-First-Ansatz für optimale Smartphone-Nutzung. Tablet-Support bietet angepasste Layouts für mittlere Bildschirme, während Desktop-Versionen vollständige Feature-Unterstützung gewährleisten.

## 🎮 Easter Eggs

### Snake Game
Ein vollständig spielbares Snake-Spiel in TypeScript ist als Easter Egg hinter dem "PDF-Download" Link in der Hilfe versteckt. Das responsive Design warnt vor kleinen Bildschirmen und bietet Retro-Gaming-Nostalgie als Überraschung für Nutzer.

## 🔄 State Management

Das State Management nutzt React Hooks (useState, useEffect) für lokalen State und die Context API für Benutzer-Authentifizierung. Die Service Layer stellt zentrale Business Logic bereit, während Local Storage für Session-Persistierung und einheitliches Error Handling für konsistente Fehlerbehandlung sorgt.

## 📝 Entwicklungsrichtlinien

### Code-Organisation
Die Entwicklung folgt bewährten Praktiken mit komponenten-basierter, modularer Architektur und wiederverwendbaren Komponenten. TypeScript gewährleistet typsichere Entwicklung, während konsistente Benennungskonventionen und Kommentierung die Code-Qualität sicherstellen.

### Best Practices
- **Single Responsibility**: Eine Aufgabe pro Komponente
- **Props Interface**: Typisierte Komponenten-Props
- **Error Boundaries**: Fehler-Isolation für robuste Anwendungen
- **Accessibility**: WCAG-konforme Entwicklung für barrierefreie Nutzung

Das Online Museum Frontend bietet eine umfassende, moderne Lösung für eine digitale Kulturplattform mit professionellem UI/UX Design, robuster Architektur und erweiterbaren Features.
