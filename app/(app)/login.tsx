import auth from "@react-native-firebase/auth"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, Button, TextInput, StyleSheet } from "react-native"

import { getUserRoleRedirectPath, useSession } from "../../components/auth"

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
    <View style={styles.form}>
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
            setIsSigningIn(true)
            try {
              await auth().signInWithEmailAndPassword(
                userCredentials.email,
                userCredentials.password,
              )
            } catch (e) {
              console.log("Error occured", e)
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
