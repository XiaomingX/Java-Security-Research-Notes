#!/bin/bash

env PGPASSWORD="$DEEPFENCE_POSTGRES_USER_DB_PASSWORD" psql "host=$DEEPFENCE_POSTGRES_USER_DB_HOST port=$DEEPFENCE_POSTGRES_USER_DB_PORT user=$DEEPFENCE_POSTGRES_USER_DB_USER dbname=$DEEPFENCE_POSTGRES_USER_DB_NAME sslmode=$DEEPFENCE_POSTGRES_USER_DB_SSLMODE" < $1

echo "Postgres restore completed from the file pg_data.dump"