/* eslint-disable prettier/prettier */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, router, useLocalSearchParams } from "expo-router"
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useLocationTracker } from "@/components/location-tracker"
import { clearStorage, saveId } from "@/utils/storage"
import { getVehicle } from "@/api/vehicle"
import { getDeliveryPackages } from "@/api/shipment"
import { updateDeliveryStatusToCompleted } from "@/api/package"
import { getDelivery, getNextPackageToDeliverInDelivery } from "@/api/delivery"
import { LoadingView } from "@/components/loading-view"
import { ErrorView } from "@/components/error-view"
import { LocationPermissionRequiredView } from "@/components/location-permission"
import { useSavedShipment } from "@/components/saved-shipment"
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import { getCurrentPositionAsync } from "expo-location"
import type { DeliveryShipment, Shipment } from "@/server/db/entities"

function StartStopDelivery({ deliveryId }: { deliveryId: number }) {
  const { reload } = useSavedShipment()
  const { isTracking, startTracking, stopTracking } = useLocationTracker()

  if (isTracking)
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "#ef4444",
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 12,
        }}
        activeOpacity={0.6}
        onPress={async () => {
          await clearStorage()
          await reload()
          await stopTracking()
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
          Stop Tracking
        </Text>
      </TouchableOpacity>
    )

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        borderRadius: 5,
        paddingVertical: 12,
        backgroundColor: "#65DB7F",
      }}
      activeOpacity={0.6}
      onPress={async () => {
        await saveId({
          id: deliveryId,
          type: "DELIVERY",
        })
        await reload()
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
        Start Tracking
      </Text>
    </TouchableOpacity>
  )
}

function DeliveryProgress({
  isCompleted,
  deliveryId,
}: {
  deliveryId: string
  isCompleted: boolean
}) {
  const { status, data } = useQuery({
    queryKey: ["getDeliveryPackages", deliveryId],
    queryFn: () => getDeliveryPackages(Number(deliveryId)),
  })

  return (
    <View>
      <View style={{ flexDirection: "row", padding: 5, columnGap: 10 }}>
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: "#FBC15D",
              flexDirection: "row",
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.dataText, { position: "absolute", top: 8 }]}>
            Assigned to Deliver
          </Text>
          <MaterialCommunityIcons
            style={styles.truckIcon}
            name="truck-outline"
            size={66}
            color="black"
          />
          <View style={styles.line} />
          <View style={styles.infoContainer}>
            <Text style={styles.miniCardTitle}>
              {status === "pending" && "..."}
              {status === "error" && "!"}
              {status === "success" && data.packages.length}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: "#ED5959",
              flexDirection: "row",
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.dataText, { position: "absolute", top: 8 }]}>
            Failed Delivery
          </Text>
          <Feather
            name="package"
            size={66}
            color="black"
            style={styles.truckIcon}
          />
          <View style={styles.line} />
          <View style={styles.infoContainer}>
            <Text style={styles.miniCardTitle}>
              {status === "pending" && "..."}
              {status === "error" && "!"}
              {status === "success" &&
                data.packages.filter(
                  (_package: any) => _package.status !== "DELIVERED",
                ).length}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", padding: 8, columnGap: 8 }}>
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: "#AAEEF8",
              flexDirection: "row",
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.dataText, { position: "absolute", top: 8 }]}>
            Total Items Delivered
          </Text>
          <Feather
            name="check-square"
            size={66}
            color="black"
            style={styles.truckIcon}
          />
          <View style={styles.line2} />
          <View style={styles.infoContainer}>
            <Text style={styles.miniCardTitle}>
              {status === "pending" && "..."}
              {status === "error" && "!"}
              {status === "success" &&
                data.packages.filter(
                  (_package: any) => _package.status === "DELIVERED",
                ).length}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

function VehicleDetails({ id }: { id: number }) {
  const { status, data, error, refetch } = useQuery({
    queryKey: ["getVehicle", id],
    queryFn: () => getVehicle(Number(id)),
  })

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {status === "pending" && <LoadingView />}
      {status === "error" && (
        <ErrorView
          message={error.message}
          onRetry={() => {
            refetch()
          }}
        />
      )}
      {status === "success" && (
        <>
          {data === null ? (
            <Text>No such vehicle.</Text>
          ) : (
            <LocationPermissionRequiredView>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: 40,
                }}
              >
                <View style={styles.truckLogo}>
                  <Image
                    source={require("@/assets/images/truckLogo.png")}
                    style={{ width: 200, height: 150 }}
                  />
                </View>
                <View style={styles.truckNumber}>
                  <Text style={styles.truckNumber1}>
                    Delivery {data.vehicle.displayName}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                      marginTop: 3,
                      paddingHorizontal: 12,
                      fontSize: 24,
                      borderRadius: 8,
                      fontFamily: "Roboto-Medium",
                    }}
                  >
                    {data.vehicle.plateNumber}
                  </Text>
                </View>
              </View>
            </LocationPermissionRequiredView>
          )}
        </>
      )}
    </View>
  )
}

