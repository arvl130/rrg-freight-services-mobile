import { getPackageById } from "@/api/package"
import { Feather } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"

export default function PackageDetailsPage() {
  const { packageId } = useLocalSearchParams<{
    id: string
    packageId: string
  }>()
  const { status, data, error } = useQuery({
    queryKey: ["getPackageById", packageId],
    queryFn: () => getPackageById(packageId),
  })

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {status === "pending" && <Text>Loading ...</Text>}
      {status === "error" && <Text>Error: {error.message}</Text>}
      {status === "success" && (
        <View
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#79CFDC",
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 12,
              }}
            >
              <Feather
                name="package"
                style={{
                  fontSize: 96,
                  marginVertical: 12,
                }}
              />
              <Text
                style={{
                  fontFamily: "Roboto-Bold",
                  fontSize: 20,
                }}
              >
                ID: {data.package.id}
              </Text>
            </View>

            <View>
              <Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Bold",
                  }}
                >
                  Receiver Name:
                </Text>{" "}
                {data.package.receiverFullName}
              </Text>
              <Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Bold",
                  }}
                >
                  Address:
                </Text>{" "}
                {data.package.receiverStreetAddress},{" "}
                {data.package.receiverBarangay}, {data.package.receiverCity},{" "}
                {data.package.receiverStateOrProvince},{" "}
                {data.package.receiverCountryCode}{" "}
                {data.package.receiverPostalCode}
              </Text>
              <Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Bold",
                  }}
                >
                  Contact Number:
                </Text>{" "}
                {data.package.receiverContactNumber}
              </Text>
              <Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Bold",
                  }}
                >
                  Email:
                </Text>{" "}
                {data.package.receiverEmailAddress}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "black",
                marginVertical: 24,
              }}
            />
            <View>
              <Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Bold",
                  }}
                >
                  Sender Name:
                </Text>{" "}
                {data.package.senderFullName}
              </Text>
              <Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Bold",
                  }}
                >
                  Address:
                </Text>{" "}
                {data.package.senderStreetAddress}, {data.package.senderCity},{" "}
                {data.package.senderStateOrProvince},{" "}
                {data.package.senderCountryCode} {data.package.senderPostalCode}
              </Text>
              <Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Bold",
                  }}
                >
                  Contact Number:
                </Text>{" "}
                {data.package.senderContactNumber}
              </Text>
              <Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Bold",
                  }}
                >
                  Email:
                </Text>{" "}
                {data.package.senderEmailAddress}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
