import { useQuery } from "@tanstack/react-query"
import { Link, useLocalSearchParams } from "expo-router"
import {
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
import { getWarehouseTransferShipment } from "@/api/shipment/transfer/warehouse"
import { LoadingView } from "@/components/loading-view"
import { ErrorView } from "@/components/error-view"
import { LocationPermissionRequiredView } from "@/components/location-permission"
import { useSavedShipment } from "@/components/saved-shipment"

function StartStopTransfer({ shipmentId }: { shipmentId: number }) {
  const { reload } = useSavedShipment()
  const { isTracking, startTracking, stopTracking } = useLocationTracker()

  if (isTracking)
    return (
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
          await reload()
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
          Stop Transfer
        </Text>
      </TouchableOpacity>
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
          id: shipmentId,
          type: "TRANSFER",
        })
        await reload()
        await startTracking()
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
        Start Transfer
      </Text>
    </TouchableOpacity>
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
                  <Text style={styles.truckNumber1}>
                    {data.vehicle.displayName}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      backgroundColor: "#16a34a",
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

export default function Page() {
  const params = useLocalSearchParams<{ id: string }>()
  const { status, data, error, fetchStatus, refetch } = useQuery({
    queryKey: ["getWarehouseTransferShipment", params.id],
    queryFn: () => getWarehouseTransferShipment(Number(params.id)),
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
            <Text>No such shipment.</Text>
          ) : (
            <>
              <VehicleDetails id={data.shipment.vehicleId} />

              <View
                style={{
                  backgroundColor: "#79CFDC",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  paddingTop: 16,
                  paddingBottom: 24,
                  paddingHorizontal: 12,
                }}
              >
                {data.shipment.status === "COMPLETED" && (
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

                {data.shipment.status === "PREPARING" && (
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
                      pathname:
                        "/(app)/driver/transfer/warehouse/[id]/packages/",
                      params: {
                        id: data.shipment.id,
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
                          color: "white",
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
                  {data.shipment.status === "IN_TRANSIT" && (
                    <StartStopTransfer shipmentId={data.shipment.id} />
                  )}
                </View>
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
