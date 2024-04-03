import { useQuery } from "@tanstack/react-query"
import { Link } from "expo-router"
import { DateTime } from "luxon"
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native"
import { Feather, Ionicons } from "@expo/vector-icons"
import { LoadingView } from "@/components/loading-view"
import { ErrorView } from "@/components/error-view"
import { getForwarderTransferShipmentsByStatus } from "@/api/shipment/transfer/fowarder"

function ShipmentItem(props: {
  id: number
  createdAt: string
  packageCount: number
}) {
  return (
    <View style={[styles.statsCard]}>
      <View style={styles.packageTitle}>
        <Text style={styles.packageNumber}>{props.id}</Text>
        <Text style={styles.truckNumber}>TRUCK 1</Text>
      </View>
      <View style={[styles.miniCard]}>
        <TouchableOpacity>
          <Feather name="navigation" style={styles.navIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.packageDetailsContainer}>
        <Feather name="package" style={styles.packageIcon} />
        <View style={styles.packageContainer}>
          <View style={styles.packageDetails}>
            <Ionicons name="newspaper-outline" style={styles.miniIcon} />
            <Text style={styles.miniIconDescription}>{props.createdAt}</Text>
          </View>
          {/* TODO: Replace these with more useful info. */}
          {/* <View style={styles.packageDetails}>
            <Feather name="map-pin" style={styles.miniIcon} />
            <Text style={styles.miniIconDescription}>UAE Hub - Main Hub</Text>
          </View> */}
          {/* <View style={styles.packageDetails}>
            <Feather name="calendar" style={styles.miniIcon} />
            <Text style={styles.miniIconDescription}>
              6th April - 10th April
            </Text>
          </View> */}
          <View style={styles.packageDetails}>
            <Feather name="package" style={styles.miniIcon} />
            <Text style={styles.miniIconDescription}>{props.packageCount}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default function Page() {
  const { status, data, error, fetchStatus, refetch } = useQuery({
    queryKey: ["getForwarderTransferShipmentsByStatus", "IN_TRANSIT"],
    queryFn: () => getForwarderTransferShipmentsByStatus("IN_TRANSIT"),
  })

  return (
    <View style={styles.mainScreen}>
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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={fetchStatus === "fetching"}
              onRefresh={() => refetch()}
            />
          }
        >
          <View style={[styles.deliveryTruckTile]}>
            {data.shipments.length === 0 ? (
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                No shipments assigned.
              </Text>
            ) : (
              <>
                {[...data.shipments].reverse().map((shipment) => (
                  <Link
                    asChild
                    key={shipment.id}
                    href={{
                      pathname: "/(app)/driver/transfer/forwarder/[id]/",
                      params: {
                        id: shipment.id,
                      },
                    }}
                  >
                    <TouchableOpacity activeOpacity={0.6}>
                      <ShipmentItem
                        id={shipment.id}
                        packageCount={shipment.packageCount}
                        createdAt={DateTime.fromISO(
                          shipment.createdAt,
                        ).toLocaleString(DateTime.DATETIME_SHORT)}
                      />
                    </TouchableOpacity>
                  </Link>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: "#DEDBDB",
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
  deliveryTruckTile: {
    padding: 10,
    marginTop: 30,
    paddingHorizontal: 10,
    justifyContent: "center",
    gap: 20,
  },
  statsCard: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    height: 180,
    borderRadius: 20,
    paddingLeft: 10,
  },
  miniCard: {
    backgroundColor: "#78CFDC",
    position: "absolute",
    right: 0,
    bottom: 0,
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    width: 90,
  },
  miniIconDescription: {
    marginLeft: 10,
    color: "black",
    fontSize: 15,
    top: 15,
  },
  packageIcon: {
    fontSize: 100,
    marginLeft: 10,
    top: 20,
    color: "#78CFDC",
    height: "100%",
  },
  optionSection: {
    paddingVertical: 10,
  },
  optionBtn: {
    borderRadius: 15,
    paddingVertical: 13,
    marginBottom: 20,
    backgroundColor: "#DF5555",
  },
  optionBtnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
  },

  bottomSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  packageNumber: {
    color: "black",
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "roboto",
  },

  truckNumber: {
    color: "#78CFDC",
    marginLeft: "auto",
    paddingHorizontal: 12,
    fontSize: 20,
    fontWeight: "normal",
    backgroundColor: "#F0F0F0",
    borderRadius: 100,
    padding: 1,
  },
  packageTitle: {
    flexDirection: "row",
    marginHorizontal: 5,
  },
  packageDetails: {
    flexDirection: "row",
    marginHorizontal: 5,
    elevation: 20,
  },
  packageDetailsContainer: {
    flexDirection: "row",
    marginHorizontal: 5,
    elevation: 20,
  },
  miniIcon: {
    color: "#78CFDC",
    fontSize: 20,
    top: 15,
  },
  packageContainer: {
    flexDirection: "column",
    marginHorizontal: 5,
    gap: 6,
  },
  navIcon: {
    fontSize: 30,
    color: "#FFFFFF",
    marginLeft: 20,
    transform: [{ scaleX: -1 }],
  },
})
