import AsyncStorage from "@react-native-async-storage/async-storage"

const LOCATION_TRACKER_STORAGE_NAME = "location-tracker-storage"

export async function getSavedShipmentId() {
  const storageStr = await AsyncStorage.getItem(LOCATION_TRACKER_STORAGE_NAME)
  if (storageStr === null) return null

  const storage = (JSON.parse(storageStr) ?? {}) as {
    shipmentId: number | undefined
  }

  if (!storage.shipmentId) return null
  return storage.shipmentId
}

export function saveShipmentId(shipmentId: number) {
  return AsyncStorage.setItem(
    LOCATION_TRACKER_STORAGE_NAME,
    JSON.stringify({
      shipmentId,
    }),
  )
}

export function clearSavedShipmentId() {
  return AsyncStorage.removeItem(LOCATION_TRACKER_STORAGE_NAME)
}
