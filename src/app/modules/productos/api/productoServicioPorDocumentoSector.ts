// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import {
  SinProductoServicioProps,
  SinUnidadMedidaProps,
} from '../../sin/interfaces/sin.interface'

interface apiProductoServicioUnidadMedidaProps {
  sinProductoServicioPorDocumentoSector: SinProductoServicioProps[]
  sinUnidadMedida: SinUnidadMedidaProps[]
}

const gqlQuery = gql`
  query PRODUCTOS_SERVICIO_UNIDAD_MEDIDA($codigoDocumentoSector: Int!) {
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
 * @description Listamos los productos por documento sector y unidades
 */
export const apiProductoServicioUnidadMedida =
  async (): Promise<apiProductoServicioUnidadMedidaProps> => {
    try {
      const client = new GraphQLClient(import.meta.env.ISI_API_URL)
      const token = localStorage.getItem(AccessToken)
      const codigoDocumentoSector = import.meta.env.ISI_DOCUMENTO_SECTOR
      // Set a single header
      client.setHeader('authorization', `Bearer ${token}`)
      console.log('codigoDocumentoSector', codigoDocumentoSector)
      return await client.request(gqlQuery, { codigoDocumentoSector })
    } catch (e: any) {
      throw new MyGraphQlError(e)
    }
  }
