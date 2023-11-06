import { BarCodeScanner, PermissionStatus } from "expo-barcode-scanner"
import { useState } from "react"

export function useBarCodePermissions() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean>(false)

  async function getPermission() {
    setIsLoading(true)
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === PermissionStatus.GRANTED)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    hasPermission,
    getPermission,
  }
}
