import { Grid, TextField } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'

import { ProveedorInputProp } from '../interfaces/proveedor.interface'

interface OwnProps {
  form: UseFormReturn<ProveedorInputProp>
  onSubmit: (data: ProveedorInputProp) => void
}

type Props = OwnProps

const ProveedorForm: FunctionComponent<Props> = ({ form, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={4}>
          <TextField
            {...register('codigo')}
            name="codigo"
            label="Código"
            size="small"
            fullWidth
            error={!!errors.codigo}
            helperText={errors.codigo ? errors.codigo.message : ''}
          />
        </Grid>
        <Grid item xs={12} md={8} lg={8}>
          <TextField
            {...register('nombre')}
            name="nombre"
            label="Nombre Proveedor"
            size="small"
            fullWidth
            error={!!errors.nombre}
            helperText={errors.nombre ? errors.nombre.message : ''}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            {...register('ciudad', { required: 'Este campo es requerido' })}
            name="ciudad"
            label="Ciudad / Ubicación"
            size="small"
            fullWidth
            error={!!errors.ciudad}
            helperText={errors.ciudad ? errors.ciudad.message : ''}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            {...register('direccion')}
            name="direccion"
            label="Dirección"
            size="small"
            fullWidth
            error={!!errors.direccion}
            helperText={errors.direccion ? errors.direccion.message : ''}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            {...register('contacto')}
            name="contacto"
            label="Nombre del contacto"
            size="small"
            fullWidth
            error={!!errors.contacto}
            helperText={errors.contacto ? errors.contacto.message : ''}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TextField
            {...register('correo')}
            name="correo"
            label="Correo Electrónico"
            size="small"
            fullWidth
            error={!!errors.correo}
            helperText={errors.correo ? errors.correo.message : ''}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TextField
            {...register('telefono')}
            name="telefono"
            label="Teléfono"
            size="small"
            fullWidth
            error={!!errors.telefono}
            helperText={errors.telefono ? errors.telefono.message : ''}
          />
        </Grid>
      </Grid>
    </form>
  )
}

export default ProveedorForm
