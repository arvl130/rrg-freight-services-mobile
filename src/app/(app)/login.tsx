import { SplashScreen, router } from "expo-router"
import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { getUserRoleRedirectPath, useSession } from "@/components/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signInWithEmailAndPassword } from "@/api/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SignInError } from "@/utils/errors"
import { useSavedSession } from "@/components/saved-session"
import { authenticateAsync } from "expo-local-authentication"
import Ionicons from "@expo/vector-icons/build/Ionicons"

export default function LoginScreen() {
  const queryClient = useQueryClient()
  const savedSession = useSavedSession()
  const [isSigninInWithBiometrics, setIsSigningInWithBiometrics] =
    useState(false)

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

  useEffect(() => {
    if (user) {
      const redirectPath = getUserRoleRedirectPath(user.role)
      router.replace(redirectPath)
    }
  }, [user])

  const isDisabled =
    signInMutation.isPending ||
    signInMutation.isSuccess ||
    savedSession.isLoading ||
    isSigninInWithBiometrics

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
          <View style={styles.fingerPrint}>
            <Ionicons name="finger-print" size={64} color="#78CFDC" />
            <Text style={styles.biometricsDescription}>
              Biometrics Authentication
            </Text>
            <Text style={styles.biometricsSubDescription}>
              log in using your biometric credentials
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {savedSession.savedSession !== null && (
              <Pressable
                style={[styles.loginBtn, { marginTop: 20 }]}
                disabled={isDisabled}
                onPress={async () => {
                  setIsSigningInWithBiometrics(true)
                  if (savedSession.savedSession) {
                    try {
                      const { success } = await authenticateAsync()
                      if (!success) {
                        setIsSigningInWithBiometrics(false)
                        return
                      }

                      await AsyncStorage.setItem(
                        "session",
                        JSON.stringify({
                          session: savedSession.savedSession.session,
                          user: savedSession.savedSession.user,
                        }),
                      )

                      queryClient.setQueryData(["getCurrentUser"], () => {
                        if (savedSession.savedSession) {
                          return {
                            message: "Current user retrieved.",
                            session: savedSession.savedSession.session,
                            user: savedSession.savedSession.user,
                          }
                        }
                      })
                    } catch {
                      setIsSigningInWithBiometrics(false)
                    }
                  }
                }}
              >
                <Text style={styles.btnText}>
                  {isDisabled ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    "Sign In with Biometrics"
                  )}
                </Text>
              </Pressable>
            )}
          </View>
          <Pressable
            style={styles.signInWithEMail}
            onPress={() => {
              router.push("/email-login")
            }}
          >
            <Text style={styles.signInWithEMail}>Sign In with Email</Text>
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
  signInWithEMail: {
    color: "#79CFDC",
    alignItems: "center",
    textDecorationLine: "underline",
    justifyContent: "center",
  },
})
