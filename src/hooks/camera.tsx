import {
  PermissionStatus,
  useCameraPermissions as _useCameraPermissions,
} from "expo-camera"
import { useState } from "react"

export function useCameraPermissions() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [, requestPermission] = _useCameraPermissions()

  async function getPermission() {
    setIsLoading(true)
    try {
      const { status } = await requestPermission()
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
