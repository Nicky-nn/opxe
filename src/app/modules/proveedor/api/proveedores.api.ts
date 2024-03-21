// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { PageInfoProps, PageInputProps } from '../../../interfaces'
import { ProveedorProps } from '../interfaces/proveedor.interface'

/* `const gqlQuery` es una variable constante que almacena una consulta GraphQL. La consulta está solicitando datos.
para una lista de `proveedores` (proveedores) con opciones de paginación y filtrado. La consulta incluye
campos para `pageInfo` (metadatos de paginación) y `docs` (una matriz de objetos `ProveedorProps` con
información del proveedor). La consulta utiliza variables para `limit`, `reverse`, `page` y `query`, que
se pasan como argumentos cuando se ejecuta la consulta. */

const gqlQuery = gql`
  query PROVEEDORES($limit: Int!, $reverse: Boolean, $page: Int!, $query: String) {
    proveedores(limit: $limit, reverse: $reverse, page: $page, query: $query) {
      pageInfo {
        hasNextPage
        hasPrevPage
        totalDocs
        limit
        page
        totalPages
      }
      docs {
        codigo
        nombre
        direccion
        ciudad
        contacto
        correo
        telefono
        state
        createdAt
        updatedAt
        usucre
        usumod
      }
    }
  }
`

interface ProveedorResponse {
  pageInfo: PageInfoProps
  docs: ProveedorProps[]
}

export const apiProveedores = async (
  pageInfo: PageInputProps,
): Promise<ProveedorResponse> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, { ...pageInfo })
  return data.proveedores
}
