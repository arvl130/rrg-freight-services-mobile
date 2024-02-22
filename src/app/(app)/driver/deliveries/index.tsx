/* eslint-disable prettier/prettier */
import { useQuery } from "@tanstack/react-query"
import { SplashScreen, router } from "expo-router"
import { DateTime } from "luxon"
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native"
import { getDeliveries } from "@/api/delivery"
import { Feather, Ionicons } from "@expo/vector-icons"
export default function DeliveriesPage() {
  const { status, data, error } = useQuery({
    queryKey: ["getDeliveries"],
    queryFn: () => getDeliveries(),
  })

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
            name="arrow-back-outline"
            size={27}
            color="#F8F8F8"
            activeOpacity={0.6}
            onPress={() => router.push("/(app)/driver/dashboard")}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Page</Text>
      </View>

      <ScrollView style={{ overflow: "hidden" }}>
        <View style={styles.deliveryTruckTile}>
          <View style={[styles.statsCard]}>
            <View style={styles.packageTitle}>
              <Text style={styles.packageNumber}>1234566778</Text>
              <Text style={styles.truckNumber}> DELIVERY TRUCK 1</Text>
            </View>
            <View style={[styles.miniCard]}>
              <TouchableOpacity>
                <Feather name="navigation" style={styles.navIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.packageDetailsContainer}>
              <Feather name="package" style={styles.packageIcon} />
              <View style={styles.packageContainer}>
                <View style={styles.packageDetails}>
                  <Ionicons name="newspaper-outline" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    February 3, 2024
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="map-pin" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    UAE Hub - Main Hub
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="calendar" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    6th April - 10th April
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="package" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>12</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.statsCard]}>
            <View style={styles.packageTitle}>
              <Text style={styles.packageNumber}>1234566778</Text>
              <Text style={styles.truckNumber}> DELIVERY TRUCK 1</Text>
            </View>
            <View style={[styles.miniCard]}>
              <TouchableOpacity>
                <Feather name="navigation" style={styles.navIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.packageDetailsContainer}>
              <Feather name="package" style={styles.packageIcon} />
              <View style={styles.packageContainer}>
                <View style={styles.packageDetails}>
                  <Ionicons name="newspaper-outline" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    February 3, 2024
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="map-pin" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    UAE Hub - Main Hub
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="calendar" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    6th April - 10th April
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="package" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>12</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.statsCard]}>
            <View style={styles.packageTitle}>
              <Text style={styles.packageNumber}>1234566778</Text>
              <Text style={styles.truckNumber}> DELIVERY TRUCK 1</Text>
            </View>
            <View style={[styles.miniCard]}>
              <TouchableOpacity>
                <Feather name="navigation" style={styles.navIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.packageDetailsContainer}>
              <Feather name="package" style={styles.packageIcon} />
              <View style={styles.packageContainer}>
                <View style={styles.packageDetails}>
                  <Ionicons name="newspaper-outline" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    February 3, 2024
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="map-pin" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    UAE Hub - Main Hub
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="calendar" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    6th April - 10th April
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="package" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>12</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.statsCard]}>
            <View style={styles.packageTitle}>
              <Text style={styles.packageNumber}>1234566778</Text>
              <Text style={styles.truckNumber}> DELIVERY TRUCK 1</Text>
            </View>
            <View style={[styles.miniCard]}>
              <TouchableOpacity>
                <Feather name="navigation" style={styles.navIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.packageDetailsContainer}>
              <Feather name="package" style={styles.packageIcon} />
              <View style={styles.packageContainer}>
                <View style={styles.packageDetails}>
                  <Ionicons name="newspaper-outline" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    February 3, 2024
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="map-pin" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    UAE Hub - Main Hub
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="calendar" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    6th April - 10th April
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="package" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>12</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.statsCard]}>
            <View style={styles.packageTitle}>
              <Text style={styles.packageNumber}>1234566778</Text>
              <Text style={styles.truckNumber}> DELIVERY TRUCK 1</Text>
            </View>
            <View style={[styles.miniCard]}>
              <TouchableOpacity>
                <Feather name="navigation" style={styles.navIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.packageDetailsContainer}>
              <Feather name="package" style={styles.packageIcon} />
              <View style={styles.packageContainer}>
                <View style={styles.packageDetails}>
                  <Ionicons name="newspaper-outline" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    February 3, 2024
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="map-pin" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    UAE Hub - Main Hub
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="calendar" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>
                    6th April - 10th April
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <Feather name="package" style={styles.miniIcon} />
                  <Text style={styles.miniIconDescription}>12</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {status === "pending" && <Text>Loading ...</Text>}
      {status === "error" && <Text>Error {error.message}</Text>}
      {status === "success" && (
        <View>
          {data.deliveries.length === 0 ? (
            <Text
              style={{
                textAlign: "center",
              }}
            >
              No deliveries assigned.
            </Text>
          ) : (
            <>
              {data.deliveries.map((delivery, index) => (
                <View
                  key={delivery.id}
                  style={
                    index === data.deliveries.length - 1
                      ? undefined
                      : {
                          marginBottom: 12,
                        }
                  }
                >
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(app)/driver/deliveries/[id]/",
                        params: {
                          id: delivery.id,
                        },
                      })
                    }
                    activeOpacity={0.6}
                    style={{
                      backgroundColor: "black",
                      borderRadius: 8,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 24,
                        }}
                      >
                        {delivery.id}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: "white",
                        }}
                      >
                        Assigned:{" "}
                        {DateTime.fromISO(delivery.createdAt).toLocaleString(
                          DateTime.DATETIME_SHORT,
                        )}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#DEDBDB",
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
  deliveryTruckTile: {
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
    backgroundColor: "#FFFFFF",
    width: "95%",
    height: 180,
    borderRadius: 20,
    paddingLeft: 10,
  },
  miniCard: {
    backgroundColor: "#78CFDC",
    position: "absolute",
    right: 0,
    bottom: 0,
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    width: 90,
  },
  miniIconDescription: {
    marginLeft: 10,
    color: "black",
    fontSize: 15,
    top: 15,
  },
  packageIcon: {
    fontSize: 100,
    marginLeft: 10,
    top: 20,
    color: "#78CFDC",
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
  packageNumber: {
    color: "black",
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "roboto",
  },

  truckNumber: {
    color: "#78CFDC",
    marginHorizontal: 80,
    fontSize: 20,
    fontWeight: "normal",
    backgroundColor: "#F0F0F0",
    borderRadius: 100,
    padding: 1,
    width: "45%",
  },
  packageTitle: {
    flexDirection: "row",
    marginHorizontal: 5,
  },
  packageDetails: {
    flexDirection: "row",
    marginHorizontal: 5,
    elevation: 20,
  },
  packageDetailsContainer: {
    flexDirection: "row",
    marginHorizontal: 5,
    elevation: 20,
  },
  miniIcon: {
    color: "#78CFDC",
    fontSize: 20,
    top: 15,
  },
  packageContainer: {
    flexDirection: "column",
    marginHorizontal: 5,
    gap: 6,
  },
  navIcon: {
    fontSize: 30,
    color: "#FFFFFF",
    marginLeft: 20,
    transform: [{ scaleX: -1 }],
  },
})
