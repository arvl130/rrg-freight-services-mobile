import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"
import {
  Button,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native"
import { getShipment } from "@/api/shipment"
import { ScannerView } from "@/components/scanner-view"
import { getLocations } from "@/api/shipment-location"
import { useBarCodePermissions } from "@/hooks/barcode-scanner"
import { useLocationTracker } from "@/components/location-tracker"
import {
  clearSavedShipmentId,
  getSavedShipmentId,
  saveShipmentId,
} from "@/utils/storage"
import { LocationPermissionRequiredView } from "@/components/location-permission"

function NotTrackingView({
  selectedShipmentId,
  stopTracking,
}: {
  selectedShipmentId: null | number
  stopTracking: () => void
}) {
  return (
    <>
      <Text style={{ paddingVertical: 8 }}>Location tracking: active</Text>
      <View style={{ flex: 1 }}>
        {selectedShipmentId === null ? (
          <>
            <Text style={{ paddingVertical: 8 }}>
              No shipment ID was selected. The location tracker will be stopped
              automatically.
            </Text>
          </>
        ) : (
          <>
            <Button title="Stop" onPress={() => stopTracking()} />
            <Text style={{ paddingVertical: 8 }}>
              Tracking Shipment: {selectedShipmentId}
            </Text>
            <LocationsList shipmentId={selectedShipmentId} />
          </>
        )}
      </View>
    </>
  )
}

function EditForm({
  initialShipmentId,
  close,
}: {
  initialShipmentId: null | number
  close: () => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedShipmentId, setSelectedShipmentId] = useState(
    initialShipmentId === null ? "" : initialShipmentId.toString(),
  )

  const {
    isLoading: isLoadingBarCodePermission,
    hasPermission: hasBarCodePermission,
    getPermission: getBarCodePermission,
  } = useBarCodePermissions()
  const [isScannerVisible, setIsScannerVisible] = useState(false)

  if (isScannerVisible)
    return (
      <ScannerView
        cancel={() => setIsScannerVisible(false)}
        onBarCodeScanned={async ({ data }) => {
          setSelectedShipmentId(data)
          setIsScannerVisible(false)
          setIsLoading(true)

          try {
            if (data === "") {
              Alert.alert(
                "Invalid QR Code",
                "The QR Code scanned maybe malformed or invalid. Please try again.",
              )
              return
            }

            const shipmentId = parseInt(data, 10)
            if (isNaN(shipmentId)) {
              Alert.alert(
                "Invalid QR Code",
                "The QR Code scanned maybe malformed or invalid. Please try again.",
              )
              console.log("reached here")
              return
            }

            const shipment = await getShipment(shipmentId)
            if (shipment === null) {
              Alert.alert(
                "Invalid QR Code",
                "The QR Code scanned does not seem to belong to any shipment.",
              )
              return
            }

            await saveShipmentId(shipmentId)
            await close()
          } finally {
            setIsLoading(false)
          }
        }}
      />
    )

  return (
    <>
      <Text style={{ paddingVertical: 8 }}>Location tracking: inactive</Text>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 8 }}>Shipment ID: </Text>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 12 }]}
            value={selectedShipmentId}
            onChangeText={(text) => setSelectedShipmentId(text)}
          />
          <View
            style={
              isLoadingBarCodePermission ? { opacity: 0.2 } : { opacity: 1 }
            }
          >
            <TouchableOpacity
              disabled={isLoadingBarCodePermission}
              onPress={async () => {
                if (!hasBarCodePermission) {
                  await getBarCodePermission()
                  setIsScannerVisible(true)
                } else setIsScannerVisible(true)
              }}
            >
              <MaterialCommunityIcons name="qrcode" size={48} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <Button
          title="Save"
          disabled={isLoading}
          onPress={async () => {
            setIsLoading(true)

            try {
              if (selectedShipmentId === "") {
                await clearSavedShipmentId()
                await close()
                return
              }

              const shipmentId = parseInt(selectedShipmentId, 10)
              if (isNaN(shipmentId)) {
                Alert.alert(
                  "Invalid input",
                  "Please enter a valid shipment ID.",
                )
                return
              }

              const shipment = await getShipment(shipmentId)
              if (shipment === null) {
                Alert.alert("Not found", "No such shipment was found.")
                return
              }

              await saveShipmentId(shipmentId)
              await close()
            } finally {
              setIsLoading(false)
            }
          }}
        />
        {initialShipmentId !== null && (
          <View style={{ marginTop: 8 }}>
            <Button
              title="Close"
              disabled={isLoading}
              onPress={async () => {
                setIsLoading(true)

                try {
                  await close()
                } finally {
                  setIsLoading(false)
                }
              }}
            />
          </View>
        )}
      </View>
    </>
  )
}

