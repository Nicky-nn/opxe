import { Box } from '@mui/system'
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import React, { FC, useMemo } from 'react'

import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import { genReplaceEmpty } from '../../../utils/helper'
import {
  MuiDisplayColumnDefOptions,
  MuiTableProps,
} from '../../../utils/muiTable/materialReactTableUtils'
import {
  ReporteVentasPorGestionComposeProps,
  ReporteVentasUsuarioDetalleComposeProps,
} from '../services/reporteVentasUsuarioCompose'

interface OwnProps {
  data: ReporteVentasPorGestionComposeProps
}

type Props = OwnProps

const ReporteNroVentasUsuario: FC<Props> = (props) => {
  const { data } = props
  const columns = useMemo<MRT_ColumnDef<ReporteVentasUsuarioDetalleComposeProps>[]>(
    () => [
      {
        accessorKey: 'mesTexto',
        header: 'Mes',
        size: 100,
      },
      {
        accessorKey: 'nroPendientes',
        header: 'Nro. Pendientes',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 100,
      },
      {
        accessorKey: 'nroValidadas',
        header: 'Nro. Validadas',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 110,
      },
      {
        accessorKey: 'nroAnuladas',
        header: 'Nro. Anulados',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 110,
      },
      {
        accessorKey: 'nroParcialFacturas',
        header: 'SUB-TOTAL',
        muiTableBodyCellProps: {
          align: 'right',
          sx: (theme) => ({
            color: theme.palette.primary.light,
            fontWeight: 500,
          }),
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 120,
      },
    ],
    [],
  )
  return (
    <>
      <Box>
        <MaterialReactTable
          columns={columns as MRT_ColumnDef<any, any>[]}
          data={data.detalle || []}
          initialState={{
            density: 'compact',
          }}
          // Cambiando estilos de la tabla
          localization={MRT_Localization_ES}
          displayColumnDefOptions={MuiDisplayColumnDefOptions}
          muiTableProps={MuiTableProps}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          muiTableBodyRowProps={{ hover: false }}
        />
      </Box>
    </>
  )
}

export default ReporteNroVentasUsuario
