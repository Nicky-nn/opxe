import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { isEmptyValue, validateEmail } from '../../../../utils/helper'
import { notSuccess } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiFcvReenvioEmails } from '../../api/facturaReenvioEmail.api'
import { FacturaProps } from '../../interfaces/factura'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: any) => void
  factura: FacturaProps | null
}

type Props = OwnProps

const ReenviarEmailsDialog: FunctionComponent<Props> = (props: Props) => {
  const { onClose, open, factura, ...other } = props
  const [emails, setEmails] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setEmails(factura?.cliente.email || '')
      setTags([factura?.cliente.email || ''])
    }
  }, [open])

  const handleCancel = () => {
    onClose()
  }

  const handleOk = async () => {
    let aux = true
    if (!factura?.cuf) {
      toast.error('Seleccione el documento')
      aux = false
    }
    if (isEmptyValue(emails) && tags.length === 0) {
      // Actualización
      toast.error('Debe registrar al menos un correo electrónico')
      aux = false
    }

    // console.log('tags', tags)
    for (const tag of tags) {
      if (!validateEmail(tag)) {
        toast.error(`${tag} no es un correo electrónico válido`)
        aux = false
      }
    }

    if (aux) {
      await swalAsyncConfirmDialog({
        preConfirm: () => {
          return apiFcvReenvioEmails({
            cuf: factura?.cuf!,
            emails: tags, // Cambio aquí
          }).catch((err) => {
            swalException(err)
            return false
          })
        },
      }).then((resp) => {
        if (resp.isConfirmed) {
          notSuccess()
          onClose(resp.value)
        }
      })
      // console.log('emails', emails)
    }
  }

  const handleAddTag = () => {
    if (!isEmptyValue(emails) && validateEmail(emails)) {
      const lowerCaseEmails = emails.toLowerCase()
      if (!tags.includes(lowerCaseEmails)) {
        setTags([...tags, lowerCaseEmails])
        setEmails('')
      }
    }
  }

  const handleDeleteTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 560 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Reenviar Notificación de Factura</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12}>
              Nro Factura: {factura?.numeroFactura || ''} <br />
              Cliente: {factura?.cliente.razonSocial || ''} <br />
              Fecha Emisión: {factura?.fechaEmision || ''} <br />
              Código de control CUF: {factura?.cuf || ''} <br />
            </Grid>
            <Grid item lg={12} md={12}>
              <Alert severity="info">
                Para ingresar varios correos electrónicos, ingrese el correo electrónico
                válido y a continuación presione teclas de : Enter, espacios, comas o
                punto y coma. Por ejemplo: cliente1@correo.com, cliente2@correo.com.
              </Alert>
            </Grid>
            <Grid item lg={12} md={12}>
              <TextField
                id="emails"
                name="emails"
                label="Ingrese los correos electrónicos"
                helperText="El botón se activará cuando ingrese un correo electrónico válido. Recuerde presionar la tecla Enter para agregar el correo electrónico."
                size="small"
                fullWidth
                multiline
                rows={2}
                value={emails}
                onChange={(event) => {
                  const value = event.target.value.replace(/[\r\n]+/g, '')
                  setEmails(value)
                }}
                onKeyDown={(event) => {
                  if (
                    (event.key === 'Enter' ||
                      event.key === ' ' ||
                      event.key === ',' ||
                      event.key === ';') &&
                    !isEmptyValue(emails) &&
                    validateEmail(emails)
                  ) {
                    handleAddTag()
                    setEmails('')
                    ;(event.target as HTMLInputElement).value = '' // Eliminar los datos del input
                    event.preventDefault()
                  }
                }}
              />
            </Grid>
            <Grid item lg={12} md={12}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="primary"
                  variant="outlined"
                  style={{ margin: 5 }}
                />
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            size={'small'}
            variant={'contained'}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <LoadingButton
            variant={'contained'}
            size={'small'}
            onClick={handleOk}
            loading={loading}
            style={{ marginRight: 15 }}
            disabled={!isEmptyValue(emails)} // Bloquear el botón si el campo de correo electrónico no está vacío
          >
            Enviar Notificación
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default ReenviarEmailsDialog
