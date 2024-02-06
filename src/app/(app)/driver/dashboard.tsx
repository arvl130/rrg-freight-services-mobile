import auth from "@react-native-firebase/auth"
import { SplashScreen, router } from "expo-router"
import { useState } from "react"
import { useSession } from "@/components/auth"
import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native"
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons"

export default function DashboardPage() {
  useSession({
    required: {
      role: "DRIVER",
    },
  })

  const [isShowTitle, setIsShowTitle] = useState<
    | "TOTAL_DELIVERY"
    | "TOTAL_DELIVERED"
    | "FAILED_DELIVERY"
    | "PENDING_DELIVERY"
    | ""
  >("")

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
            <TouchableOpacity
              onPress={() => {
                if (isShowTitle === "TOTAL_DELIVERY") {
                  setIsShowTitle("")
                } else {
                  setIsShowTitle("TOTAL_DELIVERY")
                }
              }}
            >
              <Feather name="truck" size={38} color="#F8F8F8" />
            </TouchableOpacity>
            {isShowTitle === "TOTAL_DELIVERY" ? (
              <Text style={styles.miniCardTitle}>Total Delivery</Text>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "rgba(108, 207, 113 ,0.7)" },
          ]}
        >
          <View style={[styles.miniCard, { backgroundColor: "#6CCF71" }]}>
            <TouchableOpacity
              onPress={() => {
                if (isShowTitle === "TOTAL_DELIVERED") {
                  setIsShowTitle("")
                } else {
                  setIsShowTitle("TOTAL_DELIVERED")
                }
              }}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={38}
                color="#F8F8F8"
              />
            </TouchableOpacity>

            {isShowTitle === "TOTAL_DELIVERED" ? (
              <Text style={styles.miniCardTitle}>Total Delivered</Text>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "rgba(207, 81, 81,0.7)" },
          ]}
        >
          <View style={[styles.miniCard, { backgroundColor: "#CF5151" }]}>
            <TouchableOpacity
              onPress={() => {
                if (isShowTitle === "FAILED_DELIVERY") {
                  setIsShowTitle("")
                } else {
                  setIsShowTitle("FAILED_DELIVERY")
                }
              }}
            >
              <MaterialCommunityIcons
                name="truck-remove-outline"
                size={38}
                color="#F8F8F8"
              />
            </TouchableOpacity>
            {isShowTitle === "FAILED_DELIVERY" ? (
              <Text style={styles.miniCardTitle}>Failed Delivery</Text>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "rgba(194, 166, 68,0.7)" },
          ]}
        >
          <View style={[styles.miniCard, { backgroundColor: "#C2A644" }]}>
            <TouchableOpacity
              onPress={() => {
                if (isShowTitle === "PENDING_DELIVERY") {
                  setIsShowTitle("")
                } else {
                  setIsShowTitle("PENDING_DELIVERY")
                }
              }}
            >
              <MaterialIcons name="pending-actions" size={38} color="#F8F8F8" />
            </TouchableOpacity>
            {isShowTitle === "PENDING_DELIVERY" ? (
              <Text style={styles.miniCardTitle}>Pending Delivery</Text>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.optionSection}>
          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.optionBtn}
              onPress={() => router.push("/(app)/driver/deliveries")}
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
    backgroundColor: "blue",
    width: "45%",
    height: 150,
    borderRadius: 20,
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
  },
  miniCardTitle: {
    marginLeft: 10,
    color: "#F8F8F8",
    fontWeight: "800",
    fontSize: 17,
    flex: 1,
    flexWrap: "wrap",
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
  logoutBtn: {},
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
