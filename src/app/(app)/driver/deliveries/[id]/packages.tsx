import { getDeliveryPackages } from "@/api/shipment"
import type { Package } from "@/server/db/entities"
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { Link, useLocalSearchParams } from "expo-router"
import { DateTime } from "luxon"
import {
  RefreshControl,
  ScrollView,
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

export default function ViewPackagesPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { status, data, error, fetchStatus, refetch } = useQuery({
    queryKey: ["getDeliveryPackages", id],
    queryFn: () => getDeliveryPackages(Number(id)),
  })

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#dedbdb",
      }}
      refreshControl={
        <RefreshControl
          refreshing={status !== "pending" && fetchStatus === "fetching"}
          onRefresh={() => refetch()}
        />
      }
    >
      {status === "pending" && <Text>Loading ...</Text>}
      {status === "error" && <Text>Error: {error.message}</Text>}
      {status === "success" && (
        <>
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
              flex: 1,
              gap: 8,
            }}
          >
            {data.packages.map((_package) => (
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
            ))}
          </View>
        </>
      )}
    </ScrollView>
  )
}
