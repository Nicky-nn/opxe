// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { PageInfoProps, PageInputProps } from '../../../interfaces'
import { ProductoProps } from '../interfaces/producto.interface'

/**
 * Respuesta de productos
 */
export interface ApiProductoResponse {
  docs: Array<ProductoProps>
  pageInfo: PageInfoProps
}

const query = gql`
  query ALQ_PRODUCTO_LISTADO(
    $limit: Int!
    $reverse: Boolean
    $page: Int!
    $query: String
  ) {
    expoProductoListado(limit: $limit, reverse: $reverse, page: $page, query: $query) {
      pageInfo {
        hasNextPage
        hasPrevPage
        limit
        page
        totalDocs
      }
      docs {
        codigoProducto
        codigoNandina
        state
        nombre
        descripcion
        actividadEconomica {
          codigoCaeb
          descripcion
          tipoActividad
        }
        descripcionHtml
        tipoProducto {
          _id
          descripcion
          codigoParent
        }
        imagen {
          altText
          url
        }
        proveedor {
          codigo
          nombre
          correo
        }
        sinProductoServicio {
          codigoActividad
          codigoProducto
          descripcionProducto
        }
        precio
        precioComparacion
        costo
        unidadMedida {
          codigoClasificador
          descripcion
        }
        state
        usucre
        createdAt
        usumod
        updatedAt
      }
    }
  }
`

export const apiProductos = async (
  pageInfo: PageInputProps,
): Promise<ApiProductoResponse> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query, { ...pageInfo })
  return data.expoProductoListado
}
