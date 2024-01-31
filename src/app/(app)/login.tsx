import auth from "@react-native-firebase/auth"
import { SplashScreen, router } from "expo-router"
import { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  Pressable,
} from "react-native"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import Icon from "react-native-vector-icons/SimpleLineIcons"

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
    <View style={styles.mainScreen}>
      <View style={[styles.imageContainer, styles.shadowProp]}>
        <Image source={require("../../assets/images/logo4.png")} />
      </View>
      <View
        style={styles.form}
        onLayout={() => {
          SplashScreen.hideAsync()
        }}
      >
        <Text style={styles.loginText}>Login</Text>
        <View style={styles.formGroupContainer}>
          <Text>
            <Icon name="envelope" size={25} color="#686868" />
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
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
          <Text>
            <Icon name="lock" size={25} color="#686868" />
          </Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Password"
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
          <Pressable
            style={styles.loginBtn}
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

                    Alert.alert(
                      "Invalid email or password",
                      "Please try again.",
                    )
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
          >
            <Text style={styles.btnText}>
              {isSigningIn ? (
                <EvilIcons name="spinner-3" size={25} color="#78CFDC" />
              ) : (
                "Login"
              )}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  form: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    top: "6%",
    paddingLeft: 30,
    paddingRight: 30,
  },
  loginText: {
    fontSize: 35,
    marginBottom: 40,
    fontWeight: "900",
    letterSpacing: 3,
    color: "#78CFDC",
    textAlign: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#78CFDC",
    height: 250,
    borderBottomStartRadius: 25,
    borderBottomRightRadius: 25,
  },

  formGroupContainer: {
    marginBottom: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginBottom: 4,
  },
  input: {
    paddingLeft: 10,
    width: "100%",
  },
  buttonContainer: {
    marginTop: 4,
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#78CFDC",
    borderStyle: "solid",
    borderWidth: 2,
  },
  btnText: {
    paddingVertical: 10,
    color: "#78CFDC",
  },
  shadowProp: {
    elevation: 20,
    shadowColor: "#171717",
  },
})
