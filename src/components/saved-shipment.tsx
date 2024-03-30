import type { ReactNode } from "react"
import { getId, type SavedShipmentJSON } from "@/utils/storage"
import { createContext, useContext, useEffect, useState } from "react"

const SavedShipmentContext = createContext<{
  isLoading: boolean
  savedShipment: SavedShipmentJSON | null
  reload: () => Promise<void>
}>({
  isLoading: true,
  savedShipment: null,
  reload: Promise.resolve,
})

export function SavedShipmentProvider(props: { children: ReactNode }) {
  const [savedShipment, setSavedShipment] = useState<null | SavedShipmentJSON>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function readSavedShipment() {
      if (isLoading) {
        try {
          const savedShipmentStr = await getId()
          setSavedShipment(savedShipmentStr)
        } catch {
          setSavedShipment(null)
        } finally {
          setIsLoading(false)
        }
      }
    }

    readSavedShipment()
  }, [isLoading])

  return (
    <SavedShipmentContext.Provider
      value={{
        isLoading,
        savedShipment,
        reload: async () => {
          try {
            const savedShipmentStr = await getId()
            setSavedShipment(savedShipmentStr)
          } catch {
            setSavedShipment(null)
          } finally {
            setIsLoading(false)
          }
        },
      }}
      {...props}
    />
  )
}

export function useSavedShipment() {
  return useContext(SavedShipmentContext)
}
