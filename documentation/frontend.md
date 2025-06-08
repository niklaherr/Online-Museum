# Online Museum Frontend - Dokumentation

## Überblick

Das Online Museum Frontend ist eine moderne React-Webanwendung, die als digitale Plattform für kulturelle und kreative Inhalte dient. Benutzer können ihre eigenen "Items" (Kunstwerke, Sammlungen) hochladen, in Listen organisieren und die Inhalte anderer Nutzer entdecken.

## 🛠 Technologie-Stack

- **Framework**: React 18.2.0 mit TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **UI-Komponenten**: Tremor React 3.18.7
- **Icons**: Heroicons 2.2.0
- **Routing**: React Router DOM 7.5.3
- **HTTP-Client**: Axios 1.9.0
- **Animationen**: Framer Motion 12.11.0
- **Notifications**: Notyf 3.10.0
- **Datumsbehandlung**: date-fns 3.6.0

## 🏗 Projektstruktur

```
src/
├── components/           # Wiederverwendbare Komponenten
│   ├── easter-eggs/     # Snake Game Easter Egg
│   ├── editorial/       # Redaktionelle Listen
│   ├── gallery/         # Item-Galerie Komponenten
│   ├── helper/          # Utility-Komponenten (Loading, NoResults)
│   ├── itemList/        # Item-Listen Verwaltung
│   └── layout/          # Layout-Komponenten (Header, Footer, Sidebar)
├── interfaces/          # TypeScript Interface-Definitionen
├── pages/              # Hauptseiten der Anwendung
│   ├── admin/          # Admin-Funktionen
│   ├── auth/           # Authentifizierung
│   ├── gallery/        # Galerie-Ansichten
│   ├── itemlist/       # Listen-Verwaltung
│   └── legal/          # Rechtliche Seiten
└── services/           # API-Services und Business Logic
```

## 🎯 Hauptfunktionen

### 1. Authentifizierung & Benutzerverwaltung
- **Registrierung/Anmeldung**: Benutzerkonten mit Sicherheitsfragen
- **Passwort-Reset**: Über Sicherheitsfragen oder mit altem Passwort
- **Profilverwaltung**: Bearbeitung von Benutzerdaten
- **Rollenverwaltung**: Unterscheidung zwischen normalen Benutzern und Administratoren

### 2. Item-Management
- **Item-Erstellung**: Upload von Bildern mit Titel, Kategorie und Beschreibung
- **KI-unterstützte Beschreibungen**: Automatische Generierung via Mistral AI
- **Datenschutz-Einstellungen**: Private/öffentliche Items
- **CRUD-Operationen**: Vollständige Verwaltung der eigenen Items
- **Bildformat-Unterstützung**: PNG, JPG, GIF bis 10MB

### 3. Listen-System
- **Item-Listen**: Organisierung eigener Items in thematischen Sammlungen
- **Banner-Bilder**: Upload von Hauptbildern für Listen
- **Beschreibungen**: Mit KI-Unterstützung basierend auf enthaltenen Items
- **Sichtbarkeits-Kontrolle**: Private/öffentliche Listen

### 4. Redaktionelle Inhalte (Admin)
- **Kuratierte Sammlungen**: Administratoren können Items verschiedener Nutzer zusammenstellen
- **Suchfunktion**: Durchsuchung aller öffentlichen Items
- **Editorial-Management**: Erstellung und Verwaltung redaktioneller Listen

### 5. Galerie & Entdeckung
- **Kategorisierte Ansicht**: Items nach Kategorien gruppiert
- **Suchfunktion**: Volltextsuche in Titeln, Kategorien und Benutzernamen
- **Responsive Grid**: Anpassung an verschiedene Bildschirmgrößen
- **Item-Details**: Detailansichten mit Metadaten

### 6. Dashboard & Analytics
- **Persönliches Dashboard**: Übersicht über eigenen Aktivitäten
- **Statistiken**: Diagramme für Item- und Listen-Entwicklung
- **Aktivitäts-Feed**: Chronologische Übersicht aller Aktionen
- **Schnellaktionen**: Direkte Links zu häufig genutzten Funktionen

