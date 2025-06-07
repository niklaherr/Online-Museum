# 🖼️ Online Museum

Ein digitales Museum, das Benutzern ermöglicht, kulturelle und kreative Inhalte zu sammeln, zu organisieren und zu teilen. Die Plattform bietet **private und öffentliche Sammlungen** und **redaktionelle Inhalte**.

---

## 🎯 Hauptfunktionen

### 👤 Benutzerverwaltung

* **Registrierung & Anmeldung:** Sichere Kontoerstellung mit Sicherheitsfragen
* **Passwort-Reset:** Wiederherstellung über Sicherheitsfragen
* **Profilverwaltung:** Passwort ändern, Konto löschen
* **Admin-System:** Erweiterte Berechtigungen für Administratoren

### 🗂️ Inhaltsverwaltung

* **Items erstellen:** Upload von Bildern mit Titel, Beschreibung und Kategorisierung
* **KI-Unterstützung:** Automatische Beschreibung mit *Mistral AI*
* **Privatsphäre-Einstellungen:** Private oder öffentliche Items
* **Bildbearbeitung:** Upload & Verwaltung von Bilddateien

### 🧾 Listen & Sammlungen

* **Item-Listen:** Eigene thematische Sammlungen erstellen
* **Redaktionelle Listen:** Von Admins kuratierte Inhalte
* **Sichtbarkeit:** Öffentlich oder privat
* **Kollaborative Kuration:** Admins können Items aller User verwenden

### 🔍 Such- & Entdeckung

* **Erweiterte Suche:** Nach Titel, Kategorie, Benutzer
* **Filter:** Vielfältige Filteroptionen
* **Dashboard:** Übersicht über Aktivitäten & Statistiken
* **Trending:** Beliebte und neue Inhalte entdecken

### 🛠️ Admin-Funktionen

* **Benutzerverwaltung:** Rechte vergeben/entziehen
* **Redaktion:** Kuratierte Listen verwalten
* **Support:** Kontaktanfragen bearbeiten
* **Systemüberwachung:** Logs und Statistiken

### ✨ Zusätzliche Features

* **Kontaktformular:** Mit Statusverfolgung
* **Responsive Design:** Für Desktop und Mobile
* **Mehrsprachigkeit:** Vorbereitet für Internationalisierung
* **Easter Eggs:** Versteckte Funktionen (z. B. Snake Game)

---

## 🏗️ Technologie-Stack

### Frontend

* React 18 + TypeScript
* Tailwind CSS
* Tremor UI-Komponenten
* React Router
* Notyf (Benachrichtigungen)

### Backend

* Node.js mit Express
* PostgreSQL
* JWT für Authentifizierung
* Multer für Datei-Uploads
* bcrypt für Passwort-Hashing

### KI-Integration

* Mistral AI für automatische Beschreibungen
* Geplante automatische Kategorisierung

---

## 📋 Voraussetzungen

* Node.js (v18+)
* (Docker & Docker Compose)
* Git

---

## 🚀 Installation & Setup

### Docker Compose als einfache Alternative, ansonsten ab Schritt 1 folgen

```bash
# Alle Services starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f
```

### 1. Repository klonen

```bash
git clone https://github.com/your-username/online-museum.git
cd online-museum
```

### 2. Datenbank starten
```bash
cd db
docker build -t online-museum-db .
docker run --name museum-db -dp 5432:5432 museum-db
```
Wenn die PostgreSQl-Datenbank nicht über Docker gestartet werden sollen, müssen die Daten für die Verbindung zur Datenbank im Backend angepasst werden. Die Datei ist zu finden unter /backend/server.js
In der Dockerfile unter /db können ebenfalls eigene Passwörter angegeben werden. Welche dann ebenfalls im Backend angepasst werden müssen. Wenn die Dockerfile nicht verwendet wird, dann muss ebenfalls die /db/init_db.sql Datei als Initialisierungsskript der Datenbank ausgeführt werden. Ebenso werden dann keine Beispieldaten über /db/test_data.sql automatisch geladen

### 3. Backend starten

```bash
cd backend
npm install
node server.js
```

### 4. Frontend starten

```bash
cd backend
npm install
npm start
```

**Zugänglichkeit:**

* Frontend: `http://localhost:3000` -> `http://localhost:80` bei der Nutzung von Docker Compose
* Backend: `http://localhost:3001`
* DB: `localhost:5432`

## 🎮 Verwendung

### Erste Schritte

1. Registrierung: `http://localhost:3000 oder http://localhost:80 → Registrieren`
2. Profil anlegen: Benutzername & Passwort
3. Sicherheitsfrage ausfüllen
4. Erstes Item hochladen
5. Eigene Liste erstellen

### Admin-Zugang aktivieren

1. Mit dem Nutzer adminuser und dem Passwort 1234567 anmelden
2. Den selbst erstellten Nutzer als Admin hinzufügen und dann den adminuser löschen über die normale Löschfunktion

### KI-Funktionen nutzen

* Bei Item-Erstellung auf **"KI-Beschreibung generieren"** klicken
---

## 📚 API-Dokumentation

# Museum Management System - Backend

Ein Express.js-basiertes Backend für ein digitales Museum-Management-System mit Benutzerauthentifizierung, Item-Management und administrativen Funktionen.

## 🚀 Features

