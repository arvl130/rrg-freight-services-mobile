import { useNetInfo } from "@react-native-community/netinfo"
import { onlineManager } from "@tanstack/react-query"
import { useFocusEffect } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { AppState, AppStateStatus, Platform } from "react-native"

export function useOnlineManager() {
  const { isConnected, isInternetReachable } = useNetInfo()
  useEffect(() => {
    if (Platform.OS !== "web") {
      onlineManager.setOnline(
        isConnected != null && isConnected && Boolean(isInternetReachable),
      )
    }
  }, [isConnected, isInternetReachable])
}

export function useAppState(onChange: (status: AppStateStatus) => void) {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onChange)
    return () => {
      subscription.remove()
    }
  }, [onChange])
}

export function useRefreshOnFocus(refetch: () => void) {
  const enabledRef = useRef(false)

  useFocusEffect(
    useCallback(() => {
      if (enabledRef.current) {
        refetch()
      } else {
        enabledRef.current = true
      }
    }, [refetch]),
  )
}

export function useRefreshByUser(refetch: () => Promise<unknown>) {
  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false)

  async function refetchByUser() {
    setIsRefetchingByUser(true)

    try {
      await refetch()
    } finally {
      setIsRefetchingByUser(false)
    }
  }

  return {
    isRefetchingByUser,
    refetchByUser,
  }
}
