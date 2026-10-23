#!/usr/bin/env bash
# Troca o número de versão em todos os lugares de uma vez.
# Uso: ./bump-version.sh 2026.10.24-1
set -euo pipefail
new="$1"
cd "$(dirname "$0")"
sed -i -E "s/(styles\.css|app\.js)\?v=[^\"]+/\1?v=${new}/g" index.html
sed -i -E "s/const APP_VERSION = '[^']+'/const APP_VERSION = '${new}'/" app.js
printf '{"v":"%s"}\n' "$new" > version.json
echo "Versão ${new}"
