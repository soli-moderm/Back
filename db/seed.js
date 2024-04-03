const axios = require('axios');
const { models } = require('../libs/sequelize');
const iconv = require('iconv-lite');

const fetchDataAndSaveToCodePostalTable = async () => {
  try {
    // Obtener los datos de la URL
    const response = await axios.get(
      'https://www.correosdemexico.gob.mx/datosabiertos/cp/cpdescarga.txt',
      { responseType: 'arraybuffer' }
    );
    const data = iconv.decode(Buffer.from(response.data), 'ISO-8859-1');

    // Separar los datos por salto de línea
    const lines = data.split('\n').slice(2);
    console.log('🚀 ~ fetchDataAndSaveToCodePostalTable ~ lines:', lines);

    // Procesar cada línea y guardarla en la base de datos
    const postalCodes = [];
    for (const [index, line] of lines.entries()) {
      const [
        codigoPostal,
        asentamiento,
        tipoAsentamiento,
        municipio,
        estado,
        ciudad,
        zona,
      ] = line.split('|');
      console.log('🚀 ~ fetchDataAndSaveToCodePostalTable ~ line:', line);

      console.log(
        '🚀 ~ fetchDataAndSaveToCodePostalTable ~ codigoPostal',
        codigoPostal,
        asentamiento,
        tipoAsentamiento,
        municipio,
        estado,
        ciudad,
        zona
      );

      postalCodes.push({
        id: index + 1,
        zipCode: codigoPostal,
        colony: asentamiento,
        settlementType: tipoAsentamiento,
        municipality: municipio,
        state: estado,
        city: ciudad,
        area: zona,
      });
    }

    console.log(
      '🚀 ~ fetchDataAndSaveToCodePostalTable ~ postalCodes:',
      postalCodes
    );
    await models.PostalCode.bulkCreate(postalCodes).catch((error) => {
      console.error('Error al guardar los códigos postales', error);
    });

    console.log('Códigos postales guardados');
  } catch (error) {
    console.error('Error al obtener los datos', error);
  }
};

fetchDataAndSaveToCodePostalTable();
