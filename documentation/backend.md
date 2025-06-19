# Online Museum Backend - API-Dokumentation

## Überblick

Das Online Museum Backend bildet das technische Rückgrat der digitalen Kulturplattform und stellt eine robuste Node.js-basierte API bereit, die umfassende Funktionalitäten für Benutzerauthentifizierung, Content-Management und administrative Verwaltung bietet. Die Architektur basiert auf Express.js und PostgreSQL, wobei besonderer Fokus auf Sicherheit, Skalierbarkeit und Benutzerfreundlichkeit gelegt wurde.

## 🚀 Kern-Features

Das Backend implementiert eine JWT-basierte Benutzerauthentifizierung mit erweiterten Sicherheitsfeatures, ein umfassendes Item-Management-System mit Bild-Upload-Funktionalität und ein flexibles Listen-System für die Organisation von Inhalten. Redaktionelle Listen ermöglichen Administratoren die Kuratierung hochwertiger Sammlungen, während ein integriertes Aktivitätsverfolgungssystem für Transparenz und Audit-Zwecke sorgt.

Ein Kontaktformular-System erleichtert die Kommunikation zwischen Benutzern und Administratoren. Administrative Funktionen bieten umfassende Benutzerverwaltung, während SQL-Injection-Schutz durch Pattern-Erkennung und granulare Datenschutz-Einstellungen für private und öffentliche Items die Sicherheit gewährleisten.

## 👥 Benutzertypen und Berechtigungen

### Berechtigungsübersicht

| Funktion | Anonyme Benutzer | Registrierte Benutzer | Administratoren |
|----------|:----------------:|:--------------------:|:---------------:|
| **Authentifizierung & Zugang** |
| Landing Page betrachten | ✅ | ✅ | ✅ |
| Registrierung | ✅ | ❌ | ❌ |
| Anmeldung | ✅ | ✅ | ✅ |
| Passwort-Reset (Sicherheitsfragen) | ✅ | ✅ | ✅ |
| Passwort ändern (mit altem Passwort) | ❌ | ✅ | ✅ |
| **Item-Management** |
| Öffentliche Items ansehen | ✅ | ✅ | ✅ |
| Items erstellen | ❌ | ✅ | ✅ |
| Items bearbeiten | ❌ | 🔒 | 🔒 |
| Items löschen | ❌ | 🔒 | 🔒 |
| Items durchsuchen | ❌ | ✅ | ✅ |
| Private Items ansehen | ❌ | 🔒 | 🔒 |
| **Listen-Management** |
| Öffentliche Listen ansehen | ❌ | ✅ | ✅ |
| Listen erstellen | ❌ | ✅ | ✅ |
| Listen bearbeiten | ❌ | 🔒 | 🔒 |
| Listen löschen | ❌ | 🔒 | 🔒 |
| Private Listen ansehen | ❌ | 🔒 | 🔒 |
| **Redaktionelle Listen** |
| Redaktionelle Listen ansehen | ❌ | ✅ | ✅ |
| Redaktionelle Listen erstellen | ❌ | ❌ | ✅ |
| Redaktionelle Listen bearbeiten | ❌ | ❌ | ✅ |
| Redaktionelle Listen löschen | ❌ | ❌ | ✅ |
| **Profil & Account** |
| Profil bearbeiten | ❌ | 🔒 | 🔒 |
| Account löschen | ❌ | 🔒 | 🔒 |
| Aktivitätshistorie einsehen | ❌ | 🔒 | 🔒 |
| **Kommunikation** |
| Kontaktformular einreichen | ✅ | ✅ | ✅ |
| Kontaktanfragen verwalten | ❌ | ❌ | ✅ |
| **Administrative Funktionen** |
| Benutzer suchen | ❌ | ❌ | ✅ |
| Admin-Rechte vergeben/entziehen | ❌ | ❌ | ✅ |
| Alle Administratoren anzeigen | ❌ | ❌ | ✅ |
| Support-Anfragen bearbeiten | ❌ | ❌ | ✅ |

**Legende:**
- ✅ = Vollzugriff verfügbar
- ❌ = Nicht verfügbar
- 🔒 = Nur eigene Inhalte/beschränkter Zugriff

### Detaillierte Beschreibung der Benutzertypen

