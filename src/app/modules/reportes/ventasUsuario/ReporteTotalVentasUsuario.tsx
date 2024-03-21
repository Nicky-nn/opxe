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

const ReporteTotalVentasUsuario: FC<Props> = (props) => {
  const { data } = props
  const columns = useMemo<MRT_ColumnDef<ReporteVentasUsuarioDetalleComposeProps>[]>(
    () => [
      {
        accessorKey: 'usuario',
        header: 'Nombre de Usuario',
      },
      {
        accessorKey: 'montoValidadas',
        header: 'Monto Total Validadas',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 150,
      },
      {
        accessorKey: 'montoAnuladas',
        header: 'Monto Total Anulados',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 150,
      },
      {
        accessorKey: 'montoParcialFacturas',
        header: 'SUB-TOTAL',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
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

export default ReporteTotalVentasUsuario
