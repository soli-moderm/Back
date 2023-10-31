const typeStatusOrder = {
  ESPERANDO_CONFIRMACION_DE_PAGO: 'Esperando confirmación de pago',
  PAGADA: 'Pagada',
  PAGO_RECHAZADO: 'Pago rechazado',
  PAGO_REQUIERE_ACCION: 'Pago requiere acción',
  LISTA_PARA_ENVIAR: 'Lista para enviar',
  PEDIDO_EN_CAMINO: 'Pedido en camino',
  PAGADA_Y_ENVIADA: 'Pagada y enviada',
  ENTREGADA: 'Entregada',
  DEVUELTA: 'Devuelta',
  CANCELADA: 'Cancelada',
  DELETE: 'Delete',

};

const typeStatusCoupon = {
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO',
  DELETE: 'DELETE',
};

module.exports = { typeStatusOrder, typeStatusCoupon };
