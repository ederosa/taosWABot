const generalFunctions = {
  obtenerFechaFormateada: (dateToFormat, time) => {
    let date_time = dateToFormat;
    // get current date
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);
    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    // get current year
    let year = date_time.getFullYear();
    // get current hours
    let hours = (date_time.getHours() < 10 ? "0" + date_time.getHours() : date_time.getHours());
    // get current minutes
    let minutes = (date_time.getMinutes() < 10 ? "0" + date_time.getMinutes() : date_time.getMinutes());
    // get current seconds
    let seconds = (date_time.getSeconds() < 10 ? "0" + date_time.getSeconds() : date_time.getSeconds());

    if (time)
      return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

    return (year + "-" + month + "-" + date);
  },

  formatearRubrosBancoCiudad: (rubro) => {
    return rubro.replaceAll(" ", "-")
      .replaceAll("á", "a")
      .replaceAll("é", "e")
      .replaceAll("í", "i")
      .replaceAll("ó", "o")
      .replaceAll("ú", "u");
  },

  formatearRubrosUala: (rubro) => {
    return rubro.replaceAll(" ", "+");
  },


  generateRandomUA: () => {
    // Array of random user agents
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
    ];
    // Get a random index based on the length of the user agents array 
    const randomUAIndex = Math.floor(Math.random() * userAgents.length);
    // Return a random user agent using the index above
    return userAgents[randomUAIndex];
  }
}
module.exports = { generalFunctions };
