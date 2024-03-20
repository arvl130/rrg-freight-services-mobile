/* eslint-disable prettier/prettier */
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function DashboardPage() {
  return (
    <View style={styles.mainScreen}>
      <View style={styles.headerSection}>
        <TouchableOpacity>
          <Ionicons
            style={styles.headerIconMenu}
            name="menu"
            size={27}
            color="#F8F8F8"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery</Text>
      </View>
      <View style={styles.truckLogo}>
        <Image
          source={require("@/assets/images/truckLogo.png")}
          style={{ width: 300, height: 200 }}
        />
      </View>
      <View style={styles.truckNumber}>
        <Text style={styles.truckNumber1}>DELIVERY TRUCK 1</Text>
        <Text style={styles.truckNumber2}>ABC - 1234</Text>
      </View>
      <View style={styles.statsSection}>
        <View style={[styles.statsCard, { backgroundColor: "#EDAD3E" }]}>
          <View style={styles.infoContainer}>
            <Text style={styles.dataText}>Assigned to Deliver</Text>
            <Text style={styles.miniCardTitle}>23</Text>
          </View>
        </View>
        <View style={[styles.statsCard, { backgroundColor: "#79CFDC" }]}>
          <View style={styles.infoContainer}>
            <Text style={styles.dataText}>Delivery Completed</Text>
            <Text style={styles.miniCardTitle}>97</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.optionSection}>
          <TouchableOpacity activeOpacity={0.6} style={styles.viewPackageBtn}>
            <Text style={styles.optionBtnText}>View Packages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.deliveryPackageBtn}
          >
            <Text style={styles.optionBtnText}>Start Delivery</Text>
          </TouchableOpacity>
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
    paddingBottom: 12,
    paddingTop: 45,
    elevation: 20,
    shadowColor: "#000000",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#F8F8F8",
    bottom: 2,
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
    height: 150,
    borderRadius: 10,
    paddingLeft: 10,
  },
  miniCardTitle: {
    marginLeft: 10,
    color: "#000000",
    fontWeight: "900",
    fontSize: 90,
    position: "absolute",
    bottom: 10,
  },
  dataText: {
    height: "100%",
    fontWeight: "600",
    fontSize: 18,
    marginTop: 10,
  },
  optionSection: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 15,
  },
  viewPackageBtn: {
    borderRadius: 5,
    paddingVertical: 5,
    backgroundColor: "#EEAE3F",
    width: 180,
  },
  deliveryPackageBtn: {
    borderRadius: 5,
    paddingVertical: 5,
    backgroundColor: "#65DB7F",
    width: 180,
  },
  optionBtnText: {
    color: "#000000",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    padding: 10,
  },
  bottomSection: {
    backgroundColor: "#79CFDC",
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  truckLogo: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  truckNumber: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  truckNumber1: {
    fontWeight: "600",
    fontSize: 20,
  },
  truckNumber2: {
    fontSize: 20,
  },
})
