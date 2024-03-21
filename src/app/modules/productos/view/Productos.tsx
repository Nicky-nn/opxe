import { Newspaper } from '@mui/icons-material'
import { Button, Grid, Paper, Stack } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import AuthContext from '../../../base/contexts/JWTAuthContext'
import ProductosListado from './listado/ProductosListado'

const Productos = () => {
  const { user } = useContext(AuthContext)
  // in this case *props are stored in the state of parent component

  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Servicio', path: '/productos/gestión' },
            { name: 'Gestión de servicios' },
          ]}
        />
      </div>
      <Paper
        elevation={0}
        variant="elevation"
        square
        // sx={{ mb: 2, p: 0.5, bgcolor: 'primary.main', color: 'primary.contrastText' }}
        sx={{ mb: 2, p: 0.5, bgcolor: '#FAFAFA' }}
        className={'asideSidebarFixed'}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          style={{ marginTop: 2 }}
          spacing={{ xs: 1, sm: 1, md: 1, xl: 1 }}
          justifyContent="flex-end"
        >
          <Button
            size={'small'}
            variant="contained"
            component={RouterLink}
            to="/productos/nuevo"
            startIcon={<Newspaper />}
            color={'success'}
          >
            Nuevo Servicio
          </Button>
        </Stack>
      </Paper>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} xs={12}>
          <ProductosListado />
        </Grid>
      </Grid>
      <Box py="12px" />
    </SimpleContainer>
  )
}

export default Productos
