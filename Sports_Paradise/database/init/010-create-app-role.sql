\getenv app_user POSTGRES_APP_USER
\getenv app_password POSTGRES_APP_PASSWORD
\getenv database_name POSTGRES_DB

SELECT format(
  'CREATE ROLE %I WITH LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS',
  :'app_user',
  :'app_password'
)
WHERE NOT EXISTS (
  SELECT FROM pg_roles WHERE rolname = :'app_user'
)
\gexec

SELECT format(
  'ALTER ROLE %I WITH LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS',
  :'app_user',
  :'app_password'
)
\gexec

GRANT CONNECT ON DATABASE :"database_name" TO :"app_user";
GRANT USAGE, CREATE ON SCHEMA public TO :"app_user";