**Anonyme Benutzer** können die Landing Page mit öffentlichen Items betrachten, Kontaktformulare einreichen und sich registrieren oder anmelden. Zudem steht ihnen der Passwort-Reset über Sicherheitsfragen zur Verfügung.

**Registrierte Benutzer** erhalten umfassende Content-Management-Funktionalitäten. Sie können Items erstellen, bearbeiten und löschen, eigene Item-Listen verwalten und zwischen privaten und öffentlichen Inhalten wählen. Das System ermöglicht das Durchsuchen aller öffentlichen Inhalte anderer Benutzer, die Verwaltung des eigenen Profils und das Zurücksetzen des Passworts. Zusätzlich können sie ihre Aktivitätshistorie einsehen und ihr Konto selbstständig löschen.

**Administratoren** verfügen über alle Funktionen registrierter Benutzer plus erweiterte administrative Rechte. Sie können redaktionelle Listen erstellen und verwalten, alle Benutzer suchen und deren Status verwalten, Admin-Rechte vergeben oder entziehen und Kontaktformular-Anfragen bearbeiten. Zusätzlich haben sie Zugriff auf erweiterte Such- und Verwaltungsfunktionen für die gesamte Plattform.

## 📁 Projektstruktur

```
backend/
├── middleware/
│   └── auth.js           # JWT-Authentifizierung
├── routes/
│   ├── auth.js          # Authentifizierung (Login, Register, Password Reset)
│   ├── users.js         # Benutzerverwaltung
│   ├── items.js         # Item-Management
│   ├── itemLists.js     # Item-Listen-Management
│   ├── editorials.js    # Redaktionelle Listen
│   ├── activities.js    # Aktivitätsverfolgung
│   ├── contact-form.js  # Kontaktformular
│   └── admin.js         # Administrative Funktionen
├── services/
│   ├── activityService.js    # Aktivitätserstellung
│   └── injectionService.js   # SQL-Injection-Schutz
├── server.js            # Hauptanwendungsdatei
├── Dockerfile          # Container-Konfiguration
└── package.json        # Abhängigkeiten
```

## 📋 API-Endpunkte

### 🔐 Authentifizierung (`/routes/auth.js`)

| Methode | Endpunkt | Beschreibung | Auth erforderlich |
|---------|----------|--------------|-------------------|
| `POST` | `/register` | Neuen Benutzer registrieren | ❌ |
| `POST` | `/login` | Benutzer anmelden | ❌ |
| `GET` | `/security-question/:username` | Sicherheitsfrage abrufen | ❌ |
| `POST` | `/verify-security-question` | Sicherheitsantwort überprüfen | ❌ |
| `POST` | `/reset-password` | Passwort mit Token zurücksetzen | ❌ |
| `PUT` | `/reset-password-with-old-password` | Passwort mit altem Passwort ändern | ✅ |

**Beispiel - Registrierung:**
```json
POST /register
{
  "username": "testuser",
  "password": "securepassword",
  "securityQuestion": "Wie hieß Ihr erstes Haustier?",
  "securityAnswer": "Bello"
}
```

### 👤 Benutzerverwaltung (`/routes/users.js`)

| Methode | Endpunkt | Beschreibung | Auth erforderlich |
|---------|----------|--------------|-------------------|
| `DELETE` | `/users` | Eigenen Benutzer löschen | ✅ |

### 🎨 Item-Management (`/routes/items.js`)

Das Item-Management bildet das Herzstück der Content-Verwaltung und bietet umfassende CRUD-Operationen für digitale Inhalte mit erweiterten Such- und Filterfunktionen.

| Methode | Endpunkt | Beschreibung | Auth erforderlich |
|---------|----------|--------------|-------------------|
| `GET` | `/items/no-auth` | Öffentliche Items für Landing Page | ❌ |
| `GET` | `/items` | Items mit Filtern abrufen | ✅ |
| `GET` | `/items/:id` | Einzelnes Item abrufen | ✅ |
| `POST` | `/items` | Neues Item erstellen (mit Bild) | ✅ |
| `PUT` | `/items/:id` | Item aktualisieren | ✅ |
| `DELETE` | `/items/:id` | Item löschen | ✅ |
| `GET` | `/items-search` | Items durchsuchen | ✅ |

