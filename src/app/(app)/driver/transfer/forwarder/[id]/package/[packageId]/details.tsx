import {
  getForwarderTransferShipment,
  getForwarderTransferShipmentPackageById,
} from "@/api/shipment/transfer/fowarder"
import { ErrorView } from "@/components/error-view"
import { LoadingView } from "@/components/loading-view"
import { useLocationTracker } from "@/components/location-tracker"
import { ApproveButton } from "@/screens/transfer/forwarder/view-package-details-screen/approve-button"
import { Feather } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import {
  ScrollView,
  Linking,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native"

export default function PackageDetailsPage() {
  const { isLoading } = useLocationTracker()
  const { id, packageId } = useLocalSearchParams<{
    id: string
    packageId: string
  }>()
  const { status, data, error, refetch, fetchStatus } = useQuery({
    queryKey: ["getForwarderTransferShipmentPackageById", id, packageId],
    queryFn: () =>
      getForwarderTransferShipmentPackageById({
        shipmentId: Number(id),
        packageId: packageId ?? "",
      }),
  })

  const getForwarderTransferShipmentQuery = useQuery({
    queryKey: ["getForwarderTransferShipment", id],
    queryFn: () => getForwarderTransferShipment(Number(id)),
  })

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
      }}
      refreshControl={
        <RefreshControl
          refreshing={
            fetchStatus === "fetching" ||
            getForwarderTransferShipmentQuery.fetchStatus === "fetching"
          }
          onRefresh={() => {
            refetch()
            getForwarderTransferShipmentQuery.refetch()
          }}
        />
      }
    >
      {isLoading ? (
        <Text>Loading ...</Text>
      ) : (
        <View
          style={{
            flex: 1,
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
            <View
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  shadowColor: "#171717",
                  shadowOffset: { width: -2, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 3,
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
                      color: "black",
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Roboto-Bold",
                      fontSize: 20,
                      color: "black",
                    }}
                  >
                    ID: {data.package.id}
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold",
                      }}
                    >
                      Receiver Name:
                    </Text>{" "}
                    {data.package.receiverFullName}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold",
                      }}
                    >
                      Address:
                    </Text>{" "}
                    {data.package.receiverStreetAddress},{" "}
                    {data.package.receiverBarangay}, {data.package.receiverCity}
                    , {data.package.receiverStateOrProvince},{" "}
                    {data.package.receiverCountryCode}{" "}
                    {data.package.receiverPostalCode}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold",
                      }}
                    >
                      Contact Number:
                    </Text>{" "}
                    {data.package.receiverContactNumber}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
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
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold",
                      }}
                    >
                      Sender Name:
                    </Text>{" "}
                    {data.package.senderFullName}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold",
                      }}
                    >
                      Address:
                    </Text>{" "}
                    {data.package.senderStreetAddress},{" "}
                    {data.package.senderCity},{" "}
                    {data.package.senderStateOrProvince},{" "}
                    {data.package.senderCountryCode}{" "}
                    {data.package.senderPostalCode}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold",
                      }}
                    >
                      Contact Number:
                    </Text>{" "}
                    {data.package.senderContactNumber}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
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
                <View
                  style={{
                    marginTop: 12,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                      backgroundColor: "#ef4444",
                      paddingVertical: 12,
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      Linking.openURL(
                        `tel:${data.package.receiverContactNumber}`,
                      )
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontFamily: "Roboto-Medium",
                      }}
                    >
                      Call Receiver
                    </Text>
                  </TouchableOpacity>
                </View>
                {getForwarderTransferShipmentQuery.data !== undefined &&
                  getForwarderTransferShipmentQuery.data !== null &&
                  getForwarderTransferShipmentQuery.data.shipment.status ===
                    "IN_TRANSIT" &&
                  !data.package.shipmentPackageIsDriverApproved && (
                    <ApproveButton
                      shipmentId={
                        getForwarderTransferShipmentQuery.data.shipment.id
                      }
                      packageId={data.package.id}
                    />
                  )}
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  )
}
