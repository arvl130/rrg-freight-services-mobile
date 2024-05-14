import { useQuery } from "@tanstack/react-query"
import { Image, StyleSheet, Text, View } from "react-native"
import { getVehicle } from "@/api/vehicle"
import { LoadingView } from "@/components/loading-view"
import { ErrorView } from "@/components/error-view"
import { LocationPermissionRequiredView } from "@/components/location-permission"

export function VehicleDetails({ id }: { id: number }) {
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
                    source={require("@/assets/images/truck-logo.png")}
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
