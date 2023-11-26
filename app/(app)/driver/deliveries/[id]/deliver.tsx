import storage from "@react-native-firebase/storage"
import { Camera, CameraType } from "expo-camera"
import { router } from "expo-router"
import { useRef, useState } from "react"
import { View, Text, Button, StyleSheet, Image, Alert } from "react-native"

import { ScannerView } from "../../../../../components/scanner-view"
import { useBarCodePermissions } from "../../../../../hooks/barcode-scanner"
import { updatePackageStatusToDelivered } from "../../../../../utils/api"

export default function MarkPackageAsDelivered() {
  const [isUploading, setIsUploading] = useState(false)
  const [packageId, setPackageId] = useState<null | number>(null)
  const { isLoading, hasPermission, getPermission } = useBarCodePermissions()

  const [newPicture, setNewPicture] = useState<null | string>(null)
  const cameraRef = useRef<null | Camera>(null)

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {hasPermission ? (
        <>
          {packageId === null ? (
            <ScannerView
              cancel={() => router.back()}
              onBarCodeScanned={({ data }) => {
                setPackageId(Number(data))
              }}
            />
          ) : (
            <>
              {newPicture === null ? (
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
                    <Camera
                      ref={cameraRef}
                      style={StyleSheet.absoluteFill}
                      type={CameraType.back}
                    />
                  </View>
                  <Button
                    title="Take Picture"
                    onPress={async () => {
                      const newPicture =
                        await cameraRef.current?.takePictureAsync()
                      if (newPicture) setNewPicture(newPicture.uri)
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>Proof of Delivery</Text>
                    <Text>Package ID {packageId}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 12,
                    }}
                  >
                    <Image
                      style={{
                        flex: 1,
                      }}
                      source={{
                        uri: newPicture,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                    }}
                  >
                    <Button
                      title="Try Again"
                      disabled={isUploading}
                      onPress={() => {
                        setNewPicture(null)
                      }}
                    />
                    <Button
                      title="Mark as Delivered"
                      disabled={isUploading}
                      onPress={async () => {
                        setIsUploading(true)
                        try {
                          const ref = storage().ref(
                            `proof-of-delivery/${packageId}`,
                          )
                          await ref.putFile(newPicture)
                          const downloadUrl = await ref.getDownloadURL()
                          await updatePackageStatusToDelivered({
                            packageId,
                            imageUrl: downloadUrl,
                          })

                          Alert.alert(
                            "Status Updated",
                            "The package status has been successfully updated.",
                            [
                              {
                                text: "OK",
                                onPress: () => router.back(),
                              },
                            ],
                          )
                        } finally {
                          setIsUploading(false)
                        }
                      }}
                    />
                  </View>
                </View>
              )}
            </>
          )}
        </>
      ) : (
        <Button
          title="Request Barcode Permission"
          disabled={isLoading}
          onPress={() => getPermission()}
        />
      )}
    </View>
  )
}
