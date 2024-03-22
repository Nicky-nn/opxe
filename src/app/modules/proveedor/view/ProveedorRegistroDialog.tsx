import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { FunctionComponent, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { genRandomString } from '../../../utils/helper'
import { notError, notSuccess } from '../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiProveedorRegistro } from '../api/XproveedorRegistro.api'
import {
  PROVEEDOR_INITIAL_VALUES,
  ProveedorInputProp,
  ProveedorProps,
} from '../interfaces/proveedor.interface'
import { proveedorRegistroComposeService } from '../services/proveedorRegistroComposerService'
import { proveedorRegistroValidator } from '../validator/productoRegistroValidator'
import { proveedorRegistroValidationSchema } from '../validator/proveedorRegistro.validator'
import ProveedorForm from './ProveedorForm'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  // eslint-disable-next-line no-unused-vars
  onClose: (value?: ProveedorProps) => void
}

type Props = OwnProps

const ProveedorRegistro: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props

  const form = useForm<ProveedorInputProp>({
    defaultValues: { ...PROVEEDOR_INITIAL_VALUES },
    resolver: yupResolver<any>(proveedorRegistroValidationSchema),
  })
  const onSubmit: SubmitHandler<ProveedorInputProp> = async (values) => {
    const val = await proveedorRegistroValidator(values)
    if (val.length > 0) {
      notError(val.join('<br>'))
    } else {
      const apiInput = proveedorRegistroComposeService(values)
      await swalAsyncConfirmDialog({
        preConfirm: async () => {
          try {
            // @ts-ignore
            const resp = await apiProveedorRegistro(apiInput).catch((e) => ({
              error: e,
            }))
            if ((resp as { error: any }).error) {
              swalException((resp as { error: any }).error)
              return false
            }
            return resp
          } catch (error) {
            swalException(error)
            return false
          }
        },
      }).then((resp) => {
        if (resp && resp.isConfirmed) {
          notSuccess()
          onClose(resp.value)
        } else if (resp && resp.isDenied) {
          swalException(resp.value)
        }
      })
    }
  }

  const onError = (errors: any, e: any) => console.log(errors, e)
  useEffect(() => {
    if (open) {
      form.reset({
        ...PROVEEDOR_INITIAL_VALUES,
        codigo: genRandomString().toUpperCase(),
      })
    }
  }, [open])

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 500 } }}
      maxWidth="sm"
      open={open}
      {...other}
    >
      <DialogTitle>Registrar nuevo Proveedor</DialogTitle>
      <DialogContent dividers>
        <ProveedorForm form={form} />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          color={'error'}
          size={'small'}
          variant={'contained'}
          onClick={() => onClose()}
        >
          Cancelar
        </Button>
        <Button
          onClick={form.handleSubmit(onSubmit, onError)}
          size={'small'}
          style={{ marginRight: 25 }}
          variant={'contained'}
          disabled={form.formState.isSubmitting}
        >
          Registrar Proveedor
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProveedorRegistro
