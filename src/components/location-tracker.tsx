import auth from "@react-native-firebase/auth"
import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  Accuracy,
  ActivityType,
  hasStartedLocationUpdatesAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from "expo-location"
import type { LocationObject } from "expo-location"
import { useLocationPermission } from "@/components/location-permission"
import type { TaskManagerTaskBody } from "expo-task-manager"
import { defineTask } from "expo-task-manager"
import { getId } from "@/utils/storage"
import { createDeliveryLocation } from "@/api/shipment-location"
import { createTransferShipmentLocation } from "@/api/transfer-shipment"

const LOCATION_TRACKER_TASK_NAME = "driver-location-tracker"

defineTask(
  LOCATION_TRACKER_TASK_NAME,
  async ({
    error,
    data: { locations },
  }: TaskManagerTaskBody<{ locations: LocationObject[] }>) => {
    if (error) {
      console.error(
        `[${LOCATION_TRACKER_TASK_NAME}]:`,
        "Something went wrong within the background location task.",
        error,
      )

      return
    }

    if (locations.length === 0) {
      console.error(`[${LOCATION_TRACKER_TASK_NAME}]:`, "No locations given.")

      return
    }

    const { currentUser } = auth()
    if (currentUser === null) {
      console.error(`[${LOCATION_TRACKER_TASK_NAME}]:`, "Not logged in.")

      return
    }

    const saved = await getId()
    if (saved === null) {
      console.error(
        `[${LOCATION_TRACKER_TASK_NAME}]:`,
        "Could not retrieve shipment id.",
      )

      return
    }

    const [{ coords }] = locations
    if (saved.type === "DELIVERY")
      await createDeliveryLocation({
        deliveryId: saved.id,
        lat: coords.latitude,
        long: coords.longitude,
      })
    else
      await createTransferShipmentLocation({
        transferShipmentId: saved.id,
        lat: coords.latitude,
        long: coords.longitude,
      })

    console.log(
      `[${LOCATION_TRACKER_TASK_NAME}]:`,
      "Received new locations",
      locations,
    )
  },
)

const LocationTrackerContext = createContext<{
  isLoading: boolean
  isTracking: boolean
  startTracking: () => Promise<void>
  stopTracking: () => Promise<void>
}>({
  isLoading: true,
  isTracking: false,
  startTracking: Promise.resolve,
  stopTracking: Promise.resolve,
})

export function LocationTrackerProvider(props: { children: ReactNode }) {
  const { permission } = useLocationPermission()
  const [isTracking, setIsTracking] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getTrackingStatus() {
      if (permission?.granted === true) {
        try {
          const isTracking = await hasStartedLocationUpdatesAsync(
            LOCATION_TRACKER_TASK_NAME,
          )

          setIsTracking(isTracking)
        } catch {
          setIsTracking(false)
        } finally {
          setIsLoading(false)
        }
      }
    }

    getTrackingStatus()
  }, [permission])

  async function startTracking() {
    try {
      await startLocationUpdatesAsync(LOCATION_TRACKER_TASK_NAME, {
        accuracy: Accuracy.BestForNavigation,
        timeInterval: 15 * 1000,
        // Android behavior
        foregroundService: {
          notificationTitle: "Location Tracker is active",
          notificationBody: "Monitoring your location for package delivery",
          notificationColor: "#333333",
        },
        // iOS behavior
        activityType: ActivityType.AutomotiveNavigation,
        showsBackgroundLocationIndicator: true,
      })
      setIsTracking(true)
    } catch {
      setIsTracking(false)
    }
  }

  async function stopTracking() {
    try {
      await stopLocationUpdatesAsync(LOCATION_TRACKER_TASK_NAME)
      setIsTracking(false)
    } catch {
      setIsTracking(true)
    }
  }

  return (
    <LocationTrackerContext.Provider
      value={{
        isLoading,
        isTracking,
        startTracking,
        stopTracking,
      }}
      {...props}
    />
  )
}

export function useLocationTracker() {
  return useContext(LocationTrackerContext)
}
