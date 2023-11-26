import { FontAwesome5 } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { LocationPermissionResponse } from "expo-location"
import { router, useLocalSearchParams } from "expo-router"
import { Button, Text, TouchableOpacity, View } from "react-native"

import { getDelivery, getVehicle } from "../../../../../utils/api"
import { useLocationTracker } from "../../../../../utils/location-tracker"
import { clearStorage, saveId } from "../../../../../utils/storage"

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

function StartDelivery({
  deliveryId,
  status,
  requestPermission,
  startTracking,
}: {
  deliveryId: number
  status: null | LocationPermissionResponse
  requestPermission: () => Promise<void>
  startTracking: () => Promise<void>
}) {
  if (status === null)
    return (
      <View>
        <Text>
          Before we can start the delivery, please allow access to location.
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
          Deliveries cannot be started if location access is not enabled.
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
            id: deliveryId,
            type: "DELIVERY",
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
          Start Delivery
        </Text>
      </TouchableOpacity>
    </View>
  )
}

function StopDelivery({
  deliveryId,
  status,
  requestPermission,
  stopTracking,
}: {
  deliveryId: number
  status: null | LocationPermissionResponse
  requestPermission: () => Promise<void>
  stopTracking: () => Promise<void>
}) {
  if (status === null)
    return (
      <View>
        <Text>
          Before we can stop the delivery, please allow access to location.
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
          Deliveries cannot be stopped if location access is not enabled.
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
          marginBottom: 8,
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
          Stop Delivery
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#3b82f6",
          paddingVertical: 12,
          borderRadius: 8,
        }}
        activeOpacity={0.6}
        onPress={() => {
          router.push({
            pathname: "/(app)/driver/deliveries/[id]/deliver",
            params: {
              id: deliveryId,
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
          Deliver Package
        </Text>
      </TouchableOpacity>
    </View>
  )
}

function StartStopDelivery({ deliveryId }: { deliveryId: number }) {
  const {
    isTracking,
    status: permissionStatus,
    requestPermission,
    startTracking,
    stopTracking,
  } = useLocationTracker()

  return (
    <View>
      {isTracking ? (
        <StopDelivery
          deliveryId={deliveryId}
          status={permissionStatus}
          requestPermission={async () => {
            await requestPermission()
          }}
          stopTracking={async () => {
            await stopTracking()
          }}
        />
      ) : (
        <StartDelivery
          deliveryId={deliveryId}
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

export default function ViewDeliveryPage() {
  const params = useLocalSearchParams<{ id: string }>()
  const { status, data, error } = useQuery({
    queryKey: ["getDeliveries", params.id],
    queryFn: () => getDelivery(Number(params.id)),
  })

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
    >
      {status === "pending" && <Text>Loading ...</Text>}
      {status === "error" && <Text>Error: {error.message}</Text>}
      {status === "success" && (
        <>
          {data === null ? (
            <Text>No such delivery</Text>
          ) : (
            <View>
              <VehicleDetails id={data.delivery.id} />
              <StartStopDelivery deliveryId={data.delivery.id} />
              <Button title="View Packages" />
              <Button title="View Locations" />
            </View>
          )}
        </>
      )}
    </View>
  )
}
