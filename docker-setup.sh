#!/bin/bash

# ===========================================
# Docker Setup für Online-Museum PostgreSQL
# ===========================================

echo "🚀 Online-Museum PostgreSQL Docker Setup"

# 1. Container starten (Erstmalig mit Datenbank-Initialisierung)
echo "📊 Starte PostgreSQL Container..."
docker-compose up -d postgres

# Warten bis PostgreSQL bereit ist
echo "⏳ Warte auf PostgreSQL..."
sleep 10

# 2. Verbindung testen
echo "🔍 Teste Datenbankverbindung..."
docker exec -it online-museum-postgres pg_isready -U user -d mydatabase

# 3. SQL-Skript manuell ausführen (falls nötig)
echo "📝 Initialisiere Datenbank..."
docker exec -i online-museum-postgres psql -U user -d mydatabase < init_db.sql

# 4. pgAdmin starten (optional)
echo "🖥️  Starte pgAdmin..."
docker-compose up -d pgadmin

echo "✅ Setup abgeschlossen!"
echo ""
echo "📌 Verbindungsdetails:"
echo "   Database: mydatabase"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Username: user"
echo "   Password: password"
echo ""
echo "🌐 pgAdmin: http://localhost:8080"
echo "   Email: admin@museum.local"
echo "   Password: admin123"
echo ""

# ===========================================
# Weitere nützliche Befehle
# ===========================================

# Alle Container stoppen
stop_containers() {
    echo "🛑 Stoppe alle Container..."
    docker-compose down
}

# Container neu starten
restart_containers() {
    echo "🔄 Starte Container neu..."
    docker-compose restart postgres pgadmin
}

# Logs anzeigen
show_logs() {
    echo "📋 PostgreSQL Logs:"
    docker-compose logs -f postgres
}

# Datenbank-Backup erstellen
backup_database() {
    echo "💾 Erstelle Datenbank-Backup..."
    docker exec online-museum-postgres pg_dump -U user mydatabase > backup_$(date +%Y%m%d_%H%M%S).sql
    echo "✅ Backup erstellt: backup_$(date +%Y%m%d_%H%M%S).sql"
}

# Datenbank-Shell öffnen
open_db_shell() {
    echo "🐚 Öffne PostgreSQL Shell..."
    docker exec -it online-museum-postgres psql -U user -d mydatabase
}

# Container Status prüfen
check_status() {
    echo "📊 Container Status:"
    docker-compose ps
}

# Cleanup - Alle Daten löschen (VORSICHT!)
cleanup_all() {
    echo "⚠️  WARNUNG: Alle Daten werden gelöscht!"
    read -p "Fortfahren? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker volume prune -f
        echo "🗑️  Cleanup abgeschlossen"
    else
        echo "❌ Abgebrochen"
    fi
}

# Hilfe anzeigen
show_help() {
    echo "🆘 Verfügbare Befehle:"
    echo "  stop_containers     - Container stoppen"
    echo "  restart_containers  - Container neu starten"  
    echo "  show_logs          - Logs anzeigen"
    echo "  backup_database    - Backup erstellen"
    echo "  open_db_shell      - PostgreSQL Shell öffnen"
    echo "  check_status       - Container Status prüfen"
    echo "  cleanup_all        - Alle Daten löschen (VORSICHT!)"
    echo ""
    echo "Beispiel: ./docker-setup.sh backup_database"
}

# Befehl ausführen wenn als Parameter übergeben
if [ "$1" != "" ]; then
    $1
else
    echo "Verwende './docker-setup.sh show_help' für alle Befehle"
fi