**Verfügbare Filter für `/items`:**
- `title`, `description`, `category`, `username` (ILIKE-Suche)
- `isprivate`, `id`, `user_id`, `entered_on` (exakte Übereinstimmung)
- `exclude_user_id` (Benutzer ausschließen)

**Beispiel - Item erstellen:**
```javascript
POST /items
Content-Type: multipart/form-data

title: "Vintage Camera"
description: "A beautiful vintage camera from 1950"
category: "Photography"
isprivate: false
image: [file]
```

### 📝 Item-Listen (`/routes/itemLists.js`)

Das Listen-System ermöglicht die Organisation von Items in thematischen Sammlungen mit flexiblen Verwaltungsoptionen und Datenschutz-Einstellungen.

| Methode | Endpunkt | Beschreibung | Auth erforderlich |
|---------|----------|--------------|-------------------|
| `GET` | `/item-lists` | Alle Item-Listen mit Filtern | ✅ |
| `GET` | `/item-lists/:id` | Einzelne Item-Liste | ✅ |
| `GET` | `/item-lists/:item_list_id/items` | Items einer Liste | ✅ |
| `POST` | `/item-lists` | Neue Item-Liste erstellen | ✅ |
| `PUT` | `/item-lists/:id` | Item-Liste aktualisieren | ✅ |
| `DELETE` | `/item-lists/:id` | Item-Liste löschen | ✅ |

**Beispiel - Item-Liste erstellen:**
```javascript
POST /item-lists
Content-Type: multipart/form-data

title: "My Favorite Cameras"
description: "A collection of my favorite vintage cameras"
item_ids: [1, 2, 3, 4]
is_private: false
main_image: [file]
```

### 📰 Redaktionelle Listen (`/routes/editorials.js`)

Redaktionelle Listen bieten Administratoren die Möglichkeit, kuratierte Sammlungen zu erstellen, die hochwertige, thematisch zusammenhängende Inhalte präsentieren.

| Methode | Endpunkt | Beschreibung | Auth erforderlich | Admin erforderlich |
|---------|----------|--------------|-------------------|--------------------|
| `GET` | `/editorial-lists` | Alle redaktionellen Listen | ✅ | ❌ |
| `GET` | `/editorial-lists/:id` | Einzelne redaktionelle Liste | ✅ | ❌ |
| `GET` | `/editorial-lists/:editorial_id/items` | Items einer redaktionellen Liste | ✅ | ❌ |
| `POST` | `/editorial-lists` | Neue redaktionelle Liste | ✅ | ✅ |
| `PUT` | `/editorial-lists/:id` | Redaktionelle Liste aktualisieren | ✅ | ✅ |
| `DELETE` | `/editorial-lists/:id` | Redaktionelle Liste löschen | ✅ | ✅ |

### 📊 Aktivitäten (`/routes/activities.js`)

Das Aktivitätssystem dokumentiert Benutzeraktionen für Transparenz und ermöglicht die Nachverfolgung von Änderungen am Content.

| Methode | Endpunkt | Beschreibung | Auth erforderlich |
|---------|----------|--------------|-------------------|
| `GET` | `/activities` | Letzte 5 Aktivitäten des Benutzers | ✅ |

### 📧 Kontaktformular (`/routes/contact-form.js`)

Das Kontaktformular-System erleichtert die Kommunikation zwischen Benutzern und dem Support-Team mit Status-Tracking und administrativer Verwaltung.

| Methode | Endpunkt | Beschreibung | Auth erforderlich | Admin erforderlich |
|---------|----------|--------------|-------------------|--------------------|
| `POST` | `/contact-form` | Kontaktformular einreichen | ❌ | ❌ |
| `GET` | `/contact-form` | Alle Kontaktanfragen | ✅ | ✅ |
| `PUT` | `/contact-form/:id/status` | Status aktualisieren | ✅ | ✅ |

**Verfügbare Status:** `new`, `in_progress`, `completed`

### 👑 Administrative Funktionen (`/routes/admin.js`)

Administrative Funktionen bieten umfassende Benutzerverwaltung und erweiterte Systemkontrolle für Plattform-Administratoren.

| Methode | Endpunkt | Beschreibung | Auth erforderlich | Admin erforderlich |
|---------|----------|--------------|-------------------|--------------------|
| `GET` | `/admin/search` | Benutzer suchen | ✅ | ✅ |
| `PUT` | `/admin/:id` | Admin-Status setzen | ✅ | ✅ |
| `GET` | `/admin` | Alle Administratoren | ✅ | ✅ |

