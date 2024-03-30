import AsyncStorage from "@react-native-async-storage/async-storage"

const LOCATION_TRACKER_STORAGE_NAME = "location-tracker-storage"

export type SavedShipmentJSON = {
  id: number
  type: "DELIVERY" | "TRANSFER"
}

export async function getId() {
  const storageStr = await AsyncStorage.getItem(LOCATION_TRACKER_STORAGE_NAME)
  if (storageStr === null) return null

  return JSON.parse(storageStr) as SavedShipmentJSON
}

export function saveId({ id, type }: SavedShipmentJSON) {
  return AsyncStorage.setItem(
    LOCATION_TRACKER_STORAGE_NAME,
    JSON.stringify({
      id,
      type,
    }),
  )
}

export function clearStorage() {
  return AsyncStorage.removeItem(LOCATION_TRACKER_STORAGE_NAME)
}
