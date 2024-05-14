import { StyleSheet, Text, View } from "react-native"
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import type { Package } from "@/server/db/entities"
import type { ShipmentPackageStatus } from "@/utils/constants"

type ShipmentPackage = Package & {
  shipmentPackageStatus: ShipmentPackageStatus
  shipmentPackageIsDriverApproved: boolean
}

export function ProgressTiles({
  shipmentPackages,
}: {
  shipmentPackages: ShipmentPackage[]
}) {
  return (
    <View>
      <View style={{ flexDirection: "row", padding: 5, columnGap: 10 }}>
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: "#FBC15D",
              flexDirection: "row",
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.dataText, { position: "absolute", top: 8 }]}>
            Assigned to Deliver
          </Text>
          <MaterialCommunityIcons
            style={styles.truckIcon}
            name="truck-outline"
            size={66}
            color="black"
          />
          <View style={styles.line} />
          <View style={styles.infoContainer}>
            <Text style={styles.miniCardTitle}>{shipmentPackages.length}</Text>
          </View>
        </View>

        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: "#ED5959",
              flexDirection: "row",
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.dataText, { position: "absolute", top: 8 }]}>
            Failed Delivery
          </Text>
          <Feather
            name="package"
            size={66}
            color="black"
            style={styles.truckIcon}
          />
          <View style={styles.line} />
          <View style={styles.infoContainer}>
            <Text style={styles.miniCardTitle}>
              {
                shipmentPackages.filter(
                  (_package) => _package.shipmentPackageStatus === "FAILED",
                ).length
              }
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", padding: 8, columnGap: 8 }}>
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: "#AAEEF8",
              flexDirection: "row",
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.dataText, { position: "absolute", top: 8 }]}>
            Total Items Delivered
          </Text>
          <Feather
            name="check-square"
            size={66}
            color="black"
            style={styles.truckIcon}
          />
          <View style={styles.line2} />
          <View style={styles.infoContainer}>
            <Text style={styles.miniCardTitle}>
              {
                shipmentPackages.filter(
                  (_package) => _package.shipmentPackageStatus === "COMPLETED",
                ).length
              }
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  statsCard: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    paddingLeft: 20,
  },
  miniCardTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 60,
    lineHeight: 72,
  },
  truckLogo: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
  line: {
    width: 2,
    backgroundColor: "black",
    marginHorizontal: 16,
    marginVertical: 10,
  },
  line2: {
    width: 2,
    backgroundColor: "black",
    marginHorizontal: 40,
    marginVertical: 10,
  },
  dataText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
  },
  truckIcon: {
    paddingTop: 10,
  },
})
