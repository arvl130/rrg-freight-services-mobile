import auth from "@react-native-firebase/auth"
import { router } from "expo-router"
import { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

import { useSession } from "../../../components/auth"

export default function DashboardScreen() {
  useSession({
    required: {
      role: "WAREHOUSE",
    },
  })

  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => router.push("/(app)/warehouse/scanner")}
          >
            <Text style={styles.buttonText}>Package Scanner</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => router.push("/(app)/warehouse/tracker")}
          >
            <Text style={styles.buttonText}>Location Tracker</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.logoutButton}
          disabled={isSigningOut}
          onPress={async () => {
            setIsSigningOut(true)
            try {
              await auth().signOut()
            } finally {
              setIsSigningOut(false)
            }
          }}
        >
          <Text style={styles.buttonText}>
            {isSigningOut ? "Logging Out ..." : "Logout"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 8,
    paddingVertical: 24,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  buttonContainer: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 12,
  },
  logoutButtonContainer: {
    flex: 1,
    marginTop: 8,
  },
})
