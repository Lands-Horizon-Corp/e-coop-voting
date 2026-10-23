pg_dump "postgresql://postgres:acedb25@localhost:5433/ace-system" > ace-system.sql

Useful variations:

# Compressed custom format (best for pg_restore, supports parallel restore)
pg_dump -Fc "postgresql://postgres:acedb25@localhost:5433/ace-system" -f ace-system.dump

# Plain SQL, gzipped
pg_dump "postgresql://postgres:acedb25@localhost:5433/ace-system" | gzip > ace-system.sql.gz

# Schema only / data only
pg_dump --schema-only "postgresql://postgres:acedb25@localhost:5433/ace-system" > schema.sql
pg_dump --data-only   "postgresql://postgres:acedb25@localhost:5433/ace-system" > data.sql

Restore:

# from plain SQL
psql "postgresql://postgres:acedb25@localhost:5433/ace-system" < ace-system.sql

# from custom format
pg_restore -d "postgresql://postgres:acedb25@localhost:5433/ace-system" --clean --if-exists ace-system.dump

If the database is in Docker and you don't have pg_dump installed locally, run it inside the container (the container name is a guess, so check docker ps):

docker exec -t <postgres-container> pg_dump -U postgres ace-system > ace-system.sql

If you get a "server version mismatch" error, your local pg_dump is older than the server. Use the container's pg_dump as above, or install a matching client version.

The password is in the command, so it ends up in your shell history. To avoid that, set it in the environment first with export PGPASSWORD=acedb25, or use a ~/.pgpass file.