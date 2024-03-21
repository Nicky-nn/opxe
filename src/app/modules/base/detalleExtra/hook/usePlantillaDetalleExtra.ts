import { QueryKey } from '@tanstack/query-core'
import { useQuery } from '@tanstack/react-query'

import { PlantillaDetalleExtra } from '../../../../interfaces/plantilla'
import { apiPlantillaDetalleExtra } from '../../../ventas/api/plantillaDetalleExtra.api'

/**
 * Hook para llamadas a la api de plantillaDetalleExtra
 * limit 1000
 */
const usePlantillaDetalleExtra = (queryKey: QueryKey = []) => {
  const {
    data: plantillaDetalleExtra,
    isLoading: pdeLoading,
    isError: pdeIsError,
    error: pdeError,
  } = useQuery<PlantillaDetalleExtra[], Error>({
    queryKey: ['plantillaDetalleExtra', ...queryKey],
    queryFn: async () => {
      const resp = await apiPlantillaDetalleExtra()
      if (resp.length > 0) {
        return resp
      }
      return []
    },
  })

  return { plantillaDetalleExtra, pdeLoading, pdeIsError, pdeError }
}

export default usePlantillaDetalleExtra
