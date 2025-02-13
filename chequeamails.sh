#!/bin/bash

# Cargar NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Obtener la versión actual de Node administrada por NVM
NODE_VERSION=$(nvm current)
NODE_PATH="$NVM_DIR/versions/node/$NODE_VERSION/bin/node"

# Ruta al archivo que deseas ejecutar
SCRIPT_PATH="/home/taospi/git/taosWABot/gmailbot.js"

# Verificar si el archivo existe
if [ -f "$SCRIPT_PATH" ]; then
  echo "Ejecutando $SCRIPT_PATH con Node.js $NODE_VERSION..."
  # Ejecutar el script con la versión correcta de Node.js
  cd /home/taospi/git/taosWABot && "$NODE_PATH" "$SCRIPT_PATH"
else
  echo "Error: El archivo $SCRIPT_PATH no existe."
  exit 1
fi

