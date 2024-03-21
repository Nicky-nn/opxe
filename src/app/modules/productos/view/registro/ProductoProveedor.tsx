import { Button, FormControl, Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { FunctionComponent, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'

import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import { PageInputProps } from '../../../../interfaces'
import { apiProveedores } from '../../../proveedor/api/proveedores.api'
import { ProveedorProps } from '../../../proveedor/interfaces/proveedor.interface'
import ProveedorRegistroDialog from '../../../proveedor/view/ProveedorRegistroDialog'
import { ProductoInputProps } from '../../interfaces/producto.interface'

interface OwnProps {
  form: UseFormReturn<ProductoInputProps>
}

type Props = OwnProps

const ProductoProveedor: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      formState: { errors },
    },
  } = props

  // const {formik} = props;
  // const {values, setFieldValue} = formik

  const [openDialog, setOpenDialog] = useState(false)

  const { data: proveedores, refetch } = useQuery<ProveedorProps[], Error>({
    queryKey: ['productoProveedores', openDialog],
    queryFn: async () => {
      const pageInput: PageInputProps = {
        page: 1,
        limit: 1000,
        reverse: true,
      }
      const { docs } = await apiProveedores(pageInput)
      return docs
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  return (
    <SimpleCard title={'Proveedor'}>
      <Grid container spacing={1}>
        <Grid item lg={12} md={12} xs={12}>
          <Controller
            control={control}
            name={'codigoProveedor'}
            render={({ field }) => (
              <FormControl fullWidth>
                <MyInputLabel shrink>Seleccione su proveedor</MyInputLabel>
                <Select<ProveedorProps>
                  {...field}
                  styles={reactSelectStyle(Boolean(errors.codigoProveedor))}
                  menuPosition={'fixed'}
                  name="codigoProveedor"
                  placeholder={'Seleccione proveedor...'}
                  value={field.value}
                  onChange={(proveedor: any) => {
                    field.onChange(proveedor)
                  }}
                  options={proveedores}
                  isClearable={true}
                  getOptionValue={(ps) => ps.codigo}
                  getOptionLabel={(ps) => `${ps.codigo} - ${ps.nombre}`}
                />
              </FormControl>
            )}
          />
        </Grid>

        <Grid item lg={12} md={12} xs={12} textAlign={'right'}>
          <Button variant={'outlined'} onClick={() => setOpenDialog(true)} size={'small'}>
            Nuevo Proveedor
          </Button>
          <ProveedorRegistroDialog
            id={'proveedorRegistroDialog'}
            keepMounted={false}
            open={openDialog}
            onClose={(value?: ProveedorProps) => {
              if (value) {
                setValue('codigoProveedor', value)
                refetch().then()
              }
              setOpenDialog(false)
            }}
          />
        </Grid>
      </Grid>
    </SimpleCard>
  )
}

export default ProductoProveedor
