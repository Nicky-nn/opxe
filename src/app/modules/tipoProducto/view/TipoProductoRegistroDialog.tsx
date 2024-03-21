import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { FunctionComponent, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { notSuccess } from '../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiTipoProductoRegistro } from '../api/tipoProductoRegistro.api'
import {
  TIPO_PRODUCTO_INITIAL_VALUES,
  TipoProductoInputProp,
  TipoProductoProps,
} from '../interfaces/tipoProducto.interface'
import { tipoProductoRegistroValidationSchema } from '../validator/tipoProductoRegistro.validator'
import TipoProductoForm from './TipoProductoForm'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  // eslint-disable-next-line no-unused-vars
  onClose: (value?: TipoProductoProps) => void
}

type Props = OwnProps

const TipoProductoDialogRegistro: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props

  const form = useForm<TipoProductoInputProp>({
    defaultValues: {
      ...TIPO_PRODUCTO_INITIAL_VALUES,
    } as TipoProductoInputProp,
    resolver: yupResolver<any>(tipoProductoRegistroValidationSchema),
  })

  const onSubmit: SubmitHandler<TipoProductoInputProp> = async (values) => {
    const val = await tipoProductoRegistroValidationSchema
      .validate(values)
      .catch((e) => e.errors)
    if (val.length > 0) {
      notSuccess(val.join('<br>'))
    } else {
      await swalAsyncConfirmDialog({
        preConfirm: async () => {
          const resp = await apiTipoProductoRegistro(values).catch((e) => ({ error: e }))
          if (resp && (resp as { error: any }).error) {
            swalException((resp as { error: any }).error)
            return false
          }
          return resp
        },
      }).then((resp) => {
        if (resp.isConfirmed) {
          notSuccess()
          onClose(resp.value)
        }
        if (resp.isDenied) {
          swalException(resp.value)
        }
        return
      })
    }
  }

  const onErrors = (errors: any, e: any) => console.log(errors, e)
  useEffect(() => {
    form.reset()
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 500 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Registrar nuevo clasificador de productos</DialogTitle>
        <DialogContent dividers>
          <TipoProductoForm form={form} />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            size={'small'}
            variant={'contained'}
            onClick={() => {
              onClose()
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit, onErrors)}
            style={{ marginRight: 25 }}
            size={'small'}
            variant={'contained'}
          >
            Registrar Clasificador
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TipoProductoDialogRegistro