## 🔒 Sicherheitsarchitektur

### JWT-Authentifizierung
Das Authentifizierungssystem basiert auf JSON Web Tokens mit einer Gültigkeitsdauer von einer Stunde für optimale Sicherheit bei gleichzeitiger Benutzerfreundlichkeit. Passwörter werden mit bcrypt sicher gehasht, während eine Middleware-basierte Authentifizierung konsistente Sicherheitsprüfungen gewährleistet.

### SQL-Injection-Schutz
Das System implementiert einen mehrstufigen Schutz gegen SQL-Injection-Angriffe durch Pattern-basierte Erkennung verdächtiger Eingaben:

```javascript
// Erkannte Patterns:
- or1=1, and1=1
- '; --, "; --
- union select
- sleep(), benchmark()
- drop table/database
- xp_cmdshell, exec/execute
- information_schema
- load_file(), into outfile
```

### Datenschutz und Zugriffskontrollen
Das granulare Datenschutzsystem ermöglicht private und öffentliche Items, wobei Benutzer nur ihre eigenen privaten Inhalte sehen können. Cascading Deletes gewährleisten Datenintegrität bei der Löschung von Benutzern oder Inhalten, während rollenbasierte Zugriffskontrolle verschiedene Berechtigungsebenen implementiert.

## 🏗 Datenbankarchitektur

### Haupttabellen
Das Datenbankschema ist auf Skalierbarkeit und Datenintegrität ausgelegt. Die `users`-Tabelle speichert Benutzerinformationen mit Sicherheitsfragen für Passwort-Recovery. Die `item`-Tabelle verwaltet alle digitalen Inhalte mit Bildern und Kategorisierung, während `item_list` benutzerdefinierte Sammlungen organisiert.

Die `editorial`-Tabelle ermöglicht redaktionelle Kuratierungen durch Administratoren. Das `activities`-System erstellt einen umfassenden Audit-Trail für alle Benutzeraktionen, und die `contact_form`-Tabelle verwaltet Support-Anfragen mit Status-Tracking.

### Verknüpfungstabellen
- `item_itemlist` - Many-to-Many-Beziehung zwischen Items und Item-Listen
- `item_editorial` - Many-to-Many-Beziehung zwischen Items und redaktionellen Listen

## 🐛 Debugging & Monitoring

### Health Check und Systemüberwachung
Ein einfacher Health-Check-Endpunkt ermöglicht die Überwachung der Systemverfügbarkeit:

```bash
curl http://localhost:3001/health
```

Das Logging-System umfasst Console-basiertes Error-Logging, Aktivitätsverfolgung in der Datenbank für Audit-Zwecke und automatische Protokollierung von SQL-Injection-Versuchen für Sicherheitsanalysen.

## 🚨 Bekannte Limitierungen und Verbesserungspotential

### Aktuelle Einschränkungen
Der SQL-Injection-Schutz basiert auf Pattern-Erkennung und könnte fortgeschrittene Angriffe übersehen. Rate Limiting ist nicht implementiert, was potenzielle DDoS-Vulnerabilitäten schafft. Das Logging-System ist rudimentär und könnte strukturierter und umfassender gestaltet werden. Automatisierte Tests fehlen vollständig, was die Code-Qualität und Wartbarkeit beeinträchtigt.

## 🔮 Erweiterungsmöglichkeiten

### Geplante Verbesserungen
Die Migration zu Cloud Storage (AWS S3, Azure Blob) würde Skalierbarkeit und Performance verbessern. Caching-Mechanismen für häufig abgerufene Daten könnten die Antwortzeiten erheblich reduzieren. Eine OpenAPI/Swagger-Integration würde die API-Dokumentation automatisieren und verbessern.

Die Implementierung von Unit- und Integration-Tests würde Code-Qualität und Zuverlässigkeit sicherstellen. Rate Limiting und erweiterte Sicherheitsfeatures würden die Plattform gegen verschiedene Angriffsvektoren absichern.

Das Online Museum Backend bietet eine solide, sicherheitsorientierte Grundlage für die digitale Kulturplattform mit klaren Erweiterungsmöglichkeiten für zukünftige Anforderungen.
