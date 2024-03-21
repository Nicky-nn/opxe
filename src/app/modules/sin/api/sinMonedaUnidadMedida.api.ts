// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { SinTipoMonedaProps, SinUnidadMedidaProps } from '../interfaces/sin.interface'

interface ApiSinMonedaUnidadMedidaResponse {
  sinTipoMoneda: SinTipoMonedaProps[]
  sinUnidadMedida: SinUnidadMedidaProps[]
}

const gqlQuery = gql`
  query TIPO_MONEDA_UNIDAD_MEDIDA {
    sinTipoMoneda {
      codigoClasificador
      descripcion
    }
    sinUnidadMedida {
      codigoClasificador
      descripcion
    }
  }
`

/**
 * @description Doble servicio de obtencion de tipos de moneda y unidades de medida
 */
export const apiSinMonedaUnidadMedida =
  async (): Promise<ApiSinMonedaUnidadMedidaResponse> => {
    try {
      const client = new GraphQLClient(import.meta.env.ISI_API_URL)
      const token = localStorage.getItem(AccessToken)
      // Set a single header
      client.setHeader('authorization', `Bearer ${token}`)
      const data: any = await client.request(gqlQuery)
      return data
    } catch (e: any) {
      throw new MyGraphQlError(e)
    }
  }
