import { View, StyleSheet } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { getPackageAddressByPackageId } from "@/api/package"
import { useQuery } from "@tanstack/react-query"
import MapboxGL from "@rnmapbox/maps"
import { MaterialIcons } from "@expo/vector-icons"
import { LoadingView } from "@/components/loading-view"
import { ErrorView } from "@/components/error-view"

MapboxGL.setAccessToken(`${process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY}`)

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
  },
  map: {
    flex: 1,
  },
})
