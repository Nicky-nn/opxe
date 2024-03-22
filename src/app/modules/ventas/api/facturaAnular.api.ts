// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { FacturaProps } from '../interfaces/factura'

export const ALQ_ONLINE = gql`
  mutation EXPO_ANULAR($cuf: String!, $codigoMotivo: Int!) {
    facturaExportacionAnular(cuf: $cuf, codigoMotivo: $codigoMotivo) {
      cuf
    }
  }
`

export const fetchFacturaAnular = async (
  cuf: string,
  codigoMotivo: number,
): Promise<FacturaProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  client.setHeader('authorization', `Bearer ${token}`)
  // console.log('cuf', cuf)
  // console.log('codigoMotivo', codigoMotivo)

  const data: any = await client.request(ALQ_ONLINE, { cuf, codigoMotivo })
  return data.facturaExportacionAnular
}
