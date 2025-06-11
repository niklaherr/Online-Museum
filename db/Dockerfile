FROM postgres:14

# Set environment variables (override at runtime or in docker-compose)
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=mydatabase

# Copy the initial SQL script into the Docker image
# This script will be executed automatically by the official entrypoint
COPY init_db.sql /docker-entrypoint-initdb.d/


