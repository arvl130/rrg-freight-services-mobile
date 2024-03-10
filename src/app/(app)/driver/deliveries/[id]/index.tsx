import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { LocationPermissionResponse } from "expo-location"
import { Link, SplashScreen, useLocalSearchParams } from "expo-router"
import {
  Button,
  Image,
  RefreshControl,
  ScrollView,
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
import { LoadingView } from "@/components/loading-view"
import { ErrorView } from "@/components/error-view"

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
    <TouchableOpacity
      style={{
        flex: 1,
        borderRadius: 6,
        paddingVertical: 12,
        backgroundColor: "#22c55e",
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
          color: "black",
          textAlign: "center",
          fontFamily: "Roboto-Medium",
          fontSize: 16,
        }}
      >
        Start Delivery
      </Text>
    </TouchableOpacity>
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
    <>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "#ef4444",
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 12,
        }}
        activeOpacity={0.6}
        onPress={async () => {
          await clearStorage()
          await stopTracking()
        }}
      >
        <Text
          style={{
            fontFamily: "Roboto-Medium",
            color: "white",
            fontSize: 16,
            paddingHorizontal: 6,
            textAlign: "center",
          }}
        >
          Stop Delivery
        </Text>
      </TouchableOpacity>

      <Link
        asChild
        href={{
          pathname: "/(app)/driver/deliveries/[id]/deliver",
          params: {
            id: deliveryId,
          },
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#3b82f6",
            paddingVertical: 12,
            borderRadius: 8,
          }}
          activeOpacity={0.6}
        >
          <Text
            style={{
              fontFamily: "Roboto-Medium",
              color: "white",
              fontSize: 16,
              paddingHorizontal: 6,
              textAlign: "center",
            }}
          >
            Deliver Package
          </Text>
        </TouchableOpacity>
      </Link>
    </>
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
          <View
            style={{
              flexDirection: "row",
              padding: 12,
              columnGap: 12,
            }}
          >
            <View style={[styles.statsCard, { backgroundColor: "#EDAD3E" }]}>
              <View style={styles.infoContainer}>
                <Text style={styles.dataText}>Packages to Deliver</Text>
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
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
    </View>
  )
}

export default function ViewDeliveryPage() {
  const params = useLocalSearchParams<{ id: string }>()
  const { status, data, error, fetchStatus, refetch } = useQuery({
    queryKey: ["getDelivery", params.id],
    queryFn: () => getDelivery(Number(params.id)),
  })

  return (
    <ScrollView
      contentContainerStyle={styles.mainScreen}
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
      refreshControl={
        <RefreshControl
          refreshing={status !== "pending" && fetchStatus === "fetching"}
          onRefresh={() => refetch()}
        />
      }
    >
      {status === "pending" && <LoadingView />}
      {status === "error" && <ErrorView message={error.message} />}
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

              <View
                style={{
                  backgroundColor: "#79CFDC",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  flexDirection: "row",
                  gap: 12,
                  paddingTop: 16,
                  paddingBottom: 24,
                  paddingHorizontal: 12,
                }}
              >
                <Link
                  asChild
                  href={{
                    pathname: "/(app)/driver/deliveries/[id]/packages",
                    params: {
                      id: data.delivery.id,
                    },
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                      flex: 1,
                      borderRadius: 6,
                      backgroundColor: "#EEAE3F",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Medium",
                        color: "black",
                        fontSize: 16,
                        paddingHorizontal: 6,
                        textAlign: "center",
                      }}
                    >
                      View Packages
                    </Text>
                  </TouchableOpacity>
                </Link>

                <StartStopDelivery
                  isStartDeliveryAllowed={data.delivery.status === "IN_TRANSIT"}
                  deliveryId={data.delivery.id}
                />
              </View>
            </>
          )}
        </>
      )}
    </ScrollView>
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
  statsCard: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    paddingLeft: 10,
  },
  miniCardTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 72,
    lineHeight: 72,
  },
  dataText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  truckLogo: {
    justifyContent: "center",
    alignItems: "center",
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
