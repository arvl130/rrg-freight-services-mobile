import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner"
import { useState } from "react"
import toast from "react-hot-toast/headless"
import { Text, View, StyleSheet, TextInput, Button } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

import { useBarCodePermissions } from "../../../utils/barcode-scanner"

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
  const [formData, setFormData] = useState({
    status: "",
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
                <Picker.Item label="Delivering" value="DELIVERING" />
                <Picker.Item label="In Warehouse" value="IN_WAREHOUSE" />
                <Picker.Item label="Shipping" value="SHIPPING" />
              </Picker>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={() => {
                toast("Package Updated", {
                  icon: "✅",
                })
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