### 7. Admin-Funktionen
- **Benutzerverwaltung**: Suche und Verwaltung von Benutzern
- **Rechtevergabe**: Admin-Status zuweisen/entfernen
- **Support-System**: Verwaltung von Kontaktanfragen
- **Redaktions-Tools**: Erstellung kuratierter Inhalte

## 🎨 UI/UX Features

### Design-Prinzipien
- **Modern & Clean**: Gradients, Shadows, abgerundete Ecken
- **Responsive Design**: Mobile-first Ansatz
- **Accessibility**: Semantic HTML, Keyboard-Navigation
- **Loading States**: Spinner und Skeleton-Loading
- **Error Handling**: Benutzerfreundliche Fehlermeldungen

### Interaktive Elemente
- **Hover-Effekte**: Scale-Transformationen, Farbwechsel
- **Animationen**: Framer Motion für smooth Transitions
- **Toast-Notifications**: Erfolgs- und Fehlermeldungen
- **Modal-Dialoge**: Bestätigungen und Formulare
- **Progress-Tracking**: Status-Anzeigen für mehrstufige Prozesse

## 🔧 Services & API Integration

### UserService
- Authentifizierung und Session-Management
- Token-basierte Autorisierung
- Benutzerprofil-Verwaltung

### ItemService
- CRUD-Operationen für Items
- Listen-Management
- Datei-Upload mit FormData
- Aktivitäts-Tracking

### EditorialService
- Admin-spezifische Funktionen
- Item-Suche über alle Benutzer
- Redaktionelle Listen-Verwaltung

### ItemAssistantService
- KI-Integration mit Mistral AI
- Automatische Beschreibungsgenerierung
- Prompt-Engineering für verschiedene Kontexte

### AdminService
- Benutzerverwaltung
- Rechtevergabe
- System-Administration

### ContactFormService
- Support-Anfragen
- Status-Tracking
- Admin-Benachrichtigungen

## 🔒 Sicherheitsfeatures

- **JWT-basierte Authentifizierung**
- **Role-based Access Control (RBAC)**
- **Input-Validierung** auf Frontend und Backend
- **XSS-Schutz** durch React's eingebauten Schutz
- **Sichere Datei-Uploads** mit Typ- und Größenvalidierung
- **Session-Management** mit automatischem Logout

## 📱 Responsive Design

- **Mobile-First**: Optimiert für Smartphones
- **Tablet-Support**: Angepasste Layouts für mittlere Bildschirme
- **Desktop**: Vollständige Feature-Unterstützung
- **Touch-friendly**: Große Buttons und Gestures
- **Cross-Browser**: Unterstützung für moderne Browser

## 🎮 Easter Eggs

### Snake Game
- Vollständig spielbares Snake-Spiel in TypeScript
- Versteckt hinter dem "PDF-Download" Link in der Hilfe
- Responsive Design mit Warnung für kleine Bildschirme
- Retro-Gaming Nostalgie als Überraschung für Nutzer

## 🚀 Performance-Optimierungen

- **Code-Splitting**: Lazy Loading für Routes
- **Image-Optimierung**: Responsive Images, WebP-Support
- **Caching**: Browser-Caching für statische Assets
- **Bundle-Optimierung**: Tree-shaking, minimierte Builds
- **Error Boundaries**: Graceful Degradation bei Fehlern

## 🔄 State Management

- **React Hooks**: useState, useEffect für lokalen State
- **Context API**: Benutzer-Authentifizierung
- **Service Layer**: Zentrale Business Logic
- **Local Storage**: Session-Persistierung
- **Error Handling**: Einheitliche Fehlerbehandlung

## 📝 Entwicklungsrichtlinien

### Code-Organisation
- **Komponenten-basiert**: Modulare, wiederverwendbare Komponenten
- **TypeScript**: Typsichere Entwicklung
- **Consistent Naming**: Klare Benennungskonventionen
- **Comments**: Dokumentation komplexer Logik

### Best Practices
- **Single Responsibility**: Eine Aufgabe pro Komponente
- **Props Interface**: Typisierte Komponenten-Props
- **Error Boundaries**: Fehler-Isolation
- **Accessibility**: WCAG-konforme Entwicklung

Das Online Museum Frontend bietet eine umfassende, moderne Lösung für eine digitale Kulturplattform mit professionellem UI/UX Design, robuster Architektur und erweiterbaren Features.