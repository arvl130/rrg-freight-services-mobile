import { Button, StyleSheet, Text, View } from "react-native"

import { useLocationTracker } from "../../../utils/location-tracker"

export default function LocationTrackerScreen() {
  const { status, requestPermission, isTracking, startTracking, stopTracking } =
    useLocationTracker()

  return (
    <View style={styles.container}>
      {status === null ? (
        <View>
          <Text>
            To monitor the package delivery, we need access to your location.
          </Text>
          <Button
            title="Grant permission"
            onPress={() => requestPermission()}
          />
        </View>
      ) : (
        <>
          {status.granted ? (
            <View>
              <Text>
                Location tracking: {isTracking ? "active" : "inactive"}
              </Text>
              {isTracking ? (
                <Button title="Stop" onPress={() => stopTracking()} />
              ) : (
                <Button title="Start" onPress={() => startTracking()} />
              )}
            </View>
          ) : (
            <View>
              <Text>Permission was denied.</Text>
              <Button title="Try again" onPress={() => requestPermission()} />
            </View>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
})
