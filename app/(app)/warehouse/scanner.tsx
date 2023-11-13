import { MaterialCommunityIcons } from "@expo/vector-icons"
import auth from "@react-native-firebase/auth"
import { Picker } from "@react-native-picker/picker"
import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner"
import { router } from "expo-router"
import { useState } from "react"
import toast from "react-hot-toast/headless"
import { Text, View, StyleSheet, TextInput, Button, Alert } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

import { useBarCodePermissions } from "../../../hooks/barcode-scanner"
import { PackageStatus } from "../../../utils/constants"

function ScannerTab({
  onBarCodeScanned,
  cancel,
}: {
  onBarCodeScanned: BarCodeScannedCallback
  cancel: () => void
}) {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={onBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <Button title="Cancel" onPress={cancel} />
    </View>
  )
}

export default function ScannerScreen() {
  const [isScannerVisible, setIsScannerVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<{
    packageId: string
    status: PackageStatus
  }>({
    status: "DELIVERED",
    packageId: "",
  })

  const {
    isLoading: isLoadingBarCodePermission,
    hasPermission: hasBarCodePermission,
    getPermission: getBarCodePermission,
  } = useBarCodePermissions()

  return (
    <View style={styles.container}>
      {isScannerVisible ? (
        <ScannerTab
          cancel={() => setIsScannerVisible(false)}
          onBarCodeScanned={({ data }) => {
            setIsScannerVisible(false)
            setFormData((currFormData) => ({
              ...currFormData,
              packageId: data,
            }))
          }}
        />
      ) : (
        <View>
          <View style={styles.formGroupContainer}>
            <Text style={styles.label}>Package ID</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              <TextInput
                style={[
                  styles.input,
                  {
                    flex: 1,
                  },
                ]}
                value={formData.packageId}
                onChangeText={(text) =>
                  setFormData((currFormData) => ({
                    ...currFormData,
                    packageId: text,
                  }))
                }
              />
              <View
                style={
                  isLoadingBarCodePermission ? { opacity: 0.2 } : { opacity: 1 }
                }
              >
                <TouchableOpacity
                  disabled={isLoadingBarCodePermission}
                  onPress={async () => {
                    if (!hasBarCodePermission) {
                      await getBarCodePermission()
                      setIsScannerVisible(true)
                    } else setIsScannerVisible(true)
                  }}
                >
                  <MaterialCommunityIcons
                    name="qrcode"
                    size={48}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.formGroupContainer}>
            <Text style={styles.label}>Status</Text>
            <View
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
              }}
            >
              <Picker
                selectedValue={formData.status}
                onValueChange={(newValue) =>
                  setFormData((currFormData) => ({
                    ...currFormData,
                    status: newValue,
                  }))
                }
              >
                <Picker.Item label="Delivered" value="DELIVERED" />
              </Picker>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.button,
                isSubmitting ? { opacity: 0.2 } : { opacity: 1 },
              ]}
              disabled={isSubmitting}
              activeOpacity={0.7}
              onPress={async () => {
                if (formData.packageId === "") {
                  Alert.alert(
                    "Missing package ID",
                    "Please enter or scan a package ID.",
                  )

                  return
                }

                if (isNaN(parseInt(formData.packageId, 10))) {
                  Alert.alert(
                    "Invalid input",
                    "Please enter a valid package ID.",
                  )

                  return
                }

                setIsSubmitting(true)
                try {
                  const { currentUser } = auth()
                  if (!currentUser) {
                    Alert.alert(
                      "Not logged in",
                      "Please login before making this request.",
                    )

                    return
                  }

                  const token = await currentUser.getIdToken()
                  const response = await fetch(
                    `${process.env.EXPO_PUBLIC_API_URL}/package/${formData.packageId}/status`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        status: formData.status,
                      }),
                    },
                  )
                  const responseJson = await response.json()
                  if (!response.ok) {
                    console.log(
                      "An error occured while updating the package status",
                      responseJson,
                    )
                    toast("Update failed", {
                      icon: "⚠️",
                    })
                    return
                  }

                  toast("Update successful", {
                    icon: "✅",
                  })

                  if (router.canGoBack()) router.back()
                  else router.push("/(app)/warehouse/dashboard")
                } catch (e) {
                  console.log(
                    "An error occured while updating the package status",
                    e,
                  )
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
})
