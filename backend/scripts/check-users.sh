DOCKER_COMMAND
docker exec coopelos-postgres psql -U postgres -d coopelos -c "SELECT id, email, role, is_active FROM ""user"";"
