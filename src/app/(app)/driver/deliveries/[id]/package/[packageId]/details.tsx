import { getPackageById } from "@/api/package"
import { ErrorView } from "@/components/error-view"
import { LoadingView } from "@/components/loading-view"
import { Feather } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { Link, useLocalSearchParams } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"

function GotoDeliverPackagePageButton(props: {
  shipmentId: number
  packageId: string
}) {
  return (
    <View
      style={{
        marginTop: 12,
      }}
    >
      <Link
        asChild
        href={{
          pathname:
            "/(app)/driver/deliveries/[id]/package/[packageId]/mark-as-delivered",
          params: {
            id: props.shipmentId,
            packageId: props.packageId,
          },
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            backgroundColor: "#f97316",
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
            Mark as Delivered
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

export default function PackageDetailsPage() {
  const { id, packageId } = useLocalSearchParams<{
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
      {status === "pending" && <LoadingView />}
      {status === "error" && <ErrorView message={error.message} />}
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
                  color: "white",
                }}
              />
              <Text
                style={{
                  fontFamily: "Roboto-Bold",
                  fontSize: 20,
                  color: "white",
                }}
              >
                ID: {data.package.id}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  color: "white",
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
                  color: "white",
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
                {data.package.receiverBarangay}, {data.package.receiverCity},{" "}
                {data.package.receiverStateOrProvince},{" "}
                {data.package.receiverCountryCode}{" "}
                {data.package.receiverPostalCode}
              </Text>
              <Text
                style={{
                  color: "white",
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
                  color: "white",
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
                backgroundColor: "white",
                marginVertical: 24,
              }}
            />
            <View>
              <Text
                style={{
                  color: "white",
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
                  color: "white",
                }}
              >
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
              <Text
                style={{
                  color: "white",
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
                  color: "white",
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
                    View Location on Map
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
            {data.package.status !== "DELIVERED" && (
              <GotoDeliverPackagePageButton
                shipmentId={Number(id)}
                packageId={packageId}
              />
            )}
          </View>
        </View>
      )}
    </View>
  )
}