function CalculateNearestPackage(props: { shipmentId: number }) {
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const {
        coords: { longitude, latitude },
      } = await getCurrentPositionAsync()

      return await getNextPackageToDeliverInDelivery({
        shipmentId: props.shipmentId,
        long: longitude,
        lat: latitude,
      })
    },
    onSuccess: ({ packageId }) => {
      if (packageId) {
        Alert.alert(
          "Next Delivery Set",
          `Package with tracking number ${packageId} has been set as the next delivery.`,
          [
            {
              text: "OK",
              onPress: () => {
                router.navigate({
                  pathname:
                    "/(app)/driver/deliveries/[id]/package/[packageId]/details",
                  params: {
                    id: props.shipmentId,
                    packageId,
                  },
                })
              },
            },
          ],
        )
      } else
        Alert.alert(
          "No More Packages",
          `There are no more packages to deliver.`,
          [
            {
              text: "OK",
            },
          ],
        )
    },
    onError: ({ message }) => {
      Alert.alert("Next Delivery Set Failed", message, [
        {
          text: "OK",
        },
      ])
    },
  })

  return (
    <View
      style={{
        marginTop: 12,
      }}
    >
      <TouchableOpacity
        disabled={isPending}
        activeOpacity={0.6}
        style={{
          backgroundColor: "#F17834",
          minHeight: 48,
          justifyContent: "center",
          borderRadius: 8,
          opacity: isPending ? 0.6 : undefined,
        }}
        onPress={() => mutate()}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
          }}
        >
          Find Nearest package
        </Text>
      </TouchableOpacity>
    </View>
  )
}

function GoToNearestPackage(props: {
  shipmentId: number
  nextToBeDeliveredPackageId: string
}) {
  const { status, data, error } = useQuery({
    queryKey: ["getDeliveryPackages", props.shipmentId],
    queryFn: async () => {
      return await getDeliveryPackages(props.shipmentId)
    },
  })

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const {
        coords: { longitude, latitude },
      } = await getCurrentPositionAsync()

      return await getNextPackageToDeliverInDelivery({
        shipmentId: props.shipmentId,
        long: longitude,
        lat: latitude,
      })
    },
    onSuccess: ({ packageId }) => {
      if (packageId) {
        Alert.alert(
          "Next Delivery Set",
          `Package with tracking number ${packageId} has been set as the next delivery.`,
          [
            {
              text: "OK",
              onPress: () => {
                router.navigate({
                  pathname:
                    "/(app)/driver/deliveries/[id]/package/[packageId]/details",
                  params: {
                    id: props.shipmentId,
                    packageId,
                  },
                })
              },
            },
          ],
        )
      } else
        Alert.alert(
          "No More Packages",
          `There are no more packages to deliver.`,
          [
            {
              text: "OK",
            },
          ],
        )
    },
    onError: ({ message }) => {
      Alert.alert("Next Delivery Set Failed", message, [
        {
          text: "OK",
        },
      ])
    },
  })

  if (status === "pending") return <Text>...</Text>
  if (status === "error") return <Text>Error occured: {error.message}</Text>

  const inTransitPackages = data.packages.filter(
    ({ shipmentPackageStatus }) => shipmentPackageStatus === "IN_TRANSIT",
  )

  if (inTransitPackages.length === 0)
    return (
      <View
        style={{
          borderRadius: 6,
          backgroundColor: "#dcfce7",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 12,
          marginTop: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "Roboto-Medium",
            color: "#14532d",
            paddingHorizontal: 6,
            textAlign: "center",
          }}
        >
          There are no more packages to deliver.
        </Text>
      </View>
    )

  const nextPackageIsStillInTransit = inTransitPackages.some(
    ({ id }) => id === props.nextToBeDeliveredPackageId,
  )

  if (nextPackageIsStillInTransit)
    return (
      <View
        style={{
          marginTop: 12,
        }}
      >
        <Link
          asChild
          href={{
            pathname:
              "/(app)/driver/deliveries/[id]/package/[packageId]/details",
            params: {
              id: props.shipmentId,
              packageId: props.nextToBeDeliveredPackageId,
            },
          }}
        >
          <TouchableOpacity
            disabled={isPending}
            activeOpacity={0.6}
            style={{
              backgroundColor: "#F17834",
              minHeight: 48,
              justifyContent: "center",
              borderRadius: 8,
              opacity: isPending ? 0.6 : undefined,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontFamily: "Roboto-Medium",
                fontSize: 16,
              }}
            >
              Go To Nearest package
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    )
  else
    return (
      <View
        style={{
          marginTop: 12,
        }}
      >
        <TouchableOpacity
          disabled={isPending}
          activeOpacity={0.6}
          style={{
            backgroundColor: "#F17834",
            minHeight: 48,
            justifyContent: "center",
            borderRadius: 8,
            opacity: isPending ? 0.6 : undefined,
          }}
          onPress={() => mutate()}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Roboto-Medium",
              fontSize: 16,
            }}
          >
            Find Next Nearest package
          </Text>
        </TouchableOpacity>
      </View>
    )
}

