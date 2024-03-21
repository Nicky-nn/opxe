import { Edit, MenuOpen } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { useNavigate } from 'react-router-dom'

import AuditIconButton from '../../../../base/components/Auditoria/AuditIconButton'
import SimpleMenu, { SimpleMenuItem } from '../../../../base/components/MyMenu/SimpleMenu'
import { ProductoProps } from '../../interfaces/producto.interface'
import { productosRouteMap } from '../../ProductosRoutesMap'

interface OwnProps {
  row: ProductoProps
  refetch: () => any
}

type Props = OwnProps

const ProductosMenu: FunctionComponent<Props> = (props) => {
  const { row } = props

  const navigate = useNavigate()
  return (
    <>
      <SimpleMenu
        menuButton={
          <>
            <IconButton aria-label="menuGestionRoles">
              <MenuOpen />
            </IconButton>
          </>
        }
      >
        <SimpleMenuItem
          onClick={() => navigate(`${productosRouteMap.modificar}/${row.codigoProducto}`)}
        >
          <Edit />
          Modificar
        </SimpleMenuItem>
      </SimpleMenu>
      <AuditIconButton row={row} />
    </>
  )
}

export default ProductosMenu
