## 📚 API-Dokumentation - Backend

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

1. **SQL Injection Protection**: Pattern-basiert, könnte fortgeschrittene Angriffe übersehen
2. **Rate Limiting**: Nicht implementiert
3. **Logging**: Rudimentär, könnte strukturierter sein
4. **Testing**: Keine automatisierten Tests vorhanden

## 🔮 Mögliche Erweiterungen

- **File Storage**: Migration zu Cloud Storage (AWS S3, etc.)
- **Caching**: Für häufig abgerufene Daten
- **API Documentation**: OpenAPI/Swagger Integration
- **Monitoring**: Prometheus/Grafana Integration
- **Testing**: Unit- und Integration-Tests