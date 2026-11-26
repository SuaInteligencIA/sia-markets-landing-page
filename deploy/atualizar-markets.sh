#!/bin/bash
# Atualização automática do SIA Markets (https://markets.suainteligenc.ia.br/).
#
# Roda no servidor cPanel pelo cron, a cada 5 minutos:
#   */5 * * * * /usr/bin/bash $HOME/sia-markets-deploy/atualizar-markets.sh >/dev/null 2>>$HOME/sia-markets-deploy/deploy.log
# Se o main do GitHub mudou desde a última publicação, compila e publica. Se a compilação falhar,
# o site anterior continua no ar e aquela versão não é tentada de novo até chegar um commit novo.
# Para forçar uma publicação: bash ~/sia-markets-deploy/atualizar-markets.sh --forcar
# Histórico: ~/sia-markets-deploy/deploy.log
set -euo pipefail

BASE="$HOME/sia-markets-deploy"
REPO="$BASE/repo"
DOCROOT="${DOCROOT:-$HOME/public_html/markets.suainteligenc.ia.br}"
REMOTE="https://github.com/samueeth/sia-markets-landing-page.git"
BRANCH="main"
SITE_URL="https://markets.suainteligenc.ia.br/"
LOG="$BASE/deploy.log"
FORCAR="${1:-}"

export PATH="${NODE_DIR:-/opt/alt/alt-nodejs22/root/usr/bin}:$PATH"
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm_config_audit=false npm_config_fund=false npm_config_update_notifier=false

mkdir -p "$BASE"
exec 9>"$BASE/.trava"
flock -n 9 || exit 0   # uma publicação por vez

log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*" >> "$LOG"; }

# Mantém o histórico pequeno.
if [ -f "$LOG" ] && [ "$(wc -c < "$LOG")" -gt 1000000 ]; then
  tail -n 2000 "$LOG" > "$LOG.tmp" && mv -f "$LOG.tmp" "$LOG"
fi

NOVO=""
trap 'log "FALHOU (linha $LINENO). O site anterior continua no ar."; [ -n "$NOVO" ] && echo "$NOVO" > "$BASE/falhou-sha"' ERR

[ -d "$REPO/.git" ] || git clone -q --branch "$BRANCH" "$REMOTE" "$REPO"
cd "$REPO"
git fetch -q origin "$BRANCH"
NOVO="$(git rev-parse "origin/$BRANCH")"
ATUAL="$(cat "$BASE/publicado-sha" 2>/dev/null || true)"

if [ "$FORCAR" != "--forcar" ]; then
  [ "$NOVO" = "$ATUAL" ] && exit 0
  [ "$NOVO" = "$(cat "$BASE/falhou-sha" 2>/dev/null || true)" ] && exit 0
fi

log "Versão nova ${NOVO:0:7} ($(git log -1 --format=%s "$NOVO")). Antes: ${ATUAL:0:7}. Compilando com $(node -v)."
git reset -q --hard "$NOVO"
git clean -qfdx -e node_modules

# O repositório ainda pode apontar para a subpasta /markets/; aqui o site sai no subdomínio.
sed -i "s#export const SITE_URL = '[^']*';#export const SITE_URL = '$SITE_URL';#" src/content.ts
grep -q "SITE_URL = '$SITE_URL'" src/content.ts

# .htaccess e robots.txt do subdomínio, enquanto o repositório não tiver os seus.
for arquivo in .htaccess robots.txt; do
  [ -e "public/$arquivo" ] || cp "$BASE/extra/$arquivo" "public/$arquivo"
done

# Só reinstala as dependências quando o package-lock.json muda.
LOCK_SHA="$(sha256sum package-lock.json | cut -d' ' -f1)"
if [ ! -d node_modules ] || [ "$LOCK_SHA" != "$(cat "$BASE/lock-sha" 2>/dev/null || true)" ]; then
  log "Instalando dependências (npm ci)."
  npm ci >> "$LOG" 2>&1
  echo "$LOCK_SHA" > "$BASE/lock-sha"
fi

npm run build >> "$LOG" 2>&1

# Conferências mínimas antes de publicar.
grep -q "rel=\"canonical\" href=\"$SITE_URL\"" dist/index.html
grep -q '<div id="root"><' dist/index.html   # página pré-renderizada
[ -f dist/.htaccess ]

# Publica: arquivos novos primeiro, index.html por último, depois remove o que sobrou da versão anterior.
# cgi-bin, php.ini e .well-known (validação do certificado) são do servidor e ficam onde estão.
cd "$DOCROOT"
ANTIGOS="$(find . -type f ! -path './cgi-bin/*' ! -path './.well-known/*' ! -name php.ini | sort)"
cd "$REPO/dist"
NOVOS="$(find . -type f | sort)"
find . -type f ! -path ./index.html -print0 | while IFS= read -r -d '' f; do
  mkdir -p "$DOCROOT/$(dirname "$f")"
  cp -f "$f" "$DOCROOT/$f"
done
cp -f index.html "$DOCROOT/.index.html.novo"
mv -f "$DOCROOT/.index.html.novo" "$DOCROOT/index.html"
cd "$DOCROOT"
# Arquivos temporários em vez de <(...): o CageFS do servidor não tem /dev/fd.
echo "$ANTIGOS" > "$BASE/.antigos"
echo "$NOVOS" > "$BASE/.novos"
comm -23 "$BASE/.antigos" "$BASE/.novos" | while IFS= read -r f; do
  if [ -n "$f" ]; then rm -f "$f"; fi
done
rm -f "$BASE/.antigos" "$BASE/.novos"
find . -mindepth 1 -type d -empty ! -path './cgi-bin*' ! -path './.well-known*' -delete

echo "$NOVO" > "$BASE/publicado-sha"
rm -f "$BASE/falhou-sha"
log "Publicado ${NOVO:0:7} em $SITE_URL"
