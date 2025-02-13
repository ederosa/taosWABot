## taosWABot

Bot de Whatsapp que utiliza el proyecto CHATBOT para acceder a funcionalidad de planillas de Google Spreadsheet.

## [Generación de credenciales y token](https://developers.google.com/gmail/api/quickstart/nodejs?hl=es-419)

1. En la consola de Google Cloud, ve a Menú menu > APIs y servicios > Credenciales.
2. Haz clic en Crear credenciales > ID de cliente de OAuth.
3. Haz clic en Tipo de aplicación > App para computadoras.
4. En el campo Nombre, escribe un nombre para la credencial. Este nombre solo se muestra en la consola de Google Cloud.
5. Haz clic en Crear. Aparecerá la pantalla Se creó el cliente de OAuth, que muestra tu nuevo ID de cliente y secreto de cliente.
6. Haz clic en Aceptar. La credencial recién creada aparecerá en IDs de cliente de OAuth 2.0.
7. Guarda el archivo JSON descargado como **credentials.json** y muévelo al directorio de trabajo.

Con el archivoi **credentials.json** creado y copiado en el directorio de nuestra aplicación la ejecutamos en una máquina con interfaz gráfica y un browser para que nos genere el **token.json**.

Cuando se haya generado ese archivo, que queda copiado en el mismo directorio del archivo de credenciales, la aplicación se ejecutará sin problemas. **Recordar copiarlo en el servidor donde se ejecuta nuestra aplicación porque no se subirá, ni tampoco el archivo credentials.json, al repositorio.**

En caso de que el token sea revocado o invalidado repetir este procedimiento.

## Token de IA

Recordar definir la variable **HUGGINGFACE_FACEBOOK** en _/etc/environment/_ para que quede como variable de entorno con el valor del Bear Token.

## Cron para ejecución del comando

```crontab
*/30 * * * * ~/git/taosWABot/chequeamails.sh
```
