import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { FunctionComponent, useState } from 'react'

import { ProductoProps } from '../interfaces/producto.interface'
import ProductosVariantes from './ProductosVariantes'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  // eslint-disable-next-line no-unused-vars
  onClose: (value?: ProductoProps[]) => void
  codigoActividad: string
}

type Props = OwnProps

const ProductoExplorarDialog: FunctionComponent<Props> = (props) => {
  const { onClose, codigoActividad, open, ...other } = props
  const [rowSelection, setProductosVariantes] = useState<ProductoProps[]>([])
  const handleAddProds = () => {
    if (rowSelection.length > 0) {
      onClose(rowSelection)
    }
  }

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 750 } }}
        maxWidth="xl"
        open={open}
        {...other}
      >
        <DialogTitle>Explorar Servicios</DialogTitle>
        <DialogContent dividers>
          <ProductosVariantes
            codigoActividad={codigoActividad}
            setProductosVariantes={setProductosVariantes}
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', marginLeft: 10 }}>
          <Button
            autoFocus
            color={'error'}
            size={'small'}
            variant={'contained'}
            onClick={() => onClose()}
          >
            Cerrar
          </Button>
          <Button
            sx={{ mr: 2 }}
            disabled={rowSelection.length === 0}
            autoFocus
            color={'primary'}
            size={'small'}
            variant={'contained'}
            onClick={() => handleAddProds()}
          >
            Adicionar Servicio
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ProductoExplorarDialog
