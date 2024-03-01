/* eslint-disable prettier/prettier */
import auth from "@react-native-firebase/auth"
import { SplashScreen, router } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { getCountOfInTransitPackagesByDriver } from "@/api/package"
import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native"
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons"
import { useSession } from "@/components/auth"
import { getDistance } from "geolib"
import * as Location from "expo-location"
import { useEffect, useState } from "react"

type Coordinates = {
  lat: number
  lon: number
}
function CalculateDistance(
  permission: boolean,
  coordinatesList: Coordinates[],
  currentLocation: Location.LocationObject | undefined,
) {
  const distance: number[] = []
  if (
    permission !== false &&
    coordinatesList.length > 1 &&
    currentLocation !== undefined
  ) {
    coordinatesList.map((coordinates) => {
      distance.push(
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
    })
  }
  const nearest = Math.min(...distance)
  const length = nearest.toFixed(1).toString().length

  if (nearest !== Infinity) {
    if (length > 3) {
      return nearest.toFixed(0)
    } else {
      return nearest.toFixed(1)
    }
  } else {
    return 0
  }
}

export default function DashboardPage() {
  useSession({
    required: {
      role: "DRIVER",
    },
  })

  const { data: totalDeliveryData, status } = useQuery({
    queryKey: ["getCountOfInTransitPackagesByDriver"],
    queryFn: () => getCountOfInTransitPackagesByDriver(),
  })

  const [location, setLocation] = useState<Location.LocationObject>()
  const [permission, setPermission] = useState(true)
  const coordinateList: Coordinates[] = []

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== "granted") {
        setPermission(false)
        return console.log("please grant location")
      }
      const currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation)
      setPermission(true)
    }
    getPermissions()
  }, [])

  if (status === "success" && location !== undefined) {
    totalDeliveryData.packageCoordinates.map((coordinates) => {
      coordinateList.push({ lat: coordinates.lat, lon: coordinates.lon })
    })
  }

  return (
    <View
      style={styles.mainScreen}
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
    >
      <View style={styles.headerSection}>
        <TouchableOpacity>
          <Ionicons
            style={styles.headerIconMenu}
            name="menu"
            size={27}
            color="#F8F8F8"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Are you sure you want to logout?",
              "",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Logout",
                  onPress: async () => {
                    try {
                      await auth().signOut()
                    } finally {
                    }
                  },
                  style: "default",
                },
              ],
              {
                cancelable: true,
              },
            )
          }}
        >
          <Ionicons
            style={styles.headerIconMenu}
            name="exit-outline"
            size={27}
            color="#F8F8F8"
          />
        </TouchableOpacity>
      </View>

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
                {CalculateDistance(permission, coordinateList, location)}
              </Text>
              <Text style={{ fontSize: 20 }}>Km</Text>
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
          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.optionBtn}
              onPress={() =>
                router.push("/(app)/driver/deliveries/viewDelivery")
              }
            >
              <Text style={styles.optionBtnText}>Deliveries</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.optionBtn}
              onPress={() => router.push("/(app)/driver/transfer-shipments")}
            >
              <Text style={styles.optionBtnText}>Transfer Shipments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    fontFamily: "",
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
    fontWeight: "900",
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
    fontWeight: "900",
    fontSize: 18,
    position: "absolute",
    bottom: 15,
  },

  dataText: {
    fontSize: 65,
    marginLeft: 5,
    fontWeight: "bold",
    color: "#F8F8F8",
    height: "100%",
  },
  optionSection: {
    paddingVertical: 10,
  },
  optionBtn: {
    borderRadius: 15,
    paddingVertical: 13,
    marginBottom: 20,
    backgroundColor: "#DF5555",
  },
  optionBtnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
  },

  bottomSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
})
