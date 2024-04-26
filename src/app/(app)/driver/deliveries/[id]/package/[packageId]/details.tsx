import { getDelivery } from "@/api/delivery"
import { getPackageById } from "@/api/package"
import { ErrorView } from "@/components/error-view"
import { LoadingView } from "@/components/loading-view"
import { useLocationTracker } from "@/components/location-tracker"
import { useSavedShipment } from "@/components/saved-shipment"
import {
  Feather,
  AntDesign,
  FontAwesome,
  Ionicons,
  FontAwesome6,
} from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { Link, useLocalSearchParams } from "expo-router"
import { Linking, Text, TouchableOpacity, View } from "react-native"

function FailDeliveryLink(props: {
  isNextPackageToDeliver: boolean
  shipmentId: number
  packageId: string
}) {
  const { savedShipment } = useSavedShipment()
  const { isTracking } = useLocationTracker()
  const isDisabled =
    savedShipment === null ||
    savedShipment.id !== props.shipmentId ||
    !isTracking ||
    !props.isNextPackageToDeliver

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Link
        asChild
        href={{
          pathname:
            "/(app)/driver/deliveries/[id]/package/[packageId]/fail-delivery",
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
            backgroundColor: "#ef4444",
            minHeight: 48,
            flexDirection: "row",
            justifyContent: "center",
            columnGap: 4,
            alignItems: "center",
            borderRadius: 8,
            opacity: isDisabled ? 0.6 : undefined,
          }}
        >
          <FontAwesome name="calendar-times-o" size={15} color="white" />

          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Roboto-Medium",
            }}
          >
            Failed Delivery
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

function ConfirmDeliveryLink(props: {
  isNextPackageToDeliver: boolean
  shipmentId: number
  packageId: string
}) {
  const { savedShipment } = useSavedShipment()
  const { isTracking } = useLocationTracker()
  const isDisabled =
    savedShipment === null ||
    savedShipment.id !== props.shipmentId ||
    !isTracking ||
    !props.isNextPackageToDeliver

  return (
    <View
      style={{
        flex: 1,
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
            backgroundColor: "#16a34a",
            minHeight: 48,
            flexDirection: "row",
            justifyContent: "center",
            columnGap: 4,
            alignItems: "center",
            borderRadius: 8,
            opacity: isDisabled ? 0.6 : undefined,
          }}
        >
          <AntDesign name="checksquareo" size={15} color="white" />
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Roboto-Medium",
            }}
          >
            Confirm Delivery
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

function BottomButtons(props: { shipmentId: number; packageId: string }) {
  const { status, data, error } = useQuery({
    queryKey: ["getDelivery", props.shipmentId],
    queryFn: () => getDelivery(props.shipmentId),
  })

  if (status === "pending") return <Text>...</Text>
  if (status === "error") return <Text>Error occured: {error.message}</Text>
  if (data === null) return <Text>No such delivery.</Text>

  return (
    <>
      <FailDeliveryLink
        isNextPackageToDeliver={
          data.delivery.nextToBeDeliveredPackageId === props.packageId
        }
        shipmentId={props.shipmentId}
        packageId={props.packageId}
      />
      <ConfirmDeliveryLink
        isNextPackageToDeliver={
          data.delivery.nextToBeDeliveredPackageId === props.packageId
        }
        shipmentId={props.shipmentId}
        packageId={props.packageId}
      />
    </>
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
                  paddingVertical: 12,
                  paddingHorizontal: 12,
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
                      color: "black",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold",
                        color: "#529FAB",
                        fontWeight: "bold",
                      }}
                    >
                      Failed Delivery Attempts: {data.package.failedAttempts} /
                      3
                    </Text>
                  </Text>
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
                    paddingHorizontal: 12,
                    rowGap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: 10,
                    }}
                  >
                    {/*Notify Button*/}
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.6}
                        style={{
                          backgroundColor: "#F17834",
                          minHeight: 48,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          columnGap: 4,
                          borderRadius: 8,
                        }}
                        onPress={() => {
                          Linking.openURL(
                            `tel:${data.package.receiverContactNumber}`,
                          )
                        }}
                      >
                        <Ionicons name="call" size={18} color="black" />
                        <Text
                          style={{
                            color: "black",
                            textAlign: "center",
                            fontFamily: "Roboto-Medium",
                          }}
                        >
                          Call Receiver
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/*Find Location Button*/}
                    <View
                      style={{
                        flex: 1,
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
                            minHeight: 48,
                            flexDirection: "row",
                            justifyContent: "center",
                            columnGap: 4,
                            alignItems: "center",
                            borderRadius: 8,
                            padding: 2,
                          }}
                        >
                          <FontAwesome6
                            name="location-dot"
                            size={16}
                            color="black"
                          />
                          <Text
                            style={{
                              color: "black",
                              textAlign: "center",
                              fontFamily: "Roboto-Medium",
                            }}
                          >
                            Locate Address
                          </Text>
                        </TouchableOpacity>
                      </Link>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: 10,
                    }}
                  >
                    {data.package.status !== "DELIVERED" && (
                      <BottomButtons
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
