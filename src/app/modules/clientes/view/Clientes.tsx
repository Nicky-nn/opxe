import { Grid } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { FunctionComponent } from 'react'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import ClientesListado from './Listado/ClientesListado'

interface OwnProps {}

type Props = OwnProps

const Clientes: FunctionComponent<Props> = () => {
  return (
    <Container maxWidth="xl">
      <SimpleContainer>
        <div className="breadcrumb">
          <Breadcrumb
            routeSegments={[{ name: 'Gestion de clientes', path: '/clientes/gestion' }]}
          />
        </div>
        <form noValidate>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} xs={12}>
              <ClientesListado />
            </Grid>
          </Grid>
        </form>
        <Box py="12px" />
      </SimpleContainer>
    </Container>
  )
}

export default Clientes
