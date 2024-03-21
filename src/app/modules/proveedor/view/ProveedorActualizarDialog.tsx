import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FunctionComponent, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { actionForm } from '../../../interfaces'
import { notError, notSuccess } from '../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiProveedorActualizar } from '../api/proveedorActualizar.api'
import {
  PROVEEDOR_INITIAL_VALUES,
  ProveedorInputProp,
  ProveedorProps,
} from '../interfaces/proveedor.interface'
import { proveedorDecomposeService } from '../services/proveedorDecomposeService'
import { proveedorRegistroValidator } from '../validator/productoRegistroValidator'
import { proveedorRegistroValidationSchema } from '../validator/proveedorRegistro.validator'
import ProveedorForm from './ProveedorForm'

interface OwnProps {
  // codigo: string
  keepMounted: boolean
  open: boolean
  proveedor: ProveedorProps
  // eslint-disable-next-line no-unused-vars
  onClose: (value?: ProveedorProps) => void
}

type Props = OwnProps

const ProveedorActualizar: FunctionComponent<Props> = (props) => {
  const { onClose, open, proveedor, ...other } = props

  const form = useForm<ProveedorInputProp>({
    defaultValues: {
      ...PROVEEDOR_INITIAL_VALUES,
      action: actionForm.UPDATE,
    } as ProveedorInputProp, // Add the type assertion here
    resolver: yupResolver<any>(proveedorRegistroValidationSchema),
  })

  const onSubmit: SubmitHandler<ProveedorInputProp> = async (values) => {
    const val = await proveedorRegistroValidator(values)
    // eslint-disable-next-line no-unused-vars
    const { codigo, action, ...valuesWithoutCodigo } = values
    if (val.length > 0) {
      notError(val.join('<br>'))
    } else {
      await swalAsyncConfirmDialog({
        preConfirm: async () => {
          const resp = await apiProveedorActualizar(
            codigo || '',
            valuesWithoutCodigo,
          ).catch((e) => ({ error: e }))
          if (resp && (resp as { error: any }).error) {
            // Add type assertion here
            swalException((resp as { error: any }).error) // Add type assertion here
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

  const onError = (error: any, e: any) => {
    console.error('Error:', error, e)
  }

  useEffect(() => {
    if (proveedor && open) {
      form.reset(proveedorDecomposeService(proveedor, actionForm.UPDATE))
    }
  }, [open])

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 500 } }}
      maxWidth="sm"
      open={open}
      {...other}
    >
      <DialogTitle>Editar Proveedor {form.control._formValues.codigo}</DialogTitle>
      <DialogContent dividers>
        <ProveedorForm form={form} />
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
          onClick={form.handleSubmit(onSubmit, onError)}
          size={'small'}
          style={{ marginRight: 25 }}
          variant={'contained'}
        >
          Actualizar Proveedor
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProveedorActualizar
