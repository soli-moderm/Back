const axios = require('axios');
const { config } = require('../config/config');
const { models } = require('../libs/sequelize');
const { array, object } = require('joi');

const favoriteNameProvider = [
  'DHL',
  'FEDEX',
  'TRESGUERRAS',
  'PAQUETEEXPRESS',
  'TRESGUERRAS',
  'REDPACK',
  'ESTAFETA',
];

const bestProviderFn = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const rates = data.included.filter((item) => item.type === 'rates');

      const othersProvider = [];
      const favoritesProvider = [];

      rates.forEach((item) => {
        const nameProviderItem = item.attributes.provider.toUpperCase();
        if (favoriteNameProvider.includes(nameProviderItem)) {
          favoritesProvider.push(item);
        } else {
          othersProvider.push(item);
        }
      });

      let lowestRate = Infinity;
      let bestProvider = null;

      const providers =
        favoritesProvider.length === 0 ? othersProvider : favoritesProvider;
      providers.forEach((rate) => {
        const cost = parseFloat(rate.attributes.total_pricing);

        if (cost < lowestRate) {
          lowestRate = cost;
          bestProvider = {
            provider: rate.attributes.provider,
            service_level_name: rate.attributes.service_level_name,
            total_pricing: rate.attributes.total_pricing,
            id: rate.id,
          };
        }
      });

      resolve(bestProvider);
    } catch (error) {
      reject(error);
    }
  });
};

class ShipmentsService {
  async createShipment(order) {
    console.log(
      '🚀 ~ file: shipments.service.js:7 ~ ShipmentsService ~ createShipment ~ order:',
      order
    );
    const company = await models.Company.findByPk(1);
    console.log(
      '🚀 ~ file: shipments.service.js:8 ~ ShipmentsService ~ createShipment ~ company:',
      company
    );

    const orderProducts = await models.OrderProduct.findAll({
      include: [{ model: models.Product, as: 'product' }],
      where: { orderId: order.id },
    });
    console.log(
      '🚀 ~ file: shipments.service.js:13 ~ ShipmentsService ~ createShipment ~ orderProducts:',
      orderProducts
    );

    const parcelsGroupedByclassCodeAndPackagingCode = orderProducts.reduce(
      (acc, parcel) => {
        const key = `${parcel.product.classCode}-${parcel.product.packagingCode}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(parcel);
        return acc;
      },
      {}
    );
    console.log(
      '🚀 ~ file: shipments.service.js:26 ~ ShipmentsService ~ createShipment ~ parcelsGroupedByclassCodeAndPackagingCode:',
      parcelsGroupedByclassCodeAndPackagingCode
    );

    const productsParcels = Object.keys(
      parcelsGroupedByclassCodeAndPackagingCode
    ).map((key) => {
      const parcelsGroups = parcelsGroupedByclassCodeAndPackagingCode[key].map(
        (parcel) => {
          const quantity = parcel.quantity;
          const product = {
            weight: parcel.product.packageWeight,
            distance_unit: 'CM',
            mass_unit: 'KG',
            height: parcel.product.packageHeight,
            width: parcel.product.packageWidth,
            length: parcel.product.packageLength,
          };

          const packages = Array.from({ length: quantity }, () => ({
            ...product,
          }));

          return packages;
        }
      );

      const parcels = parcelsGroups.flat();

      return {
        parcels,
        consignment_note_class_code:
          parcelsGroupedByclassCodeAndPackagingCode[key][0].product.classCode,
        consignment_note_packaging_code:
          parcelsGroupedByclassCodeAndPackagingCode[key][0].product
            .packagingCode,
      };
    });
    console.log(
      '🚀 ~ file: shipments.service.js:52 ~ ShipmentsService ~ createShipment ~ productsParcels:',
      productsParcels
    );

    const CustomerAddress = await models.CustomerAddress.findOne({
      include: [{ model: models.Customer, as: 'customer', include: ['user'] }],
      where: { id: order.addressId },
    });
    console.log(
      '🚀 ~ file: shipments.service.js:58 ~ ShipmentsService ~ createShipment ~ CustomerAddress:',
      CustomerAddress
    );

    const Shipments = productsParcels.map((productParcel) => {
      return {
        address_from: {
          province: company.state,
          city: company.municipality,
          name: company.name,
          zip: company.zipCode,
          country: 'MX',
          address1: company.street,
          company: company.CompanyName,
          address2: company.colony,
          phone: company.phone,
          email: company.email,
        },
        parcels: productParcel.parcels,
        address_to: {
          province: CustomerAddress.state,
          city: CustomerAddress.municipality,
          name: CustomerAddress.name,
          zip: CustomerAddress.zipCode,
          country: 'MX',
          address1: CustomerAddress.street,
          company: CustomerAddress.company,
          address2: CustomerAddress.colony,
          phone: CustomerAddress.customer.phone,
          email: CustomerAddress.customer.user.email,
          reference: CustomerAddress.additionalIndications,
        },
        consignment_note_class_code: productParcel.consignment_note_class_code,
        consignment_note_packaging_code:
          productParcel.consignment_note_packaging_code,
      };
    });
    console.log(
      '🚀 ~ file: shipments.service.js:94 ~ ShipmentsService ~ Shipments ~ Shipments:',
      Shipments
    );

    const responses = [];
    const errors = [];

    await Promise.all(
      Shipments.map(async (shipment) => {
        try {
          const options = {
            headers: {
              Authorization: `Token token=${config.tokenSecretSkydropxDemo}`,
              'Content-Type': 'application/json',
            },
          };

          const response = await axios.post(
            'https://api-demo.skydropx.com/v1/shipments',
            shipment,
            options
          );
          console.log(
            '🚀 ~ file: shipments.service.js:135 ~ ShipmentsService ~ Shipments.map ~ response:',
            response
          );
          responses.push(response.data);
        } catch (error) {
          console.log(
            '🚀 ~ file: shipments.service.js:137 ~ ShipmentsService ~ Shipments.map ~ error:',
            error
          );
          errors.push(error);
        }
      })
    );

    console.log(
      '🚀 ~ file: shipments.service.js:141 ~ ShipmentsService ~ createShipment ~ responses:',
      responses
    );

    const labels = [];

    const labelsErrors = [];

    await Promise.all(
      responses.map(async (response) => {
        const bestProvider = await bestProviderFn(response);
        console.log(
          '🚀 ~ ShipmentsService ~ createShipment ~ bestProvider:',
          bestProvider
        );
        try {
          const options = {
            headers: {
              Authorization: `Token token=${config.tokenSecretSkydropxDemo}`,
              'Content-Type': 'application/json',
            },
          };
          const label = await axios.post(
            `https://api-demo.skydropx.com/v1/labels`,
            {
              rate_id: Number(bestProvider?.id),
              label_format: 'pdf',
            },
            options
          );
          console.log('🚀 ~ ShipmentsService ~ createShipment ~ label:', label);
          labels.push(label.data);
        } catch (error) {
          console.log('🚀 ~ ShipmentsService ~ createShipment ~ error:', error);
          labelsErrors.push(error);
        }
      })
    );
    console.log('🚀 ~ ShipmentsService ~ createShipment ~ labels:', labels);
    // save labels in db

    const lasbelsinDB = await Promise.all(
      labels.map(async (label) => {
        const newLabel = await models.Shipments.create({
          orderId: order.id,
          labelId: label.data.id,
          status: label.data.attributes.status,
          trackingNumber: label.data.attributes.tracking_number,
          trackingStatus: label.data.attributes.tracking_status,
          labelUrl: label.data.attributes.label_url,
          trackingUrlProvider: label.data.attributes.tracking_url_provider,
          rateId: label.data.attributes.rate_id,
        }).catch((error) => {
          console.log('🚀 ~ ShipmentsService ~ createShipment ~ error:', error);
          throw new Error(error);
        });
        return newLabel;
      })
    );
    console.log(
      '🚀 ~ ShipmentsService ~ createShipment ~ lasbelsinDB:',
      lasbelsinDB
    );

    return labels;
  }
}

module.exports = ShipmentsService;
