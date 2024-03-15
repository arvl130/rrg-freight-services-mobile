import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native"
import { useLocalSearchParams } from "expo-router"
import { getPackageAddressByPackageId } from "@/api/package"
import { useQuery } from "@tanstack/react-query"
import MapboxGL from "@rnmapbox/maps"
import { MaterialIcons } from "@expo/vector-icons"
import { LoadingView } from "@/components/loading-view"
import { ErrorView } from "@/components/error-view"
import NavigationArrow from "phosphor-react-native/src/icons/NavigationArrow"

MapboxGL.setAccessToken(`${process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY}`)

function generateMapUrl(options: { lat: number; long: number }) {
  return Platform.select({
    android: `google.navigation:q=${options.lat}+${options.long}`,
    ios: `maps://app?daddr=${options.lat}+${options.long}`,
  })
}

export default function ViewPackageLocationPage() {
  const { packageId } = useLocalSearchParams<{
    id: string
    packageId: string
  }>()

  const { status, data, error } = useQuery({
    queryKey: ["getPackageAddressByPackageId", packageId],
    queryFn: () => getPackageAddressByPackageId(packageId),
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
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.Camera
              zoomLevel={16}
              centerCoordinate={[
                data.packageCoordinate.lon,
                data.packageCoordinate.lat,
              ]}
              animationMode="flyTo"
              animationDuration={0}
            />
            <MapboxGL.PointAnnotation
              key="pointAnnotation"
              id="pointAnnotation"
              coordinate={[
                data.packageCoordinate.lon,
                data.packageCoordinate.lat,
              ]}
            >
              <View>
                <MaterialIcons name="location-pin" size={45} color="black" />
              </View>
            </MapboxGL.PointAnnotation>
          </MapboxGL.MapView>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              position: "absolute",
              bottom: 32,
              right: 32,
              backgroundColor: "#3b82f6",
              height: 56,
              width: 56,
              borderRadius: 56,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              const url = generateMapUrl({
                long: data.packageCoordinate.lon,
                lat: data.packageCoordinate.lat,
              })

              if (url) Linking.openURL(url)
            }}
          >
            <NavigationArrow size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: "100%",
    position: "relative",
  },
  map: {
    flex: 1,
  },
})
