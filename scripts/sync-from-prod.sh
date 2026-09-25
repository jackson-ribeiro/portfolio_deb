#!/usr/bin/env bash
# Sincroniza o ambiente local com a produção, sem nunca escrever na produção:
#   1. Copia o banco de produção (PROD_DATABASE_URL, só leitura) para o banco
#      local (DATABASE_URL), substituindo tudo o que houver nele.
#   2. Copia as mídias do Cloudinary da pasta de produção para CLOUDINARY_FOLDER
#      e aponta o banco local para as cópias (scripts/sync-cloudinary-dev.ts).
#
# Uso: npm run sync:prod
set -euo pipefail

cd "$(dirname "$0")/.."
set -a
# shellcheck disable=SC1091
source .env
set +a

: "${PROD_DATABASE_URL:?defina PROD_DATABASE_URL no .env}"
: "${DATABASE_URL:?defina DATABASE_URL no .env}"

# O banco de destino precisa ser local: este script apaga tudo nele.
case "$DATABASE_URL" in
  *@localhost:*|*@localhost/*|*@127.0.0.1:*|*@127.0.0.1/*) ;;
  *) echo "DATABASE_URL não aponta para localhost; abortando." >&2; exit 1 ;;
esac
if [ "$DATABASE_URL" = "$PROD_DATABASE_URL" ]; then
  echo "DATABASE_URL e PROD_DATABASE_URL são iguais; abortando." >&2
  exit 1
fi

# O pooler da Neon não serve para pg_dump; usa a conexão direta.
PROD_URL="${PROD_DATABASE_URL/-pooler./.}"
# libpq não aceita parâmetros do Prisma como ?schema=public.
LOCAL_URL="${DATABASE_URL%%\?*}"

echo "==> Subindo o banco local (docker compose)..."
docker compose up -d --wait

echo "==> Copiando banco de produção para o banco local..."
docker run --rm --network host -e PROD_URL="$PROD_URL" -e LOCAL_URL="$LOCAL_URL" \
  postgres:17 bash -c '
    set -euo pipefail
    psql "$LOCAL_URL" -q -v ON_ERROR_STOP=1 \
      -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    pg_dump "$PROD_URL" -Fc --no-owner --no-acl \
      | pg_restore --no-owner --no-acl --exit-on-error -d "$LOCAL_URL"
  '

echo "==> Copiando mídias do Cloudinary para a pasta de desenvolvimento..."
npx tsx scripts/sync-cloudinary-dev.ts

echo "==> Sincronização concluída."
