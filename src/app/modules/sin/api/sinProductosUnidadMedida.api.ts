// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import {
  SinProductoServicioProps,
  SinUnidadMedidaProps,
} from '../interfaces/sin.interface'

interface ApiProductoServicioUnidadMedidaResponse {
  sinProductoServicioPorDocumentoSector: SinProductoServicioProps[]
  sinUnidadMedida: SinUnidadMedidaProps[]
}

const gqlQuery = gql`
  query PRODUCTO_SERVICIO_POR_ACTIVIDAD_UNIDAD_MEDIDA($codigoDocumentoSector: Int!) {
    sinProductoServicioPorDocumentoSector(codigoDocumentoSector: $codigoDocumentoSector) {
      codigoActividad
      codigoProducto
      descripcionProducto
    }
    sinUnidadMedida {
      codigoClasificador
      descripcion
    }
  }
`

/**
 * @description Desplegamos el listado de productos y unidades de medida
 */
export const apiProductoServicioUnidadMedida =
  async (): Promise<ApiProductoServicioUnidadMedidaResponse> => {
    try {
      const client = new GraphQLClient(import.meta.env.ISI_API_URL)
      const token = localStorage.getItem(AccessToken)
      const codigoDocumentoSector = parseInt(
        import.meta.env.ISI_DOCUMENTO_SECTOR.toString(),
      )
      client.setHeader('authorization', `Bearer ${token}`)
      return await client.request(gqlQuery, { codigoDocumentoSector })
    } catch (e: any) {
      throw new MyGraphQlError(e)
    }
  }
