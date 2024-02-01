import { FontAwesome5 } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { LocationPermissionResponse } from "expo-location"
import { router, useLocalSearchParams } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import { useLocationTracker } from "@/utils/location-tracker"
import { clearStorage, saveId } from "@/utils/storage"
import { getVehicle } from "@/api/vehicle"
import { getTransferShipment } from "@/api/transfer-shipment"

function VehicleDetails({ id }: { id: number }) {
  const { status, data, error } = useQuery({
    queryKey: ["getVehicle", id],
    queryFn: () => getVehicle(Number(id)),
  })

  if (status === "pending") return <Text>Loading ...</Text>
  if (status === "error") return <Text>Error: {error.message}</Text>
  if (data === null) return <Text>No such vehicle.</Text>

  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: "#0ea5e9",
        borderRadius: 8,
        flexDirection: "row",
        marginBottom: 8,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
          }}
        >
          {data.vehicle.displayName}
        </Text>
      </View>

      {data.vehicle.type === "VAN" && (
        <FontAwesome5 name="shuttle-van" size={24} color="white" />
      )}
      {data.vehicle.type === "TRUCK" && (
        <FontAwesome5 name="truck" size={24} color="white" />
      )}
    </View>
  )
}

function StartTransfer({
  transferShipmentId,
  status,
  requestPermission,
  startTracking,
}: {
  transferShipmentId: number
  status: null | LocationPermissionResponse
  requestPermission: () => Promise<void>
  startTracking: () => Promise<void>
}) {
  if (status === null)
    return (
      <View>
        <Text>
          Before we can start the shipment transfer, please allow access to
          location.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#f59e0b",
            borderRadius: 8,
          }}
          activeOpacity={0.6}
          onPress={() => requestPermission()}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              paddingVertical: 12,
              fontSize: 16,
            }}
          >
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    )

  if (!status.granted)
    return (
      <View>
        <Text>
          Shipment transfer cannot be started if location access is not enabled.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#f59e0b",
            borderRadius: 8,
          }}
          activeOpacity={0.6}
          onPress={() => requestPermission()}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              paddingVertical: 12,
              fontSize: 16,
            }}
          >
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    )

  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: "#22c55e",
          borderRadius: 8,
        }}
        activeOpacity={0.6}
        onPress={async () => {
          await saveId({
            id: transferShipmentId,
            type: "TRANSFER",
          })
          await startTracking()
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            paddingVertical: 12,
            fontSize: 16,
          }}
        >
          Start Transfer
        </Text>
      </TouchableOpacity>
    </View>
  )
}

function StopTransfer({
  transferShipmentId,
  status,
  requestPermission,
  stopTracking,
  isCompleted,
}: {
  transferShipmentId: number
  status: null | LocationPermissionResponse
  requestPermission: () => Promise<void>
  stopTracking: () => Promise<void>
  isCompleted: boolean
}) {
  if (status === null)
    return (
      <View>
        <Text>
          Before we can stop the shipment transfer, please allow access to
          location.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#f59e0b",
            borderRadius: 8,
          }}
          activeOpacity={0.6}
          onPress={() => requestPermission()}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              paddingVertical: 12,
              fontSize: 16,
            }}
          >
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    )

  if (!status.granted)
    return (
      <View>
        <Text>
          Shipment transfer cannot be stopped if location access is not enabled.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#f59e0b",
            borderRadius: 8,
          }}
          activeOpacity={0.6}
          onPress={() => requestPermission()}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              paddingVertical: 12,
              fontSize: 16,
            }}
          >
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    )

  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: "#ef4444",
          borderRadius: 8,
        }}
        activeOpacity={0.6}
        onPress={async () => {
          await clearStorage()
          await stopTracking()
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            paddingVertical: 12,
            fontSize: 16,
          }}
        >
          Stop Transfer
        </Text>
      </TouchableOpacity>

      {!isCompleted && (
        <TouchableOpacity
          style={{
            backgroundColor: "#3b82f6",
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 8,
          }}
          activeOpacity={0.6}
          onPress={() => {
            router.push({
              pathname: "/(app)/driver/transfer-shipments/[id]/transfer",
              params: {
                id: transferShipmentId,
              },
            })
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            Mark as Transferred
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

function StartStopTransfer({
  transferShipmentId,
  isCompleted,
}: {
  transferShipmentId: number
  isCompleted: boolean
}) {
  const {
    isTracking,
    status: permissionStatus,
    requestPermission,
    startTracking,
    stopTracking,
  } = useLocationTracker()

  return (
    <View
      style={{
        marginBottom: 8,
      }}
    >
      {isTracking ? (
        <StopTransfer
          transferShipmentId={transferShipmentId}
          status={permissionStatus}
          requestPermission={async () => {
            await requestPermission()
          }}
          stopTracking={async () => {
            await stopTracking()
          }}
          isCompleted={isCompleted}
        />
      ) : (
        <StartTransfer
          transferShipmentId={transferShipmentId}
          status={permissionStatus}
          requestPermission={async () => {
            await requestPermission()
          }}
          startTracking={async () => {
            await startTracking()
          }}
        />
      )}
    </View>
  )
}

export default function ViewTransferShipmentPage() {
  const params = useLocalSearchParams<{ id: string }>()
  const { status, data, error } = useQuery({
    queryKey: ["getTransferShipment", params.id],
    queryFn: () => getTransferShipment(Number(params.id)),
  })

  return (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
    >
      {status === "pending" && <Text>Loading ...</Text>}
      {status === "error" && <Text>Error: {error.message}</Text>}
      {status === "success" && (
        <>
          {data === null ? (
            <Text>No such transfer shipment.</Text>
          ) : (
            <>
              <VehicleDetails id={data.transferShipment.vehicleId} />
              <StartStopTransfer
                transferShipmentId={data.transferShipment.id}
                isCompleted={data.transferShipment.status === "ARRIVED"}
              />

              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  backgroundColor: "#3b82f6",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                onPress={() =>
                  router.push({
                    pathname: "/(app)/driver/transfer-shipments/[id]/packages",
                    params: {
                      id: data.transferShipment.id,
                    },
                  })
                }
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    paddingVertical: 12,
                    fontSize: 16,
                  }}
                >
                  View Packages
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  backgroundColor: "#3b82f6",
                  borderRadius: 8,
                }}
                onPress={() =>
                  router.push({
                    pathname: "/(app)/driver/transfer-shipments/[id]/locations",
                    params: {
                      id: data.transferShipment.id,
                    },
                  })
                }
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    paddingVertical: 12,
                    fontSize: 16,
                  }}
                >
                  View Locations
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  )
}
