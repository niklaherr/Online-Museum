Hier ist die strukturierte, gut lesbare **Markdown-Version** deiner Projektbeschreibung für das **Online Museum**:

---

# 🖼️ Online Museum

Ein digitales Museum, das Benutzern ermöglicht, kulturelle und kreative Inhalte zu sammeln, zu organisieren und zu teilen. Die Plattform bietet **private und öffentliche Sammlungen**, **redaktionelle Inhalte** und **soziale Funktionen**.

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
* Docker & Docker Compose
* Git

---

## 🚀 Installation & Setup

### 1. Repository klonen

```bash
git clone https://github.com/your-username/online-museum.git
cd online-museum
```

### 2. Mit Docker Compose (Empfohlen)

```bash
# Alle Services starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Nur bestimmte Services starten
docker-compose up database backend
```

**Zugänglichkeit:**

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:3001`
* DB: `localhost:5432`

### 3. Manuelle Installation

#### 🛢️ Datenbank Setup

```bash
docker run -d \
  --name museum-postgres \
  -e POSTGRES_DB=online_museum \
  -e POSTGRES_USER=museum_user \
  -e POSTGRES_PASSWORD=museum_password \
  -p 5432:5432 \
  postgres:15
```

Oder mit Docker Compose:

```bash
docker-compose up -d database
```

#### 🔧 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

`.env` anpassen:

```
DATABASE_URL=postgresql://museum_user:museum_password@localhost:5432/online_museum
JWT_SECRET=your_super_secret_jwt_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
```

Starten:

```bash
npm start     # Produktion
npm run dev   # Entwicklung mit Hot Reload
```

#### 🎨 Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` anpassen:

```
REACT_APP_BACKEND_API_URL=http://localhost:3001
MISTRAL_API_KEY=your_mistral_api_key_here
```

Starten:

```bash
npm start     # Entwicklung
npm run build # Produktion
```

---

## 🗄️ Datenbank-Initialisierung

### Mit Docker Compose

Die Datenbank wird automatisch initialisiert.

### Manuell

```sql
-- Verbindung
psql -h localhost -p 5432 -U museum_user -d online_museum
```

Oder mit Docker:

```bash
docker exec -it museum-postgres psql -U museum_user -d online_museum
```

**Tabellen anlegen:**

init-db.sql Skript bei der Datenbank ausführen

## 🎮 Verwendung

### Erste Schritte

1. Registrierung: `http://localhost:3000 → Registrieren`
2. Profil anlegen: Benutzername & Passwort
3. Sicherheitsfrage ausfüllen
4. Erstes Item hochladen
5. Eigene Liste erstellen

### Admin-Zugang aktivieren

```sql
UPDATE users SET "isadmin" = true WHERE id = 1;
```

### KI-Funktionen nutzen

* `.env` mit Mistral-API-Key
* Bei Item-Erstellung auf **"KI-Beschreibung generieren"** klicken
---

## 🔧 Entwicklung

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm start
```

---

## 📚 API-Dokumentation

### 🔐 Authentifizierung

* `POST /register` – Benutzer registrieren
* `POST /login` – Login
* `GET /security-question/:username`
* `POST /verify-security-question`
* `POST /reset-password`

### 📦 Items

* `GET /items`
* `GET /items/:id`
* `POST /items`
* `PUT /items/:id`
* `DELETE /items/:id`

### 📋 Listen

* `GET /item-lists`
* `POST /item-lists`
* `PUT /item-lists/:id`
* `DELETE /item-lists/:id`

### 🛡️ Admin

* `GET /admin`
* `GET /admin/search`
* `PUT /admin/:id`
* `GET /editorial-lists`

---

## 🔒 Sicherheit

* JWT-basierte Authentifizierung
* Passwort-Hashing (bcrypt)
* SQL-Injection-Schutz
* CORS-Konfiguration
* Datei-Upload-Validierung
* Admin-Rollenprüfung

---

## 🤝 Beitragen

1. Fork erstellen
2. Branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Pull Request stellen

---

## 📄 Lizenz

MIT-Lizenz – Siehe `LICENSE`.

---

## 🆘 Support

* 📘 Doku: Diese README
* 🐞 Bugs: GitHub Issues
* 💬 Community: *Discord folgt*

---

## 📊 Projektstatistiken

* Erste Version: **Mai 2025**
* Aktive Entwicklung: ✅
* Letztes Update: **Mai 2025**
* Contributors: **3+** – *Vielleicht bald du?* ❤️
