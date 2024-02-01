import { getDeliveryPackages } from "@/api/shipment"
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { DateTime } from "luxon"
import { ScrollView, Text, View } from "react-native"

export default function ViewDeliveryPackagesPage() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { status, data, error } = useQuery({
    queryKey: ["getDeliveryPackages", id],
    queryFn: () => getDeliveryPackages(Number(id)),
  })

  return (
    <ScrollView
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
              }}
            >
              Packages Delivered:
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
              }}
            >
              {
                data.packages.filter(
                  (_package: any) => _package.status === "DELIVERED",
                ).length
              }
              /{data.packages.length}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              gap: 8,
            }}
          >
            {data.packages.map((_package: any) => (
              <View
                key={_package.id}
                style={{
                  backgroundColor:
                    _package.status === "DELIVERED" ? "#22c55e" : "#f97316",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontWeight: "600",
                    }}
                  >
                    ID: {_package.id}
                  </Text>
                  {_package.status === "DELIVERED" ? (
                    <FontAwesome5 name="check" size={32} color="white" />
                  ) : (
                    <MaterialCommunityIcons
                      name="truck-delivery-outline"
                      size={32}
                      color="white"
                    />
                  )}
                </View>
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Sender Name: {_package.senderFullName}
                </Text>
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Receiver Name: {_package.receiverFullName}
                </Text>
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Address:
                </Text>
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  {_package.receiverStreetAddress}, {_package.receiverBarangay},{" "}
                  {_package.receiverCity}
                </Text>
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  {_package.receiverStateOrProvince},{" "}
                  {_package.receiverCountryCode}
                </Text>
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  {DateTime.fromISO(_package.createdAt).toLocaleString(
                    DateTime.DATETIME_SHORT_WITH_SECONDS,
                  )}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  )
}
