import { genReplaceEmpty } from '../../../utils/helper'
import { ProductoInputProps } from '../interfaces/producto.interface'

export const productoComposeService = (aql: ProductoInputProps): any => {
  return {
    // codigoProducto: aql.codigoProducto,
    nombre: aql.nombre,
    descripcion: aql.descripcion,
    descripcionHtml: aql.descripcionHtml,
    codigoActividad: aql.codigoActividad?.codigoActividad,
    codigoProductoSin: aql.codigoProductoSin?.codigoProducto,
    precio: aql.precio,
    codigoUnidadMedida: parseInt(
      genReplaceEmpty(aql.codigoUnidadMedida?.codigoClasificador, 0),
      10,
    ),
    tipoProductoId: aql.tipoProducto?._id,
    codigoProveedor: aql.codigoProveedor?.codigo,
    codigoNandina: aql.codigoNandina,
  }
}
