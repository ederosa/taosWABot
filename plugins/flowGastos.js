const { addKeyword } = require('@bot-whatsapp/bot')
const { googleSheets } = require("./googlesheetclient.js");

// Devuelve la columna donde va la fecha y descripción y/o el 
// importe de acuerdo al valor de columns
function getColumn(month, columns) {
  const meses = columns;
  return meses[month];
};

// Agrega cero si es menor de 10
function addZeroToDate(value) {
  if (Number(value) < 10)
    return '0' + value;
  return value
}

// Formatea la fecha
function getDate(rawDate) {

  // Buscamos el precio con una regex.
  let re = new RegExp(process.env.REGEXDATE);
  let match = re.exec(rawDate);
  let fecha = []

  // Y hay match con la regex la distribuye en el array
  if (match != null) {

    fecha.push(addZeroToDate(match[1]));
    fecha.push(addZeroToDate(match[2]));
    fecha.push([match ? match[3] : null]);

  } else {
    // Si la fecha no tiene formato correcto pone fecha de hoy.
    const date = new Date();

    fecha.push(date.getDate());
    fecha.push(date.getMonth() + 1);
    fecha.push(date.getFullYear());
  }

  return fecha;

}

const flowGastos = addKeyword(['gastos', 'gasto'])

  .addAnswer('Hola, intentaremos cargar el gasto!', null, async (ctx) => {

    // Número de celular
    //const numeroDeWhatsapp = ctx.from

    // Construímos un array con los valores recibidos en el mensaje.
    const mensajeRecibido = ctx.body.split(" ");
    // Si el mensaje tiene entre 3 y 4 palabras pasa.
    if (mensajeRecibido.length >= process.env.CANTMINPARAM
      && mensajeRecibido.length <= process.env.CANTPARAM) {

      const formattedDate = getDate(mensajeRecibido[1]);

      const sheetFirstColumn = getColumn(Number(formattedDate[1]) - 1, process.env.PRIMERACOLMESES.split(","));
      const sheetSecondColumn = getColumn(Number(formattedDate[1]), process.env.PRIMERACOLMESES.split(","));
      const sheetRow = process.env.SHEETROW;
      const sheetRange = process.env.SHEETRANGE;

      // Obtenemos columna a insertar  y calculamos la última celda.
      const reader = await googleSheets.read(process.env.SPREADSHEETID, `${sheetRange}!${sheetFirstColumn}${sheetRow}:${sheetFirstColumn}`);
      const cantidadFilas = reader.length + 1;
      const ultimaFila = cantidadFilas + 1;

      let initialPos = 1;

      // Armamos el array para escribir en la planilla
      if (mensajeRecibido.length == process.env.CANTPARAM)
        initialPos = initialPos + 1;

      const values = [[formattedDate[0] + " - " + mensajeRecibido[initialPos], mensajeRecibido[initialPos + 1]]];

      const writer = googleSheets.write(process.env.SPREADSHEETID,
        //process.env.RANGE,
        `${sheetRange}!${sheetFirstColumn}${ultimaFila}:${sheetSecondColumn}${ultimaFila}`,
        values,
        'USER_ENTERED');

    }
  })

module.exports = { flowGastos };
