const { addKeyword } = require('@bot-whatsapp/bot')
const { googleSheets } = require("./googlesheetclient.js");

const flowGastos = addKeyword(['gastos', 'gasto'])

  .addAnswer('🙌 Hola bienvenido a este *Chatbot*', null, async (ctx) => {

    //const numeroDeWhatsapp = ctx.from
    const mensajeRecibido = ctx.body.split(" ");

    if (mensajeRecibido.length > process.env.CANTMINPARAM
      && mensajeRecibido.length <= process.env.CANTPARAM) {

      // Obtenemos columna a insertar  y calculamos la última celda.
      const reader = await googleSheets.read(process.env.SPREADSHEETID, "Hoja 1!A2:A");
      const cantidadFilas = reader.length + 1;
      const ultimaFila = cantidadFilas + 1;

      // Buscamos el precio con una regex.
      let re = new RegExp(process.env.REGEXDATE);
      let match = re.exec(mensajeRecibido[1]);

      let dia = [match ? match[1] : null];
      let mes = [match ? match[2] : null];
      let anio = [match ? match[3] : null];

      // Armamos el array para escribir en la planilla
      const values = [[dia + " - " + mensajeRecibido[2], mensajeRecibido[3]]];

      const writer = googleSheets.write(process.env.SPREADSHEETID,
        //process.env.RANGE,
        `Hoja 1!A${ultimaFila}:B${ultimaFila}`,
        values,
        'USER_ENTERED');

    }
    console.log(mensajeRecibido);

  })

module.exports = { flowGastos };
