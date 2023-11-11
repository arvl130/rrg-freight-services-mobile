import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"
import { Button, StyleSheet, Text, View, ScrollView, Alert } from "react-native"
import { TextInput } from "react-native-gesture-handler"

import { getLocations, getShipment } from "../../../utils/api"
import { useLocationTracker } from "../../../utils/location-tracker"
import {
  clearSavedShipmentId,
  getSavedShipmentId,
  saveShipmentId,
} from "../../../utils/storage"

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

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 8 }}>Shipment ID: </Text>
      <TextInput
        style={[styles.input, { marginBottom: 12 }]}
        value={selectedShipmentId}
        onChangeText={(text) => setSelectedShipmentId(text)}
      />
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
              Alert.alert("Invalid input", "Please enter a valid shipment ID.")
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
    </View>
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

export default function LocationTrackerScreen() {
  const [isEditing, setIsEditing] = useState(false)
  const { isLoading, selectedShipmentId, refresh } = useSelectedShipmentId()
  const { isTracking, startTracking, stopTracking } = useLocationTracker()

  useEffect(() => {
    if (!isLoading && selectedShipmentId === null && isTracking) {
      stopTracking()
    }
  }, [isLoading, selectedShipmentId, isTracking, stopTracking])

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={{ textAlign: "center", paddingVertical: 8 }}>
          Loading ...
        </Text>
      ) : (
        <>
          <Text style={{ paddingVertical: 8 }}>
            Location tracking: {isTracking ? "active" : "inactive"}
          </Text>
          <View
            style={{
              flex: 1,
            }}
          >
            {isTracking ? (
              <View style={{ flex: 1 }}>
                {selectedShipmentId === null ? (
                  <Text style={{ paddingVertical: 8 }}>
                    No shipment ID was selected. The location tracker will be
                    stopped automatically.
                  </Text>
                ) : (
                  <>
                    <Button title="Stop" onPress={() => stopTracking()} />
                    <Text style={{ paddingVertical: 8 }}>
                      Tracking Shipment: {selectedShipmentId}
                    </Text>
                    <LocationsList shipmentId={selectedShipmentId!} />
                  </>
                )}
              </View>
            ) : (
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
                    <Button title="Start" onPress={() => startTracking()} />
                    <Text style={{ paddingVertical: 8 }}>
                      Tracking Shipment: {selectedShipmentId}
                    </Text>
                    {isEditing ? (
                      <EditForm
                        initialShipmentId={selectedShipmentId}
                        close={async () => {
                          await refresh()
                          setIsEditing(false)
                        }}
                      />
                    ) : (
                      <Button title="Edit" onPress={() => setIsEditing(true)} />
                    )}
                    <LocationsList shipmentId={selectedShipmentId} />
                  </>
                )}
              </View>
            )}
          </View>
        </>
      )}
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
