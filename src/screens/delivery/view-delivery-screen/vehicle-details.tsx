import { useQuery } from "@tanstack/react-query"
import { Image, Text, View } from "react-native"
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
    <View>
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
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: 40,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("@/assets/images/truck-logo-animated.gif")}
                    style={{ width: 200, height: 150 }}
                  />
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 20,
                    }}
                  >
                    {data.vehicle.displayName}
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
