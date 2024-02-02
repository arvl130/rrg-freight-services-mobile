import { BarCodeScanner, PermissionStatus } from "expo-barcode-scanner"
import { useEffect, useState } from "react"

export function useBarCodePermissions() {
  const [isInitialized, setIsInitialized] = useState(false)
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

  useEffect(() => {
    // TODO: Running this effect on every screen that needs it has
    // on obvious performance penalty. Consider refactoring this to
    // use a React Context, so that we don't have to keep running
    // it all the time.
    async function initializePermission() {
      try {
        const { status } = await BarCodeScanner.getPermissionsAsync()
        setHasPermission(status === PermissionStatus.GRANTED)
      } finally {
        setIsInitialized(true)
      }
    }

    if (!isInitialized) {
      initializePermission()
    }
  }, [isInitialized])

  return {
    isLoading,
    hasPermission,
    getPermission,
  }
}
