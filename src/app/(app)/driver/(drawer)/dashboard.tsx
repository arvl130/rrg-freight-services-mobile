import { Link, SplashScreen } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { getCountOfInTransitPackagesByDriver } from "@/api/package"
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native"
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons"
import { useSession } from "@/components/auth"
import { getDistance } from "geolib"
import type { LocationObject } from "expo-location"
import { getCurrentPositionAsync } from "expo-location"
import { LocationPermissionRequiredView } from "@/components/location-permission"
import { useEffect, useState } from "react"
import { useExpoPushToken } from "@/components/expo-push-token"
import { getExpoPushTokens } from "@/api/expo-push-token"

type Coordinates = {
  lat: number
  lon: number
}
function calculateDistance(
  coordinatesList: Coordinates[],
  currentLocation: LocationObject,
) {
  if (coordinatesList.length === 0) return 0

  const distance = coordinatesList.map(
    (coordinates) =>
      getDistance(
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
        {
          latitude: coordinates.lat,
          longitude: coordinates.lon,
        },
        1,
      ) / 1000,
  )

  const nearest = Math.min(...distance)
  const length = nearest.toFixed(1).toString().length

  if (nearest === Infinity) return 0
  if (length > 3) {
    return nearest.toFixed(0)
  } else {
    return nearest.toFixed(1)
  }
}

function EnableNotificationsButtonWithRegisteredTokens(props: {
  registeredTokens: string[]
}) {
  const { token } = useExpoPushToken()

  if (!token)
    return (
      <Link asChild href="/(app)/driver/(drawer)/settings">
        <TouchableOpacity
          activeOpacity={0.6}
          style={{ ...styles.optionBtn, backgroundColor: "#f59e0b" }}
        >
          <Text style={styles.optionBtnText}>Enable Notifications</Text>
        </TouchableOpacity>
      </Link>
    )

  const tokenIsRegistered = props.registeredTokens.includes(token.data)
  if (!tokenIsRegistered)
    return (
      <Link asChild href="/(app)/driver/(drawer)/settings">
        <TouchableOpacity
          activeOpacity={0.6}
          style={{ ...styles.optionBtn, backgroundColor: "#f59e0b" }}
        >
          <Text style={styles.optionBtnText}>Enable Notifications</Text>
        </TouchableOpacity>
      </Link>
    )

  return <></>
}

function EnableNotificationsButton() {
  const { status, data, error } = useQuery({
    queryKey: ["getExpoPushTokens"],
    queryFn: () => getExpoPushTokens(),
  })

  if (status === "pending")
    return (
      <View>
        <Text>...</Text>
      </View>
    )

  if (status === "error")
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    )

  return (
    <EnableNotificationsButtonWithRegisteredTokens
      registeredTokens={data.tokens}
    />
  )
}

