const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { config } = require('../config/config');

const { models } = require('../libs/sequelize');
const paginate = require('../utils/paginate');
const { Op } = require('sequelize');
const { head } = require('../routes/payment.router');
const { Product } = require('../db/models/product.model');

class InvoicesService {
  constructor() {}

  async create({ body, userId }) {
    const { email, rfc, razons, regimen, codpos, usocfdi, orderId } = body;

    // "nombre": "Cliente prueba ",
    // "apellidos": "Pérez López",
    // "email": "correo@email.com"+,
    // "email2": "otroemail2@email.com",
    // "email3": "otroemail3@email.com",
    // "telefono": "33 3877 7741",
    // "razons": "Cliente prueba "+,
    // "rfc": "XAXX010101000"+,
    // "regimen": 612+,
    // "calle": "Av. Juarez",
    // "numero_exterior": 1234,
    // "numero_interior": "",
    // "codpos": 44640+,
    // "colonia": "Centro",
    // "estado": "Jalisco",
    // "ciudad": "Guadalajara",
    // "delegacion": "

    const order = await models.Order.findOne({
      where: { id: orderId },
    }).catch((error) => boom.badRequest(error));

    const CustomerAddress = await models.CustomerAddress.findOne({
      include: [{ model: models.Customer, as: 'customer', include: ['user'] }],
      where: { id: order.addressId },
    }).catch((error) => boom.badRequest(error));

    const orderProducts = await models.OrderProduct.findAll({
      where: { orderId },
      include: ['product', 'product_variant'],
    }).catch((error) => boom.badRequest(error));

    console.log(
      '🚀 ~ InvoicesService ~ create ~ orderProducts:',
      orderProducts
    );

    const data = {
      name: CustomerAddress.customer.name,
      apellidos: CustomerAddress.customer.lastName,
      telefono: CustomerAddress.customer.phone,
      numero_exterior: CustomerAddress.outdoorNumber,
      numero_interior: CustomerAddress.interiorNumber,
      colonia: CustomerAddress.colony,
      estado: CustomerAddress.state,
      ciudad: CustomerAddress.municipality,
      delegacion: CustomerAddress.colony,
      calle: CustomerAddress.street,
      email,
      rfc,
      razons,
      regimen,
      codpos,
      usocfdi,
      orderId,
    };

    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
          'F-Api-Key': `${config.fApiKey}`,
          'F-Secret-Key': `${config.fApiSecret}`,
        },
      };

      const reponseCreateClient = await axios.post(
        'https://sandbox.factura.com/api/v1/clients/create',
        data,
        options
      );

      const clientInvoice = reponseCreateClient.data.Data;
      //response
      // {
      //   RazonSocial: "Cliente prueba",
      //   RFC: "XAXX010101000",
      //   Regimen: "Sueldos y Salarios e Ingresos Asimilados a Salarios",
      //   RegimenId: "605",
      //   Calle: "San felipe",
      //   Numero: "26",
      //   Interior: "26",
      //   Colonia: "Villas de Guadalupe",
      //   CodigoPostal: "45180",
      //   Ciudad: "Zapopan",
      //   Delegacion: "Zapopan",
      //   Estado: "Jalisco",
      //   Pais: "MEX",
      //   NumRegIdTrib: null,
      //   UsoCFDI: "G01",
      //   Contacto: {
      //     Nombre: null,
      //     Apellidos: "Alva",
      //     Email: "williams.alva@hotmail.com",
      //     Email2: null,
      //     Email3: null,
      //     Telefono: "3315128570",
      //   },
      //   UID: "664a0a1a59ddb",
      //   cfdis: 0,
      //   cuentas_banco: [
      //   ],
      // }

      // data example create invoice

      // {
      //   "Receptor": {
      //     "UID": "6169fc02637e1"
      //   },
      //   "TipoDocumento": "factura",
      //   "Conceptos": [
      //     {
      //       "ClaveProdServ": "81112101",
      //       "Cantidad": 1,
      //       "ClaveUnidad": "E48",
      //       "Unidad": "Unidad de servicio",
      //       "ValorUnitario": 229.9,
      //       "Descripcion": "Desarrollo a la medida",
      //       "Impuestos": {
      //         "Traslados": [
      //           {
      //             "Base": 229.9,
      //             "Impuesto": "002",
      //             "TipoFactor": "Tasa",
      //             "TasaOCuota": "0.16",
      //             "Importe": 36.784
      //           }
      //         ],
      //         "Locales": [
      //           {
      //             "Base": 229.9,
      //             "Impuesto": "ISH",
      //             "TipoFactor": "Tasa",
      //             "TasaOCuota": "0.03",
      //             "Importe": 6.897
      //           }
      //         ]
      //       }
      //     }
      //   ],
      //   "UsoCFDI": "P01",
      //   "Serie": 17317,
      //   "FormaPago": "03",
      //   "MetodoPago": "PUE",
      //   "Moneda": "MXN",
      //   "EnviarCorreo": false
      // }

      const discountInOrder = order.discountAmount;
      const discounForConcept = discountInOrder
        ? discountInOrder / orderProducts.length
        : 0;

      const conceptProduct = orderProducts.map((product) => {
        console.log('🚀 ~ InvoicesService ~ conceptos ~ product:', product);

        //sacar el valor unitario del producto determinando si la orden tiene un descuento por tener un cupon en el campo isCouponApplied aplicado o no
        const discounForProduct = discounForConcept / product.quantity;
        const price = product.unitPrice - discounForProduct;
        const priceWhithoutIVA = price / 1.16;
        const importIVA = price - priceWhithoutIVA;

        return {
          ClaveProdServ: product.classCode,
          Cantidad: product.quantity,
          ClaveUnidad: 'H87',
          Unidad: 'Pieza',
          ValorUnitario: priceWhithoutIVA,
          Descripcion: product.name,
          Impuestos: {
            Traslados: [
              {
                Base: priceWhithoutIVA,
                Impuesto: '002',
                TipoFactor: 'Tasa',
                TasaOCuota: '0.16',
                Importe: importIVA,
              },
            ],
          },
        };
      });

      const dataCreateInvoice ={
        Receptor: {
          UID: clientInvoice.UID
        },
        TipoDocumento: "factura",
        Conceptos:conceptProduct,
        UsoCFDI: "P01",
        Serie: 17317,
        FormaPago: "03",
        MetodoPago: "PUE",
        Moneda: "MXN",
        EnviarCorreo: true,
        

      }

      console.log('🚀 ~ InvoicesService ~ create ~ invoice:', clientInvoice);

      return invoice;
    } catch (error) {
      throw boom.badRequest(error);
    }
  }
}

module.exports = InvoicesService;
