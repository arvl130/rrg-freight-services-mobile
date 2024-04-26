import {
  getDeliveryPackages,
  getDeliveryPackagesOrderedByDistance,
} from "@/api/shipment"
import { ErrorView } from "@/components/error-view"
import { LoadingView } from "@/components/loading-view"
import type { Package } from "@/server/db/entities"
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { getCurrentPositionAsync } from "expo-location"
import { Link, useLocalSearchParams } from "expo-router"
import { DateTime } from "luxon"
import { useState } from "react"
import {
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

function PackageMeter(props: { value: number; total: number }) {
  return (
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
        {props.value}/{props.total}
      </Text>
    </View>
  )
}

export function PackageItem(props: { package: Package }) {
  return (
    <>
      <View
        key={props.package.id}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
          backgroundColor:
            props.package.status === "DELIVERED" ? "#A4D8D8" : "white",
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
              fontSize: 20,
              fontWeight: "600",
            }}
          >
            ID: {props.package.id}
          </Text>
          {props.package.status === "DELIVERED" ? (
            <FontAwesome5 name="check" size={32} />
          ) : (
            <MaterialCommunityIcons name="truck-delivery-outline" size={32} />
          )}
        </View>
        <Text>
          <Text
            style={{
              fontFamily: "Roboto-Medium",
            }}
          >
            Sender Name:
          </Text>{" "}
          {props.package.senderFullName}
        </Text>
        <Text>
          <Text
            style={{
              fontFamily: "Roboto-Medium",
            }}
          >
            Receiver Name:
          </Text>{" "}
          {props.package.receiverFullName}
        </Text>
        <Text
          style={{
            fontFamily: "Roboto-Medium",
          }}
        >
          Address:
        </Text>
        <Text>
          {props.package.receiverStreetAddress},{" "}
          {props.package.receiverBarangay}, {props.package.receiverCity}
        </Text>
        <Text>
          {props.package.receiverStateOrProvince},{" "}
          {props.package.receiverCountryCode}
        </Text>
        <Text>
          <Text
            style={{
              fontFamily: "Roboto-Medium",
            }}
          >
            Date:
          </Text>{" "}
          {DateTime.fromISO(props.package.createdAt).toLocaleString(
            DateTime.DATETIME_SHORT_WITH_SECONDS,
          )}
        </Text>
      </View>
    </>
  )
}

function filterUndelivered(packages: Package[], isEnabled: boolean) {
  if (!isEnabled) return packages

  return packages.filter(({ status }) => status !== "DELIVERED")
}

export default function ViewPackagesPage() {
  const [isSortedByDistance, setIsSortedByDistance] = useState(false)
  const [undeliveredIsHidden, setUndeliveredIsHidden] = useState(false)

  const { id } = useLocalSearchParams<{ id: string }>()
  const { status, data, error, fetchStatus, refetch } = useQuery({
    queryKey: ["getDeliveryPackages", id, isSortedByDistance],
    queryFn: async () => {
      if (isSortedByDistance) {
        const {
          coords: { longitude, latitude },
        } = await getCurrentPositionAsync()

        return getDeliveryPackagesOrderedByDistance(
          Number(id),
          latitude,
          longitude,
        )
      } else return getDeliveryPackages(Number(id))
    },
    retry: 0,
  })

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#dedbdb",
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
        <ScrollView
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: 8,
            paddingHorizontal: 12,
          }}
          refreshControl={
            <RefreshControl
              refreshing={fetchStatus === "fetching"}
              onRefresh={() => refetch()}
            />
          }
        >
          <PackageMeter
            value={
              data.packages.filter(
                (_package) => _package.status === "DELIVERED",
              ).length
            }
            total={data.packages.length}
          />
          <View
            style={{
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>Show nearest first</Text>
              <Switch
                value={isSortedByDistance}
                onValueChange={(isSorted) => setIsSortedByDistance(isSorted)}
              />
            </View>
            <View
              style={{
                marginTop: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>Hide delivered</Text>
              <Switch
                value={undeliveredIsHidden}
                onValueChange={(isHidden) => setUndeliveredIsHidden(isHidden)}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              gap: 8,
            }}
          >
            {filterUndelivered(data.packages, undeliveredIsHidden).map(
              (_package) => (
                <Link
                  asChild
                  key={_package.id}
                  href={{
                    pathname:
                      "/(app)/driver/deliveries/[id]/package/[packageId]/details",
                    params: {
                      id,
                      packageId: _package.id,
                    },
                  }}
                >
                  <TouchableOpacity activeOpacity={0.6}>
                    <PackageItem package={_package} />
                  </TouchableOpacity>
                </Link>
              ),
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}
