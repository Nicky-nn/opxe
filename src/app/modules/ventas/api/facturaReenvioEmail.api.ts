// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'

const mutation = gql`
  mutation ALQUI_REENVIAR_EMAIL($cuf: String!, $emails: [String]!) {
    facturaExportacionReenviarEmail(cuf: $cuf, emails: $emails)
  }
`

/**
 * @description Envio de multiples notificaciones por correo
 * @param input
 */
export const apiFcvReenvioEmails = async (input: {
  cuf: string
  emails: string[]
}): Promise<boolean> => {
  // console.log('apiFcvReenvioEmails', input)
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  // console.log('apiFcvReenvioEmails', input)
  const data: any = await client.request(mutation, input)
  return data
}
