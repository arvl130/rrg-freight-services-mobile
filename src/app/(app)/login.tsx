import auth from "@react-native-firebase/auth"
import { SplashScreen, router } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native"

import { getUserRoleRedirectPath, useSession } from "../../components/auth"

const invalidCredentialsErrorCodes = [
  "auth/invalid-login",
  "auth/invalid-login-credentials",
  "auth/invalid-credential",
  "auth/wrong-password",
  "auth/user-not-found",
]

const FIREBASE_AUTH_ERROR_TOO_MANY_REQUESTS = "auth/too-many-requests"

export default function LoginScreen() {
  const { user, role } = useSession()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (user) {
      const redirectPath = getUserRoleRedirectPath(role)
      router.replace(redirectPath)
    }
  }, [user, role])

  return (
    <View
      style={styles.form}
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
    >
      <View style={styles.formGroupContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userCredentials.email}
          onChangeText={(text) =>
            setUserCredentials((currUserCredentials) => ({
              ...currUserCredentials,
              email: text,
            }))
          }
        />
      </View>
      <View style={styles.formGroupContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          value={userCredentials.password}
          onChangeText={(text) =>
            setUserCredentials((currUserCredentials) => ({
              ...currUserCredentials,
              password: text,
            }))
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={isSigningIn ? "Logging In ..." : "Login"}
          disabled={isSigningIn}
          onPress={async () => {
            if (
              userCredentials.email === "" ||
              userCredentials.password === ""
            ) {
              Alert.alert(
                "Invalid email or password",
                "Please enter your email and password.",
              )

              return
            }

            setIsSigningIn(true)
            try {
              await auth().signInWithEmailAndPassword(
                userCredentials.email,
                userCredentials.password,
              )
            } catch (e) {
              console.log("Error occured while signing in", e)

              // RN Firebase doesn't export types for error handling,
              // so we have to manually check if the error is of an
              // expected type.
              if (
                typeof e === "object" &&
                e !== null &&
                "code" in e &&
                typeof e.code === "string"
              ) {
                if (invalidCredentialsErrorCodes.includes(e.code)) {
                  setUserCredentials((currUserCredentials) => ({
                    ...currUserCredentials,
                    password: "",
                  }))

                  Alert.alert("Invalid email or password", "Please try again.")
                  return
                }

                if (e.code === FIREBASE_AUTH_ERROR_TOO_MANY_REQUESTS) {
                  setUserCredentials((currUserCredentials) => ({
                    ...currUserCredentials,
                    password: "",
                  }))

                  Alert.alert(
                    "Too many requests",
                    "Please try again in a few minutes.",
                  )

                  return
                }
              }
            } finally {
              setIsSigningIn(false)
            }
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  formGroupContainer: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 4,
  },
})
