FROM postgres:14

# Copy the initial SQL script into the Docker image
# This script will be executed automatically by the official entrypoint
COPY init_db.sql /docker-entrypoint-initdb.d/