function MainView() {
  const registeredExpoPushTokens = useQuery({
    queryKey: ["getExpoPushTokens"],
    queryFn: () => getExpoPushTokens(),
  })
  const {
    data: totalDeliveryData,
    status,
    fetchStatus,
    refetch,
  } = useQuery({
    queryKey: ["getCountOfInTransitPackagesByDriver"],
    queryFn: () => getCountOfInTransitPackagesByDriver(),
  })
  const [location, setLocation] = useState<null | LocationObject>(null)
  const { isLoading } = useExpoPushToken()

  useEffect(() => {
    async function getCoordinates() {
      const currentLocation = await getCurrentPositionAsync()
      setLocation(currentLocation)
    }

    getCoordinates()
  }, [])

  const coordinateList: Coordinates[] = []
  if (status === "success" && location !== undefined) {
    totalDeliveryData.packageCoordinates.forEach((coordinates) => {
      coordinateList.push({ lat: coordinates.lat, lon: coordinates.lon })
    })
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
      }}
      refreshControl={
        <RefreshControl
          refreshing={
            fetchStatus === "fetching" ||
            registeredExpoPushTokens.fetchStatus === "fetching"
          }
          onRefresh={() => {
            refetch()
            registeredExpoPushTokens.refetch()
          }}
        />
      }
    >
      <View style={styles.statsSection}>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "rgba(81, 173, 207 ,0.7)" },
          ]}
        >
          <View style={[styles.miniCard, { backgroundColor: "#51ADCF" }]}>
            <TouchableOpacity>
              <Feather name="truck" size={38} color="#F8F8F8" />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.dataText}>{totalDeliveryData?.total}</Text>
            <Text style={styles.miniCardTitle}>Total Delivery</Text>
          </View>
        </View>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "rgba(108, 207, 113 ,0.7)" },
          ]}
        >
          <View style={[styles.miniCard, { backgroundColor: "#6CCF71" }]}>
            <TouchableOpacity>
              <Ionicons
                name="checkmark-done-outline"
                size={38}
                color="#F8F8F8"
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.dataText}>
              {totalDeliveryData?.completePackagesCount}
            </Text>

            <Text style={styles.miniCardTitle}>Total Delivered</Text>
          </View>
        </View>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "rgba(207, 81, 81,0.7)" },
          ]}
        >
          <View style={[styles.miniCard, { backgroundColor: "#CF5151" }]}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                size={38}
                color="#F8F8F8"
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.dataText}>
              <Text>
                {location === null
                  ? 0
                  : calculateDistance(coordinateList, location)}
              </Text>
              <Text style={{ fontSize: 20 }}>KM</Text>
            </Text>

            <Text style={styles.miniCardTitle}>Nearest Delivery</Text>
          </View>
        </View>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "rgba(194, 166, 68,0.7)" },
          ]}
        >
          <View style={[styles.miniCard, { backgroundColor: "#C2A644" }]}>
            <TouchableOpacity>
              <MaterialIcons name="pending-actions" size={38} color="#F8F8F8" />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.dataText}>
              {totalDeliveryData?.pendingPackagesCount}
            </Text>
            <Text style={styles.miniCardTitle}>Pending Delivery</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.optionSection}>
          {!isLoading && <EnableNotificationsButton />}
          <View>
            <Link asChild href="/(app)/driver/deliveries/(tabs)/">
              <TouchableOpacity activeOpacity={0.6} style={styles.optionBtn}>
                <Text style={styles.optionBtnText}>Deliveries</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View>
            <Link asChild href="/(app)/driver/transfer/forwarder/(tabs)">
              <TouchableOpacity activeOpacity={0.6} style={styles.optionBtn}>
                <Text style={styles.optionBtnText}>Forwarder Transfers</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View>
            <Link asChild href="/(app)/driver/transfer/warehouse/(tabs)">
              <TouchableOpacity activeOpacity={0.6} style={styles.optionBtn}>
                <Text style={styles.optionBtnText}>Warehouse Transfers</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default function DashboardPage() {
  useSession({
    required: {
      role: "DRIVER",
    },
  })

  return (
    <View
      style={styles.mainScreen}
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
    >
      <LocationPermissionRequiredView>
        <MainView />
      </LocationPermissionRequiredView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
  },
  headerSection: {
    backgroundColor: "#79CFDC",
    paddingBottom: 25,
    paddingTop: 60,
    elevation: 20,
    shadowColor: "#000000",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    textAlign: "left",
    fontSize: 28,
    fontFamily: "Roboto",
    letterSpacing: 1,
    color: "#F8F8F8",
  },
  headerIconMenu: {
    marginRight: 15,
  },
  statsSection: {
    padding: 10,
    marginTop: 30,
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  statsCard: {
    padding: 10,
    width: "45%",
    height: 140,
    borderRadius: 20,
    paddingLeft: 10,
  },
  miniCard: {
    backgroundColor: "yellow",
    position: "absolute",
    right: -10,
    top: -10,
    padding: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 140,
    zIndex: 20,
  },
  miniCardTitle: {
    marginLeft: 10,
    color: "#F8F8F8",
    fontFamily: "Roboto-Bold",
    fontSize: 18,
    position: "absolute",
    bottom: 15,
  },

  dataText: {
    fontSize: 56,
    marginLeft: 5,
    fontFamily: "Roboto-Bold",
    color: "#F8F8F8",
    height: "100%",
  },
  optionSection: {
    paddingVertical: 10,
  },
  optionBtn: {
    borderRadius: 15,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "#DF5555",
  },
  optionBtnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
  },

  bottomSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
})
