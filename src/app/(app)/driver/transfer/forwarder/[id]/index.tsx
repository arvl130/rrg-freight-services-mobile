import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { RefreshControl, ScrollView, StyleSheet, Text } from "react-native"
import {
  getForwarderTransferShipment,
  getForwarderTransferShipmentPackages,
} from "@/api/shipment/transfer/fowarder"
import { LoadingView } from "@/components/loading-view"
import { ErrorView } from "@/components/error-view"
import { MainView } from "@/screens/transfer/forwarder/view-shipment-modal/main-view"

export default function Page() {
  const params = useLocalSearchParams<{ id: string }>()
  const getShipmentQuery = useQuery({
    queryKey: ["getForwarderTransferShipment", params.id],
    queryFn: () => getForwarderTransferShipment(Number(params.id)),
  })

  const getPackagesQuery = useQuery({
    queryKey: ["getForwarderTransferShipmentPackages", params.id],
    queryFn: () => getForwarderTransferShipmentPackages(Number(params.id)),
  })

  return (
    <ScrollView
      contentContainerStyle={styles.mainScreen}
      refreshControl={
        <RefreshControl
          refreshing={getShipmentQuery.fetchStatus === "fetching"}
          onRefresh={() => {
            getShipmentQuery.refetch()
            getPackagesQuery.refetch()
          }}
        />
      }
    >
      {getShipmentQuery.status === "pending" && <LoadingView />}
      {getShipmentQuery.status === "error" && (
        <ErrorView
          message={getShipmentQuery.error.message}
          onRetry={() => {
            getShipmentQuery.refetch()
          }}
        />
      )}
      {getShipmentQuery.status === "success" && (
        <>
          {getShipmentQuery.data === null ? (
            <Text>No such shipment.</Text>
          ) : (
            <>
              {getPackagesQuery.status === "pending" && <LoadingView />}
              {getPackagesQuery.status === "error" && (
                <ErrorView
                  message={getPackagesQuery.error.message}
                  onRetry={() => {
                    getPackagesQuery.refetch()
                  }}
                />
              )}
              {getPackagesQuery.status === "success" && (
                <MainView
                  shipment={getShipmentQuery.data.shipment}
                  packages={getPackagesQuery.data.packages}
                />
              )}
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
