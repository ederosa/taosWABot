#!/bin/bash

# Ruta al archivo que deseas ejecutar
SCRIPT_PATH="/home/taospi/git/taosWABot/gmailbot.js"

# Verificar si el archivo existe
if [ -f "$SCRIPT_PATH" ]; then
  echo "Ejecutando $SCRIPT_PATH..."
  # Ejecutar el script con Node.js
  cd /home/taospi/git/taosWABot && /home/taospi/.nvm/versions/node/v23.6.1/bin/node "$SCRIPT_PATH"
else
  echo "Error: El archivo $SCRIPT_PATH no existe."
  exit 1
fi
