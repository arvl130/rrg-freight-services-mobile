import React from "react"
import { Text, TouchableOpacity, View, Linking } from "react-native"
import { Link, useLocalSearchParams } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { getPackageById } from "@/api/package"
import { ErrorView } from "@/components/error-view"
import { LoadingView } from "@/components/loading-view"
import { useLocationTracker } from "@/components/location-tracker"
import { useSavedShipment } from "@/components/saved-shipment"
import { Feather } from "@expo/vector-icons"

const StartDeliveryButton = ({ packageId }) => {
  const handleStartDelivery = () => {
    // Implement logic to start the delivery process
    console.log(`Initiating delivery for package ID: ${packageId}`)
    // Add your custom logic here (e.g., update package status, notify stakeholders)
  }

  return (
    <TouchableOpacity
      onPress={handleStartDelivery} // Ensure onPress is correctly wired to handleStartDelivery
      activeOpacity={0.6}
      style={{
        backgroundColor: "#4299e1",
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 12,
      }}
    >
      <Text
        style={{
          color: "white",
          textAlign: "center",
          fontFamily: "Roboto-Medium",
        }}
      >
        Start Delivery
      </Text>
    </TouchableOpacity>
  )
}

export default function PackageDetailsPage() {
  const { isLoading } = useLocationTracker()
  const { id, packageId } = useLocalSearchParams<{
    id: string
    packageId: string
  }>()
  const { status, data, error, refetch } = useQuery({
    queryKey: ["getPackageById", packageId],
    queryFn: () => getPackageById(packageId),
  })

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <Text>Loading ...</Text>
      ) : (
        <View style={{ flex: 1 }}>
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
                    {data.package.receiverBarangay},{data.package.receiverCity},
                    {data.package.receiverStateOrProvince},{" "}
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
                  <Link
                    asChild
                    href={{
                      pathname:
                        "/(app)/driver/deliveries/[id]/package/[packageId]/location",
                      params: {
                        id,
                        packageId: data.package.id,
                      },
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={{
                        backgroundColor: "#16a34a",
                        paddingVertical: 12,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontFamily: "Roboto-Medium",
                        }}
                      >
                        Find Location
                      </Text>
                    </TouchableOpacity>
                  </Link>
                  {/* Your existing package details view */}
                </View>

                {/* Start Delivery button */}
                {data.package.status !== "DELIVERED" && (
                  <StartDeliveryButton packageId={packageId} />
                )}

                {/* Other views (e.g., call receiver button) */}
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
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  )
}
