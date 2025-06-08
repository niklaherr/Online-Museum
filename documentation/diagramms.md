# Online-Museum: Anwendungsfall- und Architekturdiagramme

## 📋 Inhaltsverzeichnis

1. [Anwendungsfalldiagramm](#1-anwendungsfalldiagramm)
2. [Systemarchitektur-Diagramm](#2-systemarchitektur-diagramm)
3. [Komponentendiagramm](#3-komponentendiagramm)
4. [Verteilungsdiagramm (Deployment)](#4-verteilungsdiagramm-deployment)
5. [Klassendiagramm (Backend Services)](#5-klassendiagramm-backend-services)
6. [Datenbankschema](#6-datenbankschema)
7. [Beschreibung der Anwendungsfälle](#beschreibung-der-anwendungsfälle)
8. [Installation und Deployment](#installation-und-deployment)

---

## 1. Anwendungsfalldiagramm

```mermaid
graph TB
    subgraph "Online-Museum System"
        subgraph "Authentifizierung"
            UC1[Registrieren]
            UC2[Anmelden]
            UC3[Passwort zurücksetzen]
            UC4[Profil verwalten]
        end
        
        subgraph "Item-Management"
            UC5[Item erstellen]
            UC6[Items anzeigen]
            UC7[Item bearbeiten]
            UC8[Item löschen]
            UC9[Items durchsuchen]
        end
        
        subgraph "Listen-Management"
            UC10[Item-Liste erstellen]
            UC11[Item-Liste bearbeiten]
            UC12[Item-Liste löschen]
            UC13[Listen durchsuchen]
        end
        
        subgraph "Administration"
            UC14[Redaktionelle Listen verwalten]
            UC15[Benutzer-Adminrechte verwalten]
            UC16[Support-Anfragen bearbeiten]
        end
        
        subgraph "KI-Features"
            UC17[KI-Beschreibung generieren]
        end
        
        subgraph "Support"
            UC18[Kontakt-Formular senden]
            UC19[Hilfe-Seiten anzeigen]
        end
    end
    
    subgraph "Akteure"
        Guest[Gast]
        User[Registrierter Benutzer]
        Admin[Administrator]
    end
    
    %% Gast-Beziehungen
    Guest --> UC1
    Guest --> UC2
    Guest --> UC3
    Guest --> UC6
    Guest --> UC18
    Guest --> UC19
    
    %% Benutzer-Beziehungen (erbt von Gast)
    User --> UC4
    User --> UC5
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
    User --> UC11
    User --> UC12
    User --> UC13
    User --> UC17
    
    %% Admin-Beziehungen (erbt von Benutzer)
    Admin --> UC14
    Admin --> UC15
    Admin --> UC16
    
    %% Vererbungsbeziehungen
    User -.-> Guest
    Admin -.-> User
```

---

## 2. Systemarchitektur-Diagramm

```mermaid
graph TB
    subgraph "Client-Schicht (Frontend)"
        React[React.js Application]
        
        subgraph "React Components"
            Pages[Pages]
            Components[Components]
            Services[Services]
        end
        
        subgraph "UI Libraries"
            Tremor[Tremor UI]
            Tailwind[Tailwind CSS]
            Framer[Framer Motion]
        end
        
        React --> Pages
        React --> Components
        React --> Services
        Pages --> Tremor
        Components --> Tailwind
        Components --> Framer
    end
    
    subgraph "Server-Schicht (Backend)"
        Express[Express.js Server]
        
        subgraph "Routes"
            AuthRoutes[Auth Routes]
            ItemRoutes[Item Routes]
            ListRoutes[List Routes]
            AdminRoutes[Admin Routes]
        end
        
        subgraph "Middleware"
            AuthMiddleware[JWT Authentication]
            SecurityMiddleware[SQL Injection Protection]
            CorsMiddleware[CORS Middleware]
        end
        
        subgraph "Services"
            ActivityService[Activity Service]
            InjectionService[Injection Service]
        end
        
        Express --> AuthRoutes
        Express --> ItemRoutes
        Express --> ListRoutes
        Express --> AdminRoutes
        Express --> AuthMiddleware
        Express --> SecurityMiddleware
        Express --> CorsMiddleware
        Express --> ActivityService
        Express --> InjectionService
    end
    
    subgraph "Datenbank-Schicht"
        PostgreSQL[(PostgreSQL Database)]
        
        subgraph "Tabellen"
            Users[users]
            Items[item]
            ItemLists[item_list]
            Editorial[editorial]
            Activities[activities]
            ContactForm[contact_form]
        end
        
        PostgreSQL --> Users
        PostgreSQL --> Items
        PostgreSQL --> ItemLists
        PostgreSQL --> Editorial
        PostgreSQL --> Activities
        PostgreSQL --> ContactForm
    end
    
    subgraph "Externe Services"
        MistralAPI[Mistral AI API]
        FileStorage[File Storage System]
    end
    
    %% Verbindungen zwischen Schichten
    React -.->|HTTP/REST| Express
    Express -.->|SQL Queries| PostgreSQL
    Express -.->|API Calls| MistralAPI
    Express -.->|File Operations| FileStorage
    
    %% Styling
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef database fill:#e8f5e8
    classDef external fill:#fff3e0
    
    class React,Pages,Components,Services,Tremor,Tailwind,Framer frontend
    class Express,AuthRoutes,ItemRoutes,ListRoutes,AdminRoutes,AuthMiddleware,SecurityMiddleware,CorsMiddleware,ActivityService,InjectionService backend
    class PostgreSQL,Users,Items,ItemLists,Editorial,Activities,ContactForm database
    class MistralAPI,FileStorage external
```

---

## 3. Komponentendiagramm

```mermaid
graph LR
    subgraph "Frontend Components"
        subgraph "Layout Components"
            Header[Header]
            Sidebar[Sidebar]
            Footer[Footer]
        end
        
        subgraph "Page Components"
            Dashboard[Dashboard]
            Gallery[Gallery]
            ItemList[ItemList Views]
            Auth[Authentication Pages]
            Admin[Admin Pages]
        end
        
        subgraph "Feature Components"
            CreateItem[CreateItem]
            EditItem[EditItem]
            CreateList[CreateItemList]
            EditList[EditItemList]
        end
        
        subgraph "Helper Components"
            Loading[Loading]
            NoResults[NoResults]
            NotFound[NotFound]
        end
    end
    
    subgraph "Services Layer"
        UserService[UserService]
        ItemService[ItemService]
        EditorialService[EditorialService]
        AdminService[AdminService]
        ContactFormService[ContactFormService]
        ItemAssistantService[ItemAssistantService]
        NotyfService[NotyfService]
    end
    
    subgraph "Backend Routes"
        AuthAPI[/auth]
        ItemAPI[/items]
        ListAPI[/item-lists]
        EditorialAPI[/editorial]
        AdminAPI[/admin]
        ContactAPI[/contact-form]
    end
    
    %% Frontend zu Services
    Dashboard --> UserService
    Dashboard --> ItemService
    Gallery --> ItemService
    ItemList --> ItemService
    Auth --> UserService
    Admin --> AdminService
    CreateItem --> ItemService
    CreateItem --> ItemAssistantService
    EditItem --> ItemService
    CreateList --> ItemService
    EditList --> ItemService
    
    %% Services zu Backend
    UserService --> AuthAPI
    ItemService --> ItemAPI
    ItemService --> ListAPI
    EditorialService --> EditorialAPI
    AdminService --> AdminAPI
    ContactFormService --> ContactAPI
    ItemAssistantService -.->|External API| MistralAI[Mistral AI]
    
    %% Error Handling
    UserService --> NotyfService
    ItemService --> NotyfService
    EditorialService --> NotyfService
    AdminService --> NotyfService
    ContactFormService --> NotyfService
```

---

## 4. Verteilungsdiagramm (Deployment)

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Railway Cloud Platform"
            subgraph "Frontend Container"
                NginxServer[Nginx Server :80]
                ReactBuild[React Build Files]
                NginxServer --> ReactBuild
            end
            
            subgraph "Backend Container"
                NodeServer[Node.js Express :3001]
                EnvironmentVars[Environment Variables]
                NodeServer --> EnvironmentVars
            end
            
            subgraph "Database Container"
                PostgreSQLDB[(PostgreSQL :5432)]
                DBData[Database Data]
                PostgreSQLDB --> DBData
            end
        end
        
        subgraph "External Services"
            MistralAPI[Mistral AI API]
            Railway[Railway Infrastructure]
        end
    end
    
    subgraph "Development Environment"
        subgraph "Local Development"
            ReactDev[React Dev Server :3000]
            NodeDev[Node.js Dev Server :3001]
            PostgreSQLLocal[(Local PostgreSQL :5432)]
        end
        
        subgraph "Development Tools"
            Git[Git Repository]
            VSCode[VS Code]
            NPM[NPM/Package Manager]
        end
    end
    
    subgraph "Client Devices"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end
    
    %% Production Connections
    Browser -.->|HTTPS| NginxServer
    Mobile -.->|HTTPS| NginxServer
    NginxServer -.->|API Calls| NodeServer
    NodeServer -.->|SQL| PostgreSQLDB
    NodeServer -.->|REST API| MistralAPI
    
    %% Development Connections
    ReactDev -.->|API Calls| NodeDev
    NodeDev -.->|SQL| PostgreSQLLocal
    
    %% Deployment Flow
    Git -.->|CI/CD| Railway
    Railway -.->|Deploy| NginxServer
    Railway -.->|Deploy| NodeServer
    Railway -.->|Deploy| PostgreSQLDB
    
    %% Styling
    classDef production fill:#e8f5e8
    classDef development fill:#e1f5fe
    classDef external fill:#fff3e0
    classDef client fill:#f3e5f5
    
    class NginxServer,ReactBuild,NodeServer,EnvironmentVars,PostgreSQLDB,DBData production
    class ReactDev,NodeDev,PostgreSQLLocal,Git,VSCode,NPM development
    class MistralAPI,Railway external
    class Browser,Mobile client
```

---

## 5. Klassendiagramm (Backend Services)

```mermaid
classDiagram
    class UserService {
        -baseUrl: string
        -currentUser: User|null
        -listeners: UserChangeListener[]
        +login(credentials: Credentials): Promise~AuthResponse~
        +signup(credentials: Credentials): Promise~AuthResponse~
        +logout(): void
        +resetPasswordWithOldPassword(): Promise~boolean~
        +deleteUser(): Promise~boolean~
        +getToken(): string
        +getUserID(): number
        +isLoggedIn(): boolean
        +isadmin(): boolean
    }
    
    class ItemService {
        -baseUrl: string
        -maxRetries: number
        +fetchOwnItems(): Promise~GalleryItem[]~
        +fetchItemsNotOwnedByUser(): Promise~GalleryItem[]~
        +fetchItemById(id: number): Promise~GalleryItem~
        +createItem(formData: FormData): Promise~any~
        +updateItem(id: number, formData: FormData): Promise~any~
        +deleteItem(id: number): Promise~any~
        +createItemList(data: ItemListData): Promise~any~
        +editItemList(id: number, data: ItemListData): Promise~any~
        +deleteItemList(id: number): Promise~any~
    }
    
    class EditorialService {
        -baseUrl: string
        +fetchEditorialLists(): Promise~Editorial[]~
        +fetchEditorialListById(id: string): Promise~Editorial~
        +fetchItemsByEditorialId(id: number): Promise~GalleryItem[]~
        +searchItems(query: string): Promise~GalleryItem[]~
        +createEditorialList(data: EditorialData): Promise~Editorial~
        +updateEditorialList(id: number, data: EditorialData): Promise~Editorial~
        +deleteEditorialList(id: number): Promise~void~
    }
    
    class AdminService {
        -baseUrl: string
        +addAdmin(userId: number): Promise~boolean~
        +deleteAdmin(userId: number): Promise~boolean~
        +searchUsers(query: string): Promise~User[]~
        +getAdmins(): Promise~User[]~
    }
    
    class ItemAssistantService {
        -MISTRAL_API_KEY: string
        -MISTRAL_API_URL: string
        +generateDescription(title: string, category: string): Promise~string~
    }
    
    class ContactFormService {
        -baseUrl: string
        +submitContactForm(formData: ContactFormData): Promise~boolean~
        +fetchContactForms(): Promise~ContactForm[]~
        +updateContactFormStatus(id: number, status: string): Promise~ContactForm~
    }
    
    class NotyfService {
        -lastMessage: string
        -lastCall: number
        +showError(message: string, duration: number): void
        +showSuccess(message: string, duration: number): void
        -shouldShow(message: string): boolean
    }
    
    %% Beziehungen
    UserService --> NotyfService : uses
    ItemService --> NotyfService : uses
    EditorialService --> NotyfService : uses
    AdminService --> NotyfService : uses
    ContactFormService --> NotyfService : uses
    ItemService --> UserService : uses
    EditorialService --> UserService : uses
    AdminService --> UserService : uses
    ContactFormService --> UserService : uses
```

---

## 6. Datenbankschema

```mermaid
erDiagram
    users {
        int id PK
        varchar username UK
        varchar password
        varchar security_question
        varchar security_answer
        boolean isadmin
    }
    
    item {
        int id PK
        int user_id FK
        varchar title
        bytea image
        text description
        varchar category
        timestamp entered_on
        boolean isprivate
    }
    
    item_list {
        int id PK
        varchar title
        text description
        int user_id FK
        timestamp entered_on
        boolean isprivate
        bytea main_image
    }
    
    item_itemlist {
        int item_list_id FK
        int item_id FK
    }
    
    editorial {
        int id PK
        varchar title
        text description
        timestamp entered_on
    }
    
    item_editorial {
        int editorial_id FK
        int item_id FK
    }
    
    activities {
        int id PK
        varchar category
        timestamp entered_on
        varchar type
        int element_id
        int user_id FK
    }
    
    contact_form {
        int id PK
        varchar name
        varchar email
        varchar subject
        text message
        timestamp submitted_on
        varchar status
    }
    
    %% Beziehungen
    users ||--o{ item : creates
    users ||--o{ item_list : creates
    users ||--o{ activities : performs
    
    item ||--o{ item_itemlist : contains
    item_list ||--o{ item_itemlist : contains
    
    item ||--o{ item_editorial : contains
    editorial ||--o{ item_editorial : contains
```

---

## Beschreibung der Anwendungsfälle

### 🎭 Hauptakteure

- **Gast**: Nicht angemeldeter Benutzer mit eingeschränkten Rechten
- **Registrierter Benutzer**: Angemeldeter Benutzer mit vollen Funktionen
- **Administrator**: Benutzer mit erweiterten Verwaltungsrechten

### 🚀 Kern-Anwendungsfälle

#### 1. **Authentifizierung & Benutzerverwaltung**
- **UC1 - Registrieren**: Neuen Account mit Sicherheitsfrage erstellen
- **UC2 - Anmelden**: Login mit JWT-Token-basierter Authentifizierung
- **UC3 - Passwort zurücksetzen**: Reset über Sicherheitsfrage ohne E-Mail
- **UC4 - Profil verwalten**: Account-Einstellungen und Passwort ändern

#### 2. **Item-Management**
- **UC5 - Item erstellen**: Upload von Bildern mit Metadaten und KI-Beschreibung
- **UC6 - Items anzeigen**: Browse-Funktionalität mit Kategoriefiltern
- **UC7 - Item bearbeiten**: Aktualisierung von Metadaten und Bildern
- **UC8 - Item löschen**: Sichere Entfernung mit Cascading-Löschung
- **UC9 - Items durchsuchen**: Volltext-Suche über Titel, Kategorien und Beschreibungen

#### 3. **Listen-Management**
- **UC10 - Item-Liste erstellen**: Thematische Sammlungen mit Banner-Bildern
- **UC11 - Item-Liste bearbeiten**: Aktualisierung von Listen-Metadaten
- **UC12 - Item-Liste löschen**: Entfernung von Listen (Items bleiben erhalten)
- **UC13 - Listen durchsuchen**: Suche und Filter für öffentliche/private Listen

#### 4. **Administration**
- **UC14 - Redaktionelle Listen verwalten**: Kuratierte Empfehlungssammlungen
- **UC15 - Benutzer-Adminrechte verwalten**: Rollenverwaltung und Rechtezuweisung
- **UC16 - Support-Anfragen bearbeiten**: Ticketing-System für Benutzerhilfe

#### 5. **Erweiterte Features**
- **UC17 - KI-Beschreibung generieren**: Mistral AI-Integration für Content-Generation
- **UC18 - Kontakt-Formular senden**: Support-Anfragen von Benutzern
- **UC19 - Hilfe-Seiten anzeigen**: Dokumentation und FAQ-System

---

## Installation und Deployment

### 🔧 Lokale Entwicklungsumgebung

#### Voraussetzungen
```bash
Node.js >= 18.0.0
PostgreSQL >= 13.0
npm >= 8.0.0
Git
```

#### Backend Setup
```bash
# Repository klonen
git clone <repository-url>
cd online-museum

# Backend-Dependencies installieren
cd backend
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# .env-Datei mit lokalen Werten befüllen

# Datenbank initialisieren
createdb mydatabase
# SQL-Schema importieren (falls vorhanden)

# Development Server starten
npm run dev
```

#### Frontend Setup
```bash
# Frontend-Dependencies installieren
cd ../frontend
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# .env-Datei mit Backend-URL befüllen

# Development Server starten
npm start
```

#### Datenbank Setup
```sql
-- PostgreSQL Datenbank erstellen
CREATE DATABASE mydatabase;
CREATE USER user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO user;

-- Schema-Tabellen erstellen (vereinfacht)
-- users, item, item_list, editorial, activities, contact_form
-- (Vollständiges Schema siehe Datenbankschema-Diagramm)
```

### 🚀 Production Deployment (Railway)

#### Docker Configuration
```dockerfile
# Frontend Dockerfile (Multi-Stage Build)
FROM node:18-slim as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Backend Dockerfile
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

#### Umgebungsvariablen (Production)
```env
# Backend (.env)
NODE_ENV=production
PORT=3001
DB_HOST=railway-postgres-url
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=railway-generated-password
JWT_SECRET=production-secret-key

# Frontend (Build-Zeit)
REACT_APP_BACKEND_API_URL=https://your-backend-domain.railway.app
REACT_APP_MISTRAL_API_KEY=your-mistral-api-key
```

#### Railway Deployment Steps
1. **Repository mit Railway verbinden**
2. **Services konfigurieren**:
   - Frontend Service (Nginx)
   - Backend Service (Node.js)
   - PostgreSQL Database
3. **Umgebungsvariablen setzen**
4. **Automatic Deployment aktivieren**

### 🗄️ Testdaten

#### Beispiel-Benutzer
```sql
-- Admin-Benutzer (Passwort: admin123)
INSERT INTO users (username, password, security_question, security_answer, isadmin) 
VALUES ('admin', '$2b$10$hashedpassword', 'Lieblingsstadt?', '$2b$10$hashedanswer', true);

-- Standard-Benutzer (Passwort: user123)
INSERT INTO users (username, password, security_question, security_answer, isadmin) 
VALUES ('testuser', '$2b$10$hashedpassword', 'Erstes Haustier?', '$2b$10$hashedanswer', false);
```

#### Beispiel-Items und Listen
```sql
-- Sample Items
INSERT INTO item (user_id, title, description, category, isprivate) 
VALUES 
(1, 'Vintage Kamera', 'Klassische Analogkamera aus den 1970ern', 'Fotografie', false),
(1, 'Gemälde Landschaft', 'Impressionistische Landschaftsmalerei', 'Malerei', false);

-- Sample Item-Liste
INSERT INTO item_list (title, description, user_id, isprivate) 
VALUES ('Meine Kunstsammlung', 'Persönliche Sammlung verschiedener Kunstwerke', 1, false);
```

### 🔐 Sicherheitskonfiguration

#### JWT-Konfiguration
- **Expiration**: 1 Stunde
- **Algorithm**: HS256
- **Secret**: Starkes, zufälliges Secret (mindestens 256 Bit)

#### SQL-Injection-Schutz
- Parametrisierte Queries mit pg-Pool
- Input-Validation auf allen Endpunkten
- Custom Injection-Detection-Service

#### Passwort-Sicherheit
- bcrypt mit Salt-Rounds: 10
- Mindestlänge: 6 Zeichen
- Sichere Speicherung von Sicherheitsfragen

#### CORS-Konfiguration
```javascript
// Production CORS-Settings
const corsOptions = {
  origin: ['https://your-frontend-domain.railway.app'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

---

### 📚 Zusätzliche Ressourcen

- **Live Demo**: [Online-Museum App](https://your-app-url.railway.app)
- **API Documentation**: Siehe `/backend/routes/` für detaillierte Endpunkt-Beschreibungen
- **Component Library**: Tremor React Documentation
- **Deployment Platform**: [Railway.app](https://railway.app)

---

### 👥 Entwicklerteam

- **Niklas Herrmann** - Projektleitung/Entwicklung
- **Hendrik Steen** - Projektleitung/Entwicklung  
- **Malte Beissel** - Entwicklung

**Studiengang**: Wirtschaftsinformatik, DHSH  
**Betreuung**: Prof. Dr. Sven Niemand
