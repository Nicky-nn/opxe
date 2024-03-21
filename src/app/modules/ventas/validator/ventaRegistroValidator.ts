import { number, object, string } from 'yup'
import * as Yup from 'yup'

export const VentaRegistroValidator = object({
  actividadEconomica: object({
    codigoActividad: string().required(),
  }),
  tipoCliente: string().required(),
  cliente: object({
    codigoCliente: string().required(),
  })
    .nullable()
    .required(),
  emailCliente: string().email().nullable().required(),
  direccionComprador: string()
    .nullable()
    .required('Debe ingresar la direccion del comprador'),
  // tipoCambio: number().min(0),
  puertoDestino: string().min(0).max(500).required('Debe ingresar el puerto de destino'),
  tipoCambio: number().min(0).required('Debe ingresar el tipo de cambio'),
  lugarDestino: string().min(0).max(500).required('Debe ingresar el lugar de destino'),
  incoterm: string().min(0).max(500).required('Debe ingresar el incoterm'),
  incotermDetalle: string().min(0).max(500).required('Debe ingresar el incoterm detalle'),
  numeroDescripcionPaquetesBultos: string(),
  informacionAdicional: string().min(0).max(500),
  codigoPais: number()
    .integer()
    .min(1)
    .max(999)
    .required('Debe ingresar el codigo del pais'),
  // detalle: Yup.array().of(
  //   object({
  //     codigoProductoSin: string().min(1).max(99999999).required(),
  //     codigoProducto: string().min(1).max(50).required(),
  //     descripcion: string().min(1).max(500).required(),
  //     cantidad: number().min(0).required(),
  //     // codigoUnidadMedida: number().integer().min(1).required(),
  //     precioUnitario: number().min(0).required(),
  //     montoDescuento: number().min(0),
  //     codigoNandina: string().min(0).max(50),
  //   }),
  // ),
})
