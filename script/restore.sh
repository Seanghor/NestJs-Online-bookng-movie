#!/bin/bash

# until PGPASSWORD=$POSTGRES_PASSWORD psql  -U "$POSTGRES_USER"  -d "$POSTGRES_DB" -c "\q"; do
#   echo "Waiting for the PostgreSQL service to be ready..."
#   sleep 5
# done

# PGPASSWORD=$POSTGRES_PASSWORD psql  -U "$POSTGRES_USER"  -d "$POSTGRES_DB" -f "/docker-entrypoint-initdb.d/backup.sql"

# echo "Backup data restored successfully."


# Source database credentials
SOURCE_DB_USER="postgres"
SOURCE_DB_PASSWORD="hor9999"
SOURCE_DB_NAME="cloud_mv_booking_db"
SOURCE_DB_PORT="5434"  # Adjust the port if necessary

# # New database credentials
# DESTINATION_DB_USER="postgres"
# DESTINATION_DB_PASSWORD="hor9999"
# DESTINATION_DB_NAME="cloud_mv_booking_db"
# DESTINATION_DB_PORT="5434"  

# New database credentials
DESTINATION_DB_USER="pg-movie"
DESTINATION_DB_PASSWORD="hor9999"
DESTINATION_DB_NAME="movie_db"
DESTINATION_DB_PORT="5434"  


# Wait for source database to be ready
until PGPASSWORD=$SOURCE_DB_PASSWORD psql -U "$SOURCE_DB_USER" -d "$SOURCE_DB_NAME" -c "\q"; do
  echo "Waiting for the source database service to be ready..."
  sleep 5
done

# Restore data to destination database
PGPASSWORD=$DESTINATION_DB_PASSWORD psql -U "$DESTINATION_DB_USER" -d "$DESTINATION_DB_NAME" -f "/docker-entrypoint-initdb.d/backup.sql"

echo "Data restored successfully from $SOURCE_DB_NAME to $DESTINATION_DB_NAME."