function TrackingEnabledButtons(props: {
  delivery: Shipment & DeliveryShipment
  shipmentId: number
}) {
  const { savedShipment } = useSavedShipment()
  const { isTracking } = useLocationTracker()

  if (!isTracking) return <></>
  if (savedShipment === null) return <></>
  if (savedShipment.id !== props.shipmentId) return <></>

  return (
    <>
      {props.delivery.nextToBeDeliveredPackageId === null ? (
        <CalculateNearestPackage shipmentId={props.shipmentId} />
      ) : (
        <GoToNearestPackage
          nextToBeDeliveredPackageId={props.delivery.nextToBeDeliveredPackageId}
          shipmentId={props.shipmentId}
        />
      )}
    </>
  )
}

function CompletePackageButton(props: { shipmentId: number }) {
  const { status, data, error } = useQuery({
    queryKey: ["getDeliveryPackages", props.shipmentId],
    queryFn: async () => {
      return await getDeliveryPackages(props.shipmentId)
    },
  })

  const { isTracking, stopTracking } = useLocationTracker()
  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationKey: ["updateDeliveryStatusToCompleted", props.shipmentId],
    mutationFn: async () => {
      if (isTracking) await stopTracking()
      await updateDeliveryStatusToCompleted(props.shipmentId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDeliveriesByStatus"],
      })
      queryClient.invalidateQueries({
        queryKey: ["getDeliveryPackages", props.shipmentId.toString()],
      })
      queryClient.invalidateQueries({
        queryKey: ["getDelivery", props.shipmentId.toString()],
      })
    },
  })

  if (status === "pending") return <Text>...</Text>
  if (status === "error") return <Text>Error occured: {error.message}</Text>

  const hasPendingPackages = data.packages.some(
    ({ shipmentPackageStatus }) => shipmentPackageStatus === "IN_TRANSIT",
  )

  if (hasPendingPackages) return <></>
  else
    return (
      <View
        style={{
          marginTop: 12,
        }}
      >
        <TouchableOpacity
          disabled={isPending}
          activeOpacity={0.6}
          style={{
            backgroundColor: "#16a34a",
            minHeight: 48,
            flexDirection: "row",
            justifyContent: "center",
            columnGap: 4,
            alignItems: "center",
            borderRadius: 8,
            opacity: isPending ? 0.6 : undefined,
          }}
          onPress={() => {
            mutate()
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Roboto-Medium",
              fontSize: 16,
            }}
          >
            Mark as Completed
          </Text>
        </TouchableOpacity>
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
      refreshControl={
        <RefreshControl
          refreshing={status !== "pending" && fetchStatus === "fetching"}
          onRefresh={() => refetch()}
        />
      }
    >
      {status === "pending" && <LoadingView />}
      {status === "error" && (
        <ErrorView
          message={error.message}
          onRetry={() => {
            refetch()
          }}
        />
      )}
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
                  padding: 15,
                  paddingHorizontal: 12,
                }}
              >
                {data.delivery.status === "COMPLETED" && (
                  <View
                    style={{
                      borderRadius: 6,
                      backgroundColor: "#dcfce7",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 12,
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Medium",
                        color: "#14532d",
                        paddingHorizontal: 6,
                        textAlign: "center",
                      }}
                    >
                      This shipment has been completed.
                    </Text>
                  </View>
                )}

                {data.delivery.status === "PREPARING" && (
                  <View
                    style={{
                      borderRadius: 6,
                      backgroundColor: "#fee2e2",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 12,
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Medium",
                        color: "#7f1d1d",
                        paddingHorizontal: 6,
                        textAlign: "center",
                      }}
                    >
                      This shipment is still being prepared.
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                  }}
                >
                  <Link
                    asChild
                    href={{
                      pathname: "/(app)/driver/deliveries/[id]/packages/",
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

                  {/* TODO: Only show these buttons on the shipment
                    that is currently being tracked. */}
                  {data.delivery.status === "IN_TRANSIT" && (
                    <StartStopDelivery deliveryId={data.delivery.id} />
                  )}
                </View>

                <TrackingEnabledButtons
                  delivery={data.delivery}
                  shipmentId={Number(params.id)}
                />

                {data.delivery.status !== "COMPLETED" && (
                  <CompletePackageButton shipmentId={data.delivery.id} />
                )}
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
    padding: 20,
    borderRadius: 10,
    paddingLeft: 20,
  },
  miniCardTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 60,
    lineHeight: 72,
  },
  truckLogo: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
  line: {
    width: 2,
    backgroundColor: "black",
    marginHorizontal: 16,
    marginVertical: 10,
  },
  line2: {
    width: 2,
    backgroundColor: "black",
    marginHorizontal: 40,
    marginVertical: 10,
  },
  dataText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
  },
  truckIcon: {
    paddingTop: 10,
  },
})
