import { getPackageById } from "@/api/package"
import { ErrorView } from "@/components/error-view"
import { LoadingView } from "@/components/loading-view"
import { useLocationTracker } from "@/components/location-tracker"
import { useSavedShipment } from "@/components/saved-shipment"
import { Feather, EvilIcons, AntDesign, FontAwesome } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { Link, useLocalSearchParams } from "expo-router"
import { Linking, Text, TouchableOpacity, View } from "react-native"

function GotoDeliverPackagePageButton(props: {
  shipmentId: number
  packageId: string
}) {
  const { savedShipment } = useSavedShipment()
  const { isTracking } = useLocationTracker()
  const isDisabled =
    savedShipment === null ||
    savedShipment.id !== props.shipmentId ||
    !isTracking

  return (
    <View
      style={{
        marginTop: 5,
      }}
    >
      <Link
        asChild
        href={{
          pathname:
            "/(app)/driver/deliveries/[id]/package/[packageId]/confirm-delivery",
          params: {
            id: props.shipmentId,
            packageId: props.packageId,
          },
        }}
      >
        <TouchableOpacity
          disabled={isDisabled}
          activeOpacity={0.6}
          style={{
            backgroundColor: "#65DB7F",
            paddingVertical: 10,
            borderRadius: 8,
            width: 150,
            opacity: isDisabled ? 0.7 : undefined,
          }}
        >
          <Text
            style={{
              color: "black",
              textAlign: "center",
              fontFamily: "Roboto-Medium",
            }}
          >
            Confirm Delivery{" "}
            <AntDesign name="checksquareo" size={15} color="black" />
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
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
    <View
      style={{
        flex: 1,
      }}
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
                backgroundColor: "#F8F8F8",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  paddingVertical: 0,
                  marginHorizontal: 0,
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
                    backgroundColor: "#78CFDC",
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 20,
                    paddingVertical: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      padding: 0,
                      columnGap: 10,
                    }}
                  >
                    {/*Notify Button*/}
                    <View
                      style={{
                        marginTop: 5,
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.6}
                        style={{
                          backgroundColor: "#F17834",
                          paddingVertical: 10,
                          borderRadius: 8,
                          width: 150,
                        }}
                        onPress={() => {
                          Linking.openURL(
                            `tel:${data.package.receiverContactNumber}`,
                          )
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            textAlign: "center",
                            fontFamily: "Roboto-Medium",
                          }}
                        >
                          Notify Receiver{" "}
                          <Feather name="bell" size={15} color="black" />
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/*Find Location Button*/}
                    <View
                      style={{
                        marginTop: 5,
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
                            backgroundColor: "#EEAE3F",
                            paddingVertical: 10,
                            borderRadius: 8,
                            padding: 2,
                            columnGap: 2,
                            width: 150,
                          }}
                        >
                          <Text
                            style={{
                              color: "black",
                              textAlign: "center",
                              fontFamily: "Roboto-Medium",
                            }}
                          >
                            Locate Address{" "}
                            <EvilIcons
                              name="location"
                              size={18}
                              color="black"
                            />
                          </Text>
                        </TouchableOpacity>
                      </Link>
                    </View>
                  </View>

                  {/*Failed Delivery*/}
                  <View
                    style={{
                      flexDirection: "row",
                      padding: 10,
                      columnGap: 10,
                    }}
                  >
                    <View
                      style={{
                        marginTop: 5,
                      }}
                    >
                      <Link
                        asChild
                        href={{
                          pathname: "#",
                          params: {
                            id,
                            packageId: data.package.id,
                          },
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={0.6}
                          style={{
                            backgroundColor: "#E24D4D",
                            paddingVertical: 10,
                            borderRadius: 8,
                            padding: 2,
                            columnGap: 2,
                            width: 150,
                          }}
                        >
                          <Text
                            style={{
                              color: "black",
                              textAlign: "center",
                              fontFamily: "Roboto-Medium",
                            }}
                          >
                            Failed Delivery{" "}
                            <FontAwesome
                              name="calendar-times-o"
                              size={15}
                              color="black"
                            />
                          </Text>
                        </TouchableOpacity>
                      </Link>

                      {/*Confirm Delivery*/}
                    </View>
                    {data.package.status !== "DELIVERED" && (
                      <GotoDeliverPackagePageButton
                        shipmentId={Number(id)}
                        packageId={packageId}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  )
}
