import { useQuery } from '@tanstack/react-query'
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_TableOptions,
} from 'material-react-table'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'

import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import useAuth from '../../../base/hooks/useAuth'
import { PAGE_DEFAULT, PageProps } from '../../../interfaces'
import { genApiQuery } from '../../../utils/helper'
import {
  MuiFilterTextFieldProps,
  MuiToolbarAlertBannerProps,
} from '../../../utils/muiTable/materialReactTableUtils'
import { MuiTableAdvancedOptionsProps } from '../../../utils/muiTable/muiTableAdvancedOptionsProps'
import { apiProductosVariantes } from '../api/productosVariantes.api'
import { ProductoProps } from '../interfaces/producto.interface'

interface OwnProps {
  codigoActividad: string
  setProductosVariantes: React.Dispatch<React.SetStateAction<ProductoProps[]>>
}

type Props = OwnProps

const ProductosVariantes: FunctionComponent<Props> = (props) => {
  const {
    user: { sucursal },
  } = useAuth()

  const columns = useMemo<MRT_ColumnDef<ProductoProps>[]>(
    () => [
      {
        accessorKey: 'codigoProducto',
        header: 'Código Producto',
        size: 100,
      },
      {
        accessorKey: 'nombre',
        header: 'Producto / Servicio',
      },
      {
        accessorKey: 'codigoNandina',
        header: 'Código Nandina',
      },
      {
        accessorKey: 'precio',
        header: 'Precio',
        muiTableBodyCellProps: {
          align: 'right',
        },
        accessorFn: (row) => {
          return numberWithCommas(row.precio, {})
        },
        size: 100,
      },
      {
        accessorKey: 'unidadMedida.descripcion',
        header: 'Unidad Medida',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'sinProductoServicio.codigoActividad',
        header: 'Código Actividad',
        enableColumnFilter: false,
      },
    ],
    [],
  )

  const { setProductosVariantes, codigoActividad } = props
  // DATA TABLE
  const [rowCount, setRowCount] = useState(0)
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  })
  // const [rowSelection, setRowSelection] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  // FIN DATA TABLE
  const { data, isError, isFetching, isLoading } = useQuery<ProductoProps[]>({
    queryKey: [
      'tableProductoVarianteDialog',
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
      const { pageInfo, docs } = await apiProductosVariantes(fetchPagination)
      setRowCount(pageInfo.totalDocs)
      return docs as unknown as ProductoProps[] // Cast the type to 'ProductoProps[]'
    },
  })

  useEffect(() => {
    if (rowSelection) {
      const p = Object.keys(rowSelection)
      if (data) {
        const pvs = data!.filter((item) => p.includes(item.codigoProducto))
        setProductosVariantes(pvs)
      }
    }
  }, [rowSelection])

  return (
    <>
      <MaterialReactTable
        {...(MuiTableAdvancedOptionsProps as MRT_TableOptions<ProductoProps>)}
        columns={columns}
        data={data ?? []}
        initialState={{ showColumnFilters: true }}
        muiToolbarAlertBannerProps={MuiToolbarAlertBannerProps(isError)}
        onColumnFiltersChange={setColumnFilters}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        enableDensityToggle={false}
        enableGlobalFilter={false}
        rowCount={rowCount ?? 0}
        state={{
          isLoading,
          columnFilters,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isFetching,
          sorting,
          density: 'compact',
          rowSelection,
        }}
        muiFilterTextFieldProps={MuiFilterTextFieldProps}
        enableMultiRowSelection={false}
        enableRowSelection
        enableRowActions={false}
        enableSelectAll={false}
        onRowSelectionChange={setRowSelection}
        getRowId={(row) => row.codigoProducto}
        positionToolbarAlertBanner={'bottom'}
        muiTableContainerProps={{
          sx: {
            maxHeight: '100%',
          },
        }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: row.getToggleSelectedHandler(),
          sx: { cursor: 'pointer' },
        })}
      />
    </>
  )
}

export default ProductosVariantes
