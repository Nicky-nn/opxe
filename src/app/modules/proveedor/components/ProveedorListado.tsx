import { Delete, Edit, Newspaper } from '@mui/icons-material'
import { Button, Chip, IconButton, Paper } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table'
import { FunctionComponent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AuditIconButton from '../../../base/components/Auditoria/AuditIconButton'
import { PAGE_DEFAULT, PageInputProps } from '../../../interfaces'
import { genApiQuery } from '../../../utils/helper'
import { MuiTableAdvancedOptionsProps } from '../../../utils/muiTable/muiTableAdvancedOptionsProps'
import { notSuccess } from '../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiProveedorEliminar } from '../api/proveedorEliminar.api'
import { apiProveedores } from '../api/proveedores.api'
import { ProveedorProps } from '../interfaces/proveedor.interface'
import ProveedorActualizarDialog from '../view/ProveedorActualizarDialog'
import ProveedorRegistroDialog from '../view/ProveedorRegistroDialog'

interface OwnProps {}

type Props = OwnProps

const tableColumns: MRT_ColumnDef<ProveedorProps>[] = [
  {
    accessorKey: 'codigo',
    header: 'Código',
  },
  {
    accessorKey: 'nombre',
    header: 'Proveedor',
  },
  {
    accessorKey: 'direccion',
    header: 'Dirección',
  },
  {
    accessorKey: 'ciudad',
    header: 'Ciudad',
  },
  {
    accessorKey: 'contacto',
    header: 'Contacto',
  },
  {
    accessorKey: 'correo',
    header: 'Correo Electrónico',
  },
  {
    accessorKey: 'telefono',
    header: 'Teléfono',
  },
  {
    accessorFn: (row) => <Chip size={'small'} label={row.state} color={'success'} />,
    id: 'state',
    header: 'Estado',
  },
]

const ProveedorListado: FunctionComponent<Props> = (props) => {
  const navigate = useNavigate()
  const [selectedProveedorCodigo, setSelectedProveedorCodigo] = useState<string>('')
  const [openNuevoProveedor, setOpenNuevoProveedor] = useState<boolean>(false)
  const [openActualizarProveedor, setOpenActualizarProveedor] = useState<boolean>(false)
  // ESTADO DATATABLE
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  })
  const [rowCount, setRowCount] = useState(0)
  const [isRefetching, setIsRefetching] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  // FIN ESTADO DATATABLE
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
  // const { data, isError, isLoading, status, refetch } = useQuery<ProveedorProps[]>(
  //   [
  //     'proveedoresListado',
  //     columnFilters,
  //     pagination.pageIndex,
  //     pagination.pageSize,
  //     sorting,
  //   ],
  //   async () => {
  //     const query = genApiQuery(columnFilters)
  //     const fetchPagination: PageInputProps = {
  //       ...PAGE_DEFAULT,
  //       page: pagination.pageIndex + 1,
  //       limit: pagination.pageSize,
  //       reverse: sorting.length <= 0,
  //       query,
  //     }
  //     const { pageInfo, docs } = await apiProveedores(fetchPagination)
  //     setRowCount(pageInfo.totalDocs)
  //     return docs
  //   },
  //   {
  //     refetchOnWindowFocus: true,
  //     keepPreviousData: true,
  //   },
  // )
  const { data, isError, isLoading, status, refetch } = useQuery({
    queryKey: [
      'proveedoresListado',
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      const query = genApiQuery(columnFilters)
      const fetchPagination: PageInputProps = {
        ...PAGE_DEFAULT,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        reverse: sorting.length <= 0,
        query,
      }
      const { pageInfo, docs } = await apiProveedores(fetchPagination)
      setRowCount(pageInfo.totalDocs)
      return docs
    },
    refetchInterval: false,
    refetchOnWindowFocus: true,
  })

  const columns = useMemo(() => tableColumns, [])

  const handleDeleteData = async (data: any) => {
    const resp = data.map((item: any) => item.original.codigo)
    await swalAsyncConfirmDialog({
      text: 'Confirma que desea eliminar los registros seleccionados, esta operación no se podra revertir',
      preConfirm: () => {
        return apiProveedorEliminar(resp).catch((err) => {
          swalException(err)
          return false
        })
      },
    }).then((resp) => {
      if (resp.isConfirmed) {
        notSuccess()
        setRowSelection({})
        refetch()
      }
    })
  }
  return (
    <>
      <Paper
        elevation={0}
        variant="elevation"
        square
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
            onClick={() => setOpenNuevoProveedor(true)}
            startIcon={<Newspaper />}
            color={'success'}
          >
            {' '}
            Nuevo Proveedor
          </Button>
        </Stack>
      </Paper>
      <Box sx={{ mb: 2, m: '1rem' }}>
        <MaterialReactTable
          {...(MuiTableAdvancedOptionsProps as MRT_TableOptions<ProveedorProps>)}
          columns={columns}
          data={data ?? []}
          initialState={{
            showColumnFilters: true,
            columnVisibility: {
              descripcion: false,
              proveedor: false,
              precioComparacion: false,
            },
          }}
          manualFiltering
          manualPagination
          manualSorting
          muiToolbarAlertBannerProps={
            isError ? { color: 'error', children: 'Error loading data' } : undefined
          }
          onColumnFiltersChange={setColumnFilters}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          enableDensityToggle={false}
          enableGlobalFilter={false}
          rowCount={rowCount}
          // localization={localization}
          state={{
            isLoading,
            columnFilters,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            density: 'compact',
            sorting,
            rowSelection,
          }}
          muiSearchTextFieldProps={{
            variant: 'outlined',
            placeholder: 'Busqueda',
            InputLabelProps: { shrink: true },
            size: 'small',
          }}
          enableRowActions
          positionActionsColumn={'first'}
          renderRowActions={({ row }) => (
            <div
              style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem', width: 100 }}
            >
              <IconButton
                onClick={() => {
                  //@ts-ignore
                  setSelectedProveedorCodigo(row.original) // Update the argument type to ProveedorProps | null
                  setOpenActualizarProveedor(true)
                }}
                color={'primary'}
              >
                <Edit />
              </IconButton>
              <AuditIconButton row={row.original} />
            </div>
          )}
          enableRowSelection
          onRowSelectionChange={setRowSelection}
          renderTopToolbarCustomActions={({ table }) => {
            return (
              <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  color="error"
                  onClick={() => handleDeleteData(table.getSelectedRowModel().flatRows)}
                  startIcon={<Delete />}
                  variant="contained"
                  size="small"
                  sx={{
                    height: '28px',
                    top: '0.5rem',
                  }}
                  disabled={table.getSelectedRowModel().flatRows.length === 0}
                >
                  Eliminar
                </Button>
                {/*
              <IconButton onClick={handleRefreshTable} disabled={isFetching}>
                <Cached />
              </IconButton> */}
              </Box>
            )
          }}
          muiTableProps={{
            sx: {
              tableLayout: 'fixed',
            },
          }}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              muiTableHeadCellProps: {
                align: 'center',
              },
              size: 120,
            },
          }}
        />
      </Box>
      <ProveedorRegistroDialog
        id={'proveedorRegistroDialog'}
        keepMounted={false}
        open={openNuevoProveedor}
        onClose={(value?: ProveedorProps) => {
          if (value) {
            refetch().then()
          }
          setOpenNuevoProveedor(false)
        }}
      />
      <ProveedorActualizarDialog
        keepMounted={false}
        open={openActualizarProveedor}
        // @ts-ignore
        proveedor={selectedProveedorCodigo || null} // Update the type of the proveedor prop to allow for null
        onClose={(resp?: ProveedorProps) => {
          setOpenActualizarProveedor(false)
          if (resp) {
            refetch().then()
          }
        }}
      />
    </>
  )
}

export default ProveedorListado
