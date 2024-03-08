import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LocationPermissionResponse } from "expo-location"
import { SplashScreen, router, useLocalSearchParams } from "expo-router"
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useLocationTracker } from "@/utils/location-tracker"
import { clearStorage, saveId } from "@/utils/storage"
import { getVehicle } from "@/api/vehicle"
import { getDeliveryPackages } from "@/api/shipment"
import { updateDeliveryStatusToCompleted } from "@/api/package"
import { getDelivery } from "@/api/delivery"

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
        style={styles.deliveryPackageBtn}
        activeOpacity={0.6}
        onPress={async () => {
          await saveId({
            id: deliveryId,
            type: "DELIVERY",
          })
          await startTracking()
        }}
      >
        <Text style={styles.optionBtnText}>Start Delivery</Text>
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

function StartStopDelivery({
  isStartDeliveryAllowed,
  deliveryId,
}: {
  isStartDeliveryAllowed: boolean
  deliveryId: number
}) {
  const {
    isTracking,
    status: permissionStatus,
    requestPermission,
    startTracking,
    stopTracking,
  } = useLocationTracker()

  return (
    <>
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
        <>
          {isStartDeliveryAllowed ? (
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
          ) : (
            <></>
          )}
        </>
      )}
    </>
  )
}

function DeliveryProgress({
  isCompleted,
  deliveryId,
}: {
  deliveryId: string
  isCompleted: boolean
}) {
  const { status, data, error } = useQuery({
    queryKey: ["getDeliveryPackages", deliveryId],
    queryFn: () => getDeliveryPackages(Number(deliveryId)),
  })

  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationKey: ["updateDeliveryStatusToCompleted", deliveryId],
    mutationFn: () => updateDeliveryStatusToCompleted(Number(deliveryId)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDeliveryPackages", deliveryId],
      })
      queryClient.invalidateQueries({
        queryKey: ["getDelivery", deliveryId],
      })
    },
  })

  return (
    <View>
      {status === "pending" && <Text>Loading ...</Text>}
      {status === "error" && <Text>Error {error.message}</Text>}
      {status === "success" && (
        <View>
          <View style={styles.statsSection}>
            <View style={[styles.statsCard, { backgroundColor: "#EDAD3E" }]}>
              <View style={styles.infoContainer}>
                <Text style={styles.dataText}>Packages to Delivery</Text>
                <Text style={styles.miniCardTitle}>{data.packages.length}</Text>
              </View>
            </View>
            <View style={[styles.statsCard, { backgroundColor: "#79CFDC" }]}>
              <View style={styles.infoContainer}>
                <Text style={styles.dataText}>Delivered Packages</Text>
                <Text style={styles.miniCardTitle}>
                  {
                    data.packages.filter(
                      (_package: any) => _package.status === "DELIVERED",
                    ).length
                  }
                </Text>
              </View>
            </View>
          </View>

          {data.packages.filter(
            (_package: any) => _package.status === "DELIVERED",
          ).length === data.packages.length &&
            !isCompleted && (
              <View
                style={{
                  marginBottom: 8,
                  backgroundColor: "#22c55e",
                  paddingHorizontal: 8,
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginTop: 8,
                }}
              >
                <Button
                  title="Mark as Completed"
                  disabled={isPending}
                  onPress={() => mutate()}
                />
              </View>
            )}
        </View>
      )}
    </View>
  )
}

function VehicleDetails({ id }: { id: number }) {
  const { status, data, error } = useQuery({
    queryKey: ["getVehicle", id],
    queryFn: () => getVehicle(Number(id)),
  })

  if (status === "pending") return <Text>Loading ...</Text>
  if (status === "error") return <Text>Error: {error.message}</Text>
  if (data === null) return <Text>No such vehicle.</Text>

  return (
    <>
      <View style={styles.truckLogo}>
        <Image
          source={require("@/assets/images/truckLogo.png")}
          style={{ width: 300, height: 200 }}
        />
      </View>
      <View style={styles.truckNumber}>
        <Text style={styles.truckNumber2}>Assigned Vehicle</Text>
        <Text style={styles.truckNumber1}>{data.vehicle.displayName}</Text>
      </View>
    </>
  )
}

export default function ViewDeliveryPage() {
  const params = useLocalSearchParams<{ id: string }>()
  const { status, data, error } = useQuery({
    queryKey: ["getDelivery", params.id],
    queryFn: () => getDelivery(Number(params.id)),
  })

  return (
    <View
      style={styles.mainScreen}
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
    >
      {status === "pending" && <Text>Loading ...</Text>}
      {status === "error" && <Text>Error: {error.message}</Text>}
      {status === "success" && (
        <>
          {data === null ? (
            <Text>No such delivery.</Text>
          ) : (
            <>
              <VehicleDetails id={data.delivery.vehicleId} />
              <DeliveryProgress
                isCompleted={data.delivery.status === "COMPLETED"}
                deliveryId={params.id}
              />

              <View style={styles.bottomSection}>
                <View style={styles.optionSection}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.viewPackageBtn}
                    onPress={() => {
                      router.push({
                        pathname: "/(app)/driver/deliveries/[id]/packages",
                        params: {
                          id: data.delivery.id,
                        },
                      })
                    }}
                  >
                    <Text style={styles.optionBtnText}>View Packages</Text>
                  </TouchableOpacity>
                  <StartStopDelivery
                    isStartDeliveryAllowed={
                      data.delivery.status === "IN_TRANSIT"
                    }
                    deliveryId={data.delivery.id}
                  />
                </View>
              </View>
            </>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
  },
  headerSection: {
    backgroundColor: "#79CFDC",
    paddingBottom: 12,
    paddingTop: 45,
    elevation: 20,
    shadowColor: "#000000",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#F8F8F8",
    bottom: 2,
  },
  headerIconMenu: {
    marginRight: 15,
  },
  statsSection: {
    padding: 10,
    marginTop: 30,
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  statsCard: {
    padding: 10,
    width: "45%",
    height: 150,
    borderRadius: 10,
    paddingLeft: 10,
  },
  miniCardTitle: {
    marginLeft: 10,
    color: "#000000",
    fontFamily: "Roboto-Bold",
    fontSize: 72,
    position: "absolute",
    bottom: 10,
  },
  dataText: {
    height: "100%",
    fontWeight: "600",
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  optionSection: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 15,
  },
  viewPackageBtn: {
    borderRadius: 5,
    paddingVertical: 5,
    backgroundColor: "#EEAE3F",
    width: 180,
  },
  deliveryPackageBtn: {
    borderRadius: 5,
    paddingVertical: 5,
    backgroundColor: "#65DB7F",
    width: 180,
  },
  optionBtnText: {
    color: "#000000",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    padding: 10,
  },
  bottomSection: {
    backgroundColor: "#79CFDC",
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  truckLogo: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  truckNumber: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  truckNumber1: {
    fontWeight: "600",
    fontSize: 20,
  },
  truckNumber2: {
    fontSize: 20,
  },
})
