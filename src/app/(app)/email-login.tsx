import { SplashScreen, router } from "expo-router"
import { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import EnvelopeSimple from "phosphor-react-native/src/icons/EnvelopeSimple"
import LockSimple from "phosphor-react-native/src/icons/LockSimple"
import { getUserRoleRedirectPath, useSession } from "@/components/auth"
import { useMutation } from "@tanstack/react-query"
import { signInWithEmailAndPassword } from "@/api/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SignInError } from "@/utils/errors"
import { useSavedSession } from "@/components/saved-session"

export default function LoginScreen() {
  const savedSession = useSavedSession()
  const { user, reload } = useSession()
  const signInMutation = useMutation({
    mutationFn: signInWithEmailAndPassword,
    onSuccess: async ({ session, user }) => {
      await AsyncStorage.setItem(
        "session",
        JSON.stringify({
          session,
          user,
        }),
      )

      if (
        savedSession.savedSession !== null &&
        savedSession.savedSession.user.id !== user.id
      ) {
        await savedSession.clear()
      }

      await reload()
    },
    onError: (error) => {
      if (error instanceof SignInError) {
        Alert.alert(
          `Login Failed`,
          `${error.message}${error.canTryAgain ? " Please try again." : ""} (Code: ${error.statusCode})`,
          [
            {
              text: "OK",
            },
          ],
        )
      } else {
        Alert.alert("Login Failed", error.message, [
          {
            text: "OK",
          },
        ])
      }
    },
  })

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (user) {
      const redirectPath = getUserRoleRedirectPath(user.role)
      router.replace(redirectPath)
    }
  }, [user])

  const isDisabled =
    signInMutation.isPending ||
    signInMutation.isSuccess ||
    savedSession.isLoading

  return (
    <View
      style={styles.mainScreen}
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
    >
      <View style={[styles.imageContainer, styles.shadowProp]}>
        <Image source={require("@/assets/images/logo4.png")} />
      </View>
      <KeyboardAwareScrollView style={styles.form}>
        <View
          style={{
            paddingVertical: 32,
          }}
        >
          <Text style={styles.loginText}>Login</Text>
        </View>
        <View style={styles.loginContainer}>
          <View style={{ ...styles.formGroupContainer, marginTop: 0 }}>
            <Text>
              <EnvelopeSimple size={24} color="#686868" />
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
              <LockSimple size={24} color="#686868" />
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
              disabled={isDisabled}
              onPress={() => {
                signInMutation.mutate({
                  email: userCredentials.email,
                  password: userCredentials.password,
                })
              }}
            >
              <Text style={styles.btnText}>
                {isDisabled ? <ActivityIndicator color="#FFFFFF" /> : "Login"}
              </Text>
            </Pressable>
          </View>
          <Pressable
            style={styles.signInWithBiometrics}
            onPress={() => {
              router.push("/login")
            }}
          >
            <Text style={styles.signInWithBiometrics}>
              Sign In with Biometrics
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingLeft: 30,
    paddingRight: 30,
  },
  loginText: {
    fontSize: 32,
    fontFamily: "Roboto-Medium",
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
    marginTop: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
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
    paddingVertical: 20,
  },
  loginBtn: {
    backgroundColor: "#79CFDC",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderColor: "#78CFDC",
    borderStyle: "solid",
    borderWidth: 2,
  },
  btnText: {
    paddingVertical: 10,
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
  },
  shadowProp: {
    elevation: 20,
    shadowColor: "#171717",
  },
  loginContainer: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 25,
  },
  fingerPrint: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  biometricsDescription: {
    fontFamily: "Roboto-Medium",
    fontSize: 18,
    paddingTop: 5,
  },
  biometricsSubDescription: {
    fontFamily: "Roboto-Medium",
    fontSize: 14,
  },
  signInWithBiometrics: {
    color: "#79CFDC",
    alignItems: "center",
    textDecorationLine: "underline",
    justifyContent: "center",
  },
})