function useSelectedShipmentId() {
  const [selectedShipmentId, setSelectedShipmentId] = useState<{
    isLoading: boolean
    id: null | number
  }>({
    isLoading: true,
    id: null,
  })

  const refresh = useCallback(async () => {
    const id = await getSavedShipmentId()
    setSelectedShipmentId({
      isLoading: false,
      id,
    })
  }, [])

  useEffect(() => {
    if (selectedShipmentId.isLoading) refresh()
  }, [selectedShipmentId, refresh])

  return {
    isLoading: selectedShipmentId.isLoading,
    selectedShipmentId: selectedShipmentId.id,
    refresh,
  }
}

function LocationsList({ shipmentId }: { shipmentId: number }) {
  const { status, data, error } = useQuery({
    queryKey: ["locations", shipmentId],
    queryFn: () => getLocations(shipmentId),
    refetchInterval: 5 * 1000,
  })

  if (status === "pending") return <Text>Loading ...</Text>
  if (status === "error") return <Text>An error occured: {error.message}</Text>

  return (
    <>
      <View style={{ paddingVertical: 12 }}>
        <Text>Locations:</Text>
      </View>
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        {data.locations.length === 0 ? (
          <Text style={{ textAlign: "center" }}>No locations recorded.</Text>
        ) : (
          <>
            {data.locations.map((location) => (
              <View key={location.id}>
                <Text>
                  {location.long}, {location.lat}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </>
  )
}

function IsTrackingView({
  selectedShipmentId,
  startTracking,
  refresh,
}: {
  selectedShipmentId: null | number
  startTracking: () => void
  refresh: () => Promise<void>
}) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      <View style={{ flex: 1 }}>
        {selectedShipmentId === null ? (
          <>
            <EditForm
              initialShipmentId={selectedShipmentId}
              close={async () => {
                await refresh()
                setIsEditing(false)
              }}
            />
          </>
        ) : (
          <>
            {isEditing ? (
              <EditForm
                initialShipmentId={selectedShipmentId}
                close={async () => {
                  await refresh()
                  setIsEditing(false)
                }}
              />
            ) : (
              <>
                <Text style={{ paddingVertical: 8 }}>
                  Location tracking: inactive
                </Text>
                <Button title="Start" onPress={() => startTracking()} />
                <Text style={{ paddingVertical: 8 }}>
                  Tracking Shipment: {selectedShipmentId}
                </Text>
                <Button title="Edit" onPress={() => setIsEditing(true)} />
                <LocationsList shipmentId={selectedShipmentId} />
              </>
            )}
          </>
        )}
      </View>
    </>
  )
}

function LocationTracker() {
  const { isLoading, selectedShipmentId, refresh } = useSelectedShipmentId()
  const { isTracking, startTracking, stopTracking } = useLocationTracker()

  useEffect(() => {
    if (!isLoading && selectedShipmentId === null && isTracking) {
      stopTracking()
    }
  }, [isLoading, selectedShipmentId, isTracking, stopTracking])

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {isLoading ? (
        <Text style={{ textAlign: "center", paddingVertical: 8 }}>
          Loading ...
        </Text>
      ) : (
        <View
          style={{
            flex: 1,
          }}
        >
          {isTracking ? (
            <NotTrackingView
              selectedShipmentId={selectedShipmentId}
              stopTracking={() => stopTracking()}
            />
          ) : (
            <IsTrackingView
              selectedShipmentId={selectedShipmentId}
              startTracking={() => startTracking()}
              refresh={refresh}
            />
          )}
        </View>
      )}
    </View>
  )
}

export default function LocationTrackerScreen() {
  return (
    <View style={styles.container}>
      <LocationPermissionRequiredView>
        <LocationTracker />
      </LocationPermissionRequiredView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
})
