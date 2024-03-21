import {
  FileOpen,
  ImportExport,
  LayersClear,
  Mail,
  MenuOpen,
  PictureAsPdf,
} from '@mui/icons-material'
import { Button, Chip, Grid, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table'
import { FC, useMemo, useState } from 'react'

import AuditIconButton from '../../../base/components/Auditoria/AuditIconButton'
import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import { SimpleItem } from '../../../base/components/Container/SimpleItem'
import SimpleRowMenu from '../../../base/components/Container/SimpleRow'
import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import SimpleMenu, { SimpleMenuItem } from '../../../base/components/MyMenu/SimpleMenu'
import StackMenuActionTable from '../../../base/components/MyMenu/StackMenuActionTable'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import { apiEstado, PAGE_DEFAULT, PageProps } from '../../../interfaces'
import { genApiQuery, openInNewTab } from '../../../utils/helper'
import {
  MuiDisplayColumnDefOptions,
  MuiSearchTextFieldProps,
  muiTableApiEstado,
  MuiToolbarAlertBannerProps,
} from '../../../utils/muiTable/materialReactTableUtils'
import { MuiTableAdvancedOptionsProps } from '../../../utils/muiTable/muiTableAdvancedOptionsProps'
import { fetchFacturaListado } from '../api/factura.listado.api'
import { FacturaProps } from '../interfaces/factura'
import AnularDocumentoDialog from './VentaGestion/AnularDocumentoDialog'
import MisVentasDialog from './VentaGestion/MisVentasDialog'
import ReenviarEmailsDialog from './VentaGestion/ReenviarEmailsDialog'
import VentaGestionExportarDetalleDialog from './VentaGestion/VentaGestionExportarDetalleDialog'
import VentaGestionExportarDialog from './VentaGestion/VentaGestionExportarDialog'

const tableColumns: MRT_ColumnDef<FacturaProps>[] = [
  {
    header: 'Nro. Factura',
    accessorKey: 'numeroFactura',
    size: 130,
  },
  {
    accessorKey: 'fechaEmision',
    header: 'Fecha Emisión',
    id: 'fechaEmision',
    enableColumnFilter: false,
    size: 160,
  },
  {
    header: 'Razon Social',
    id: 'cliente.razonSocial',
    accessorKey: 'cliente.razonSocial',
    maxSize: 250,
    minSize: 200,
  },
  {
    id: 'cliente.numeroDocumento',
    header: 'Nro. Documento',
    accessorFn: (row) => (
      <span>
        {row.cliente.numeroDocumento}{' '}
        {row.cliente.complemento ? `-${row.cliente.complemento}` : ''}
      </span>
    ),
    filterFn: (row, id, filterValue) =>
      row.original.cliente.numeroDocumento.startsWith(filterValue),
    maxSize: 150,
  },
  {
    header: 'Importe Monto Total',
    accessorKey: 'montoTotal',
    muiTableBodyCellProps: {
      align: 'right',
    },
    Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
    size: 150,
    enableColumnFilter: false,
  },
  {
    header: 'Codigo Nandina',
    accessorKey: 'detalle',
    accessorFn: (row) => (
      <span>
        {row.detalle.map((d) => (
          <span key={d.nroItem}>{d.codigoNandina}</span>
        ))}
      </span>
    ),
    size: 150,
    enableColumnFilter: false,
  },
  {
    header: 'Monto Moneda',
    accessorKey: 'montoTotalMoneda',
    muiTableBodyCellProps: {
      align: 'right',
    },
    accessorFn: (row) => <span> {numberWithCommas(row.montoTotalMoneda, {})}</span>,
    size: 150,
    enableColumnFilter: false,
  },
  {
    header: 'Moneda',
    accessorKey: 'moneda.descripcion',
    accessorFn: (row) => <strong>{row.moneda.descripcion}</strong>,
    size: 110,
    enableColumnFilter: false,
  },
  {
    header: 'Tipo Cambio',
    accessorKey: 'tipoCambio',
    size: 130,
    muiTableBodyCellProps: {
      align: 'right',
    },
    accessorFn: (row) => <span> {numberWithCommas(row.tipoCambio, {})}</span>,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'direccionComprador',
    id: 'direccionComprador',
    header: 'Dirección Comprador',
  },
  {
    accessorKey: 'incoterm',
    id: 'incoterm',
    header: 'Incoterm',
    accessorFn: (row) => <span>{row.incoterm}</span>,
  },
  {
    accessorKey: 'lugarDestino',
    id: 'lugarDestino',
    header: 'Lugar Destino',
  },
  {
    accessorKey: 'puertoDestino',
    id: 'puertoDestino',
    header: 'Puerto Destino',
  },
  {
    accessorKey: 'cuf',
    id: 'cuf',
    header: 'C.U.F.',
  },
  {
    accessorKey: 'usuario',
    id: 'usuario',
    header: 'Usuario',
  },
  {
    accessorKey: 'state',
    header: 'Estado',
    accessorFn: (row) => (
      <Chip
        color={
          row.state === apiEstado.validada
            ? 'success'
            : row.state === apiEstado.pendiente
              ? 'warning'
              : 'error'
        }
        label={row.state}
        size={'small'}
      />
    ),
    filterVariant: 'select',
    filterSelectOptions: muiTableApiEstado,
    filterFn: (row, id, filterValue) =>
      row.original.state.toLowerCase().startsWith(filterValue.toLowerCase()),
  },
]

const VentaGestion: FC<any> = () => {
  const [openAnularDocumento, setOpenAnularDocumento] = useState(false)
  const [factura, setFactura] = useState<FacturaProps | null>(null)
  const [openExport, setOpenExport] = useState(false)
  const [openExportDetalle, setOpenExportDetalle] = useState(false)
  const [openReenviarEmails, setOpenReenviarEmails] = useState(false)
  const [openMisVentas, setOpenMisVentas] = useState(false)
  // DATA TABLE
  const [rowCount, setRowCount] = useState(0)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  // FIN DATA TABLE
  const [issRefetching, setIssRefetching] = useState(false)

  const handleRefreshTable = async () => {
    setIssRefetching(true) // Establece el estado de "isRefetching" como verdadero para mostrar el indicador de carga

    try {
      await refetch() // Realiza la recarga de los datos utilizando la función "refetch" proporcionada por react-query
    } catch (error) {
      console.error('Error al recargar los datos:', error)
    }

    setIssRefetching(false) // Establece el estado de "isRefetching" como falso para ocultar el indicador de carga
  }
  const {
    data: gestionProductos,
    isError,
    error,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<FacturaProps[]>({
    queryKey: [
      'gestionFacturas',
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      const query = genApiQuery(columnFilters)
      const fetchPagination: PageProps = {
        ...PAGE_DEFAULT,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        reverse: sorting.length <= 0,
        query,
      }
      const { pageInfo, docs } = await fetchFacturaListado(fetchPagination)
      setRowCount(pageInfo.totalDocs)
      return docs
    },
    refetchOnWindowFocus: false,
  })
  if (isError) {
    console.log(error)
  }
  const columns = useMemo(() => tableColumns, [])
  return (
    <>
      <SimpleContainer>
        <div className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              { name: 'Ventas', path: '/ventas/gestion' },
              { name: 'Gestión de Exportaciones' },
            ]}
          />
        </div>

        <SimpleRowMenu>
          <SimpleItem>
            <Button
              size={'small'}
              startIcon={<ImportExport />}
              onClick={() => setOpenMisVentas(true)}
              variant={'outlined'}
            >
              MIS VENTAS
            </Button>
          </SimpleItem>

          <SimpleItem>
            <Button
              size={'small'}
              startIcon={<ImportExport />}
              onClick={() => setOpenExport(true)}
              variant={'outlined'}
            >
              EXPORTAR
            </Button>
          </SimpleItem>

          <SimpleItem>
            <Button
              size={'small'}
              startIcon={<ImportExport />}
              onClick={() => setOpenExportDetalle(true)}
              variant={'outlined'}
            >
              EXPORTAR DETALLES
            </Button>
          </SimpleItem>
        </SimpleRowMenu>

        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xs={12}>
            <MaterialReactTable
              {...(MuiTableAdvancedOptionsProps as MRT_TableOptions<FacturaProps>)}
              columns={columns} //must be memoized
              data={gestionProductos ?? []} //must be memoized
              initialState={{
                showColumnFilters: true,
                columnVisibility: {
                  cuf: false,
                  montoTotal: false,
                  tipoCambio: false,
                  codigoRecepcion: false,
                },
              }}
              muiToolbarAlertBannerProps={MuiToolbarAlertBannerProps(isError)}
              onColumnFiltersChange={setColumnFilters}
              onPaginationChange={setPagination}
              onSortingChange={setSorting}
              rowCount={rowCount}
              state={{
                isLoading,
                columnFilters,
                pagination,
                showAlertBanner: isError,
                showProgressBars: isRefetching,
                sorting,
                density: 'compact',
                columnPinning: { right: ['actions'] },
                rowSelection,
              }}
              muiSearchTextFieldProps={MuiSearchTextFieldProps}
              positionActionsColumn="first"
              displayColumnDefOptions={MuiDisplayColumnDefOptions}
              renderRowActions={({ row }) => (
                <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
                  <SimpleMenu
                    menuButton={
                      <>
                        <IconButton aria-label="delete">
                          <MenuOpen />
                        </IconButton>
                      </>
                    }
                  >
                    <SimpleMenuItem
                      onClick={(e) => {
                        e.preventDefault()
                        setOpenAnularDocumento(true)
                        setFactura(row.original)
                      }}
                    >
                      <LayersClear /> Anular Documento
                    </SimpleMenuItem>

                    <SimpleMenuItem
                      onClick={() => {
                        openInNewTab(row.original.representacionGrafica.pdf)
                      }}
                    >
                      <PictureAsPdf /> Pdf Medio Oficio
                    </SimpleMenuItem>

                    <SimpleMenuItem
                      onClick={() => {
                        openInNewTab(row.original.representacionGrafica.rollo)
                      }}
                    >
                      <PictureAsPdf /> Pdf Rollo
                    </SimpleMenuItem>

                    <SimpleMenuItem
                      onClick={() => {
                        openInNewTab(row.original.representacionGrafica.xml)
                      }}
                    >
                      <FileOpen /> Xml
                    </SimpleMenuItem>

                    <SimpleMenuItem
                      onClick={() => {
                        openInNewTab(row.original.representacionGrafica.sin)
                      }}
                    >
                      <FileOpen /> Url S.I.N.
                    </SimpleMenuItem>

                    <SimpleMenuItem
                      onClick={(e) => {
                        e.preventDefault()
                        setOpenReenviarEmails(true)
                        setFactura(row.original)
                      }}
                    >
                      <Mail /> Reenviar Correo
                    </SimpleMenuItem>
                  </SimpleMenu>
                  <AuditIconButton row={row.original} />
                </div>
              )}
              renderTopToolbarCustomActions={({ table }) => {
                return <StackMenuActionTable refetch={refetch} />
              }}
            />
          </Grid>
        </Grid>
        <Box py="12px" />
        <AnularDocumentoDialog
          id={'anularDocumentoDialog'}
          open={openAnularDocumento}
          keepMounted
          factura={factura}
          onClose={async (val) => {
            if (val) {
              await refetch()
            }
            setFactura(null)
            setOpenAnularDocumento(false)
          }}
        />
      </SimpleContainer>

      <VentaGestionExportarDialog
        id={'ventaGestionExportar'}
        keepMounted={true}
        open={openExport}
        onClose={() => {
          setOpenExport(false)
        }}
      />

      <VentaGestionExportarDetalleDialog
        id={'ventaGestionExportarDetalle'}
        keepMounted={true}
        open={openExportDetalle}
        onClose={() => {
          setOpenExportDetalle(false)
        }}
      />

      <MisVentasDialog
        id={'misVentasDialog'}
        keepMounted={false}
        open={openMisVentas}
        onClose={() => {
          setOpenMisVentas(false)
        }}
      />

      <ReenviarEmailsDialog
        id={'reenviarEmails'}
        keepMounted={true}
        open={openReenviarEmails}
        onClose={() => {
          setFactura(null)
          setOpenReenviarEmails(false)
        }}
        factura={factura}
      />
    </>
  )
}

export default VentaGestion
