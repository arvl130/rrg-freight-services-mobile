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
import { getUserRoleRedirectPath, useSession } from "@/components/auth"
import { useMutation } from "@tanstack/react-query"
import { signInWithEmailAndPassword } from "@/api/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function LoginScreen() {
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
      await reload()
    },
    onError: ({ message }) => {
      Alert.alert("Sign In Failed", message, [
        {
          text: "OK",
        },
      ])
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
      <View style={styles.form}>
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
            disabled={signInMutation.isPending}
            onPress={() => {
              signInMutation.mutate({
                email: userCredentials.email,
                password: userCredentials.password,
              })
            }}
          >
            <Text style={styles.btnText}>
              {signInMutation.isPending ? (
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
