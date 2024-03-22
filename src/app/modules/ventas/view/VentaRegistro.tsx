import { yupResolver } from '@hookform/resolvers/yup'
import { Card, Divider, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { useForm } from 'react-hook-form'

import AlertLoading from '../../../base/components/Alert/AlertLoading'
import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import SimpleCard from '../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../base/hooks/useAuth'
import usePlantillaDetalleExtra from '../../base/detalleExtra/hook/usePlantillaDetalleExtra'
import Direcciones from '../components/Registro/Direcciones'
import InformacionAdicional from '../components/Registro/InformacionAdicional'
import { FacturaInitialValues, FacturaInputProps } from '../interfaces/factura'
import { VentaRegistroValidator } from '../validator/ventaRegistroValidator'
import DatosActividadEconomica from './registro/DatosActividadEconomica'
import { DatosTransaccionComercial } from './registro/DatosTransaccionComercial'
import { DetalleTransaccionComercial } from './registro/DetalleTransaccionComercial'
import FacturaDetalleExtra from './registro/FacturaDetalleExtra'
import MetodosPago from './registro/MetodosPago'
import VentaTotales from './registro/VentaTotales'

const VentaRegistro = () => {
  const { user } = useAuth()

  const form = useForm<FacturaInputProps>({
    defaultValues: {
      ...FacturaInitialValues,
    },
    // @ts-ignore
    resolver: yupResolver(VentaRegistroValidator),
  })
  // console.log(form.getValues())

  const { pdeLoading, plantillaDetalleExtra } = usePlantillaDetalleExtra()

  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Ventas', path: '/ventas/registro' },
            { name: 'Registrar Exportación' },
          ]}
        />
      </div>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xs={12}>
            <DatosActividadEconomica form={form} />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <DetalleTransaccionComercial form={form} periodoDate={''} />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            {pdeLoading ? (
              <AlertLoading mensaje={'Cargando...'} />
            ) : (
              <FacturaDetalleExtra form={form} detalleExtra={plantillaDetalleExtra} />
            )}
          </Grid>
          <Grid item lg={7} md={12} xs={12}>
            <div style={{ padding: '10px 0' }}>
              <SimpleCard title={'Datos Comercial Exportación'}>
                <Direcciones form={form} />
              </SimpleCard>
            </div>

            <div style={{ padding: '10px 0' }}>
              <SimpleCard title={'Información Adicional'}>
                <InformacionAdicional form={form} />
              </SimpleCard>
            </div>

            <div style={{ padding: '20px 0' }}>
              <SimpleCard title={'Cliente / Método de pago'}>
                <DatosTransaccionComercial form={form} user={user!} />
                <Divider />
                <MetodosPago form={form} />
              </SimpleCard>
            </div>
          </Grid>

          <Grid item lg={5} md={6} xs={12}>
            <Card
              style={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                border: 'none',
                borderWidth: 0,
                borderStyle: 'none',
              }}
            >
              <div style={{ padding: '0px 0' }}>
                <VentaTotales form={form} />
              </div>
            </Card>
          </Grid>
        </Grid>
      </form>
      <Box py="12px" />
    </SimpleContainer>
  )
}

export default VentaRegistro