- **Benutzerauthentifizierung** mit JWT-Tokens
- **Item-Management** mit Bild-Upload-Funktionalität
- **Item-Listen** für die Organisation von Items
- **Redaktionelle Listen** (Admin-Feature)
- **Aktivitätsverfolgung** für Audit-Zwecke
- **Kontaktformular-System**
- **Administrative Funktionen** für Benutzerverwaltung
- **SQL-Injection-Schutz** durch Pattern-Erkennung
- **Datenschutz** durch private/öffentliche Item-Einstellungen


## 📁 Aufbau

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

| Methode | Endpunkt | Beschreibung | Auth erforderlich | Admin erforderlich |
|---------|----------|--------------|-------------------|--------------------|
| `GET` | `/editorial-lists` | Alle redaktionellen Listen | ✅ | ❌ |
| `GET` | `/editorial-lists/:id` | Einzelne redaktionelle Liste | ✅ | ❌ |
| `GET` | `/editorial-lists/:editorial_id/items` | Items einer redaktionellen Liste | ✅ | ❌ |
| `POST` | `/editorial-lists` | Neue redaktionelle Liste | ✅ | ✅ |
| `PUT` | `/editorial-lists/:id` | Redaktionelle Liste aktualisieren | ✅ | ✅ |
| `DELETE` | `/editorial-lists/:id` | Redaktionelle Liste löschen | ✅ | ✅ |

### 📊 Aktivitäten (`/routes/activities.js`)

| Methode | Endpunkt | Beschreibung | Auth erforderlich |
|---------|----------|--------------|-------------------|
| `GET` | `/activities` | Letzte 5 Aktivitäten des Benutzers | ✅ |

### 📧 Kontaktformular (`/routes/contact-form.js`)

| Methode | Endpunkt | Beschreibung | Auth erforderlich | Admin erforderlich |
|---------|----------|--------------|-------------------|--------------------|
| `POST` | `/contact-form` | Kontaktformular einreichen | ❌ | ❌ |
| `GET` | `/contact-form` | Alle Kontaktanfragen | ✅ | ✅ |
| `PUT` | `/contact-form/:id/status` | Status aktualisieren | ✅ | ✅ |

**Verfügbare Status:** `new`, `in_progress`, `completed`

### 👑 Administrative Funktionen (`/routes/admin.js`)

| Methode | Endpunkt | Beschreibung | Auth erforderlich | Admin erforderlich |
|---------|----------|--------------|-------------------|--------------------|
| `GET` | `/admin/search` | Benutzer suchen | ✅ | ✅ |
| `PUT` | `/admin/:id` | Admin-Status setzen | ✅ | ✅ |
| `GET` | `/admin` | Alle Administratoren | ✅ | ✅ |

## 🔒 Sicherheitsfeatures

### JWT-Authentifizierung
- Tokens laufen nach 1 Stunde ab
- Sichere Passwort-Hashing mit bcrypt
- Middleware-basierte Authentifizierung

### SQL-Injection-Schutz
Das System verwendet einen Pattern-basierten Ansatz zur Erkennung von SQL-Injection-Versuchen:

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

### Datenschutz
- Private/Öffentliche Items
- Benutzer sehen nur eigene private Items
- Cascading Deletes für Datenintegrität

## 🏗 Datenbankschema

### Haupttabellen
- `users` - Benutzerinformationen mit Sicherheitsfragen
- `item` - Items mit Bildern und Kategorien
- `item_list` - Benutzerdefinierte Item-Sammlungen
- `editorial` - Redaktionelle Kuratierungen (Admin)
- `activities` - Audit-Trail für Benutzeraktionen
- `contact_form` - Kontaktanfragen

### Verknüpfungstabellen
- `item_itemlist` - Items ↔ Item-Listen
- `item_editorial` - Items ↔ Redaktionelle Listen

## 🐛 Debugging & Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Logging
- Console-basiertes Logging für Errors
- Aktivitätsverfolgung in der Datenbank
- SQL-Injection-Versuche werden geloggt

## 🚨 Bekannte Limitierungen

1. **File Storage**: Bilder werden in der Datenbank als BYTEA gespeichert (nicht optimal für große Dateien)
2. **SQL Injection Protection**: Pattern-basiert, könnte fortgeschrittene Angriffe übersehen
3. **Rate Limiting**: Nicht implementiert
4. **Logging**: Rudimentär, könnte strukturierter sein
5. **Testing**: Keine automatisierten Tests vorhanden

## 🔮 Mögliche Erweiterungen

- **File Storage**: Migration zu Cloud Storage (AWS S3, etc.)
- **Caching**: Redis für häufig abgerufene Daten
- **Search**: Elasticsearch für erweiterte Suchfunktionen
- **Real-time**: WebSocket-Support für Live-Updates
- **API Documentation**: OpenAPI/Swagger Integration
- **Monitoring**: Prometheus/Grafana Integration
- **Testing**: Unit- und Integration-Tests

## 🆘 Support

* 📘 Doku: Diese README
* 🐞 Bugs: GitHub Issues

---

## 📊 Projektstatistiken

* Erste Version: **Mai 2025**
* Aktive Entwicklung: ✅
* Letztes Update: **Juni 2025**
* Contributors: **3+** – *Vielleicht bald du?* ❤️
