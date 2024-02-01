import auth from "@react-native-firebase/auth"
import {
  useForegroundPermissions,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
  Accuracy,
  ActivityType,
  LocationObject,
  hasStartedLocationUpdatesAsync,
} from "expo-location"
import { TaskManagerTaskBody, defineTask } from "expo-task-manager"
import { useEffect, useState } from "react"
import { getId } from "./storage"
import { createDeliveryLocation } from "@/api/shipment-location"
import { createTransferShipmentLocation } from "@/api/transfer-shipment"

const LOCATION_TRACKER_TASK_NAME = "location-tracker"

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

export function useLocationTracker() {
  const [status, requestPermission] = useForegroundPermissions()
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    async function getTrackingStatus() {
      if (status !== null && status.granted) {
        const isTracking = await hasStartedLocationUpdatesAsync(
          LOCATION_TRACKER_TASK_NAME,
        )

        setIsTracking(isTracking)
      }
    }

    getTrackingStatus()
  }, [status])

  async function startTracking() {
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
  }

  async function stopTracking() {
    await stopLocationUpdatesAsync(LOCATION_TRACKER_TASK_NAME)
    setIsTracking(false)
  }

  return {
    status,
    isTracking,
    requestPermission,
    startTracking,
    stopTracking,
  }
}
