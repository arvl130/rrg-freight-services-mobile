import storage from "@react-native-firebase/storage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Camera, CameraType } from "expo-camera"
import { router, useLocalSearchParams } from "expo-router"
import { useRef, useState } from "react"
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Alert,
  TextInput,
} from "react-native"
import { ScannerView } from "@/components/scanner-view"
import { useBarCodePermissions } from "@/hooks/barcode-scanner"
import { updatePackageStatusToDelivered } from "@/api/package"
import { REGEX_ONE_OR_MORE_DIGITS } from "@/utils/constants"
import { resendOtp } from "@/api/shipment-package-otp"

export default function MarkPackageAsDelivered() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [isUploading, setIsUploading] = useState(false)
  const [otp, setOtp] = useState("")
  const [packageId, setPackageId] = useState<null | string>(null)
  const { isLoading, hasPermission, getPermission } = useBarCodePermissions()

  const [newPicture, setNewPicture] = useState<null | string>(null)
  const cameraRef = useRef<null | Camera>(null)

  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationFn: (props: {
      shipmentId: number
      packageId: string
      imageUrl: string
      code: number
    }) => updatePackageStatusToDelivered(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDeliveryPackages", id],
      })
      queryClient.invalidateQueries({
        queryKey: ["getDelivery", id],
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
    },
    onError: ({ message }) => {
      Alert.alert("Mark as Delivered Failed", message, [
        {
          text: "OK",
        },
      ])
    },
    onSettled: () => setIsUploading(false),
  })

  const resendOtpMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      Alert.alert(
        "OTP Resent",
        "A new OTP has been sent to the receiver's email and contact number.",
        [
          {
            text: "OK",
          },
        ],
      )
    },
    onError: ({ message }) => {
      Alert.alert("OTP Resent Failed", message, [
        {
          text: "OK",
        },
      ])
    },
  })

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
                setPackageId(data)
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
                      disabled={isUploading || isPending}
                      onPress={() => {
                        setNewPicture(null)
                      }}
                    />
                    <View
                      style={{
                        paddingVertical: 8,
                      }}
                    >
                      <Button
                        title="Resend OTP"
                        disabled={
                          resendOtpMutation.isPending ||
                          isUploading ||
                          isPending
                        }
                        onPress={() => {
                          resendOtpMutation.mutate({
                            shipmentId: Number(id),
                            packageId,
                          })
                        }}
                      />
                    </View>
                    <View
                      style={{
                        marginVertical: 12,
                      }}
                    >
                      <TextInput
                        style={{
                          backgroundColor: "white",
                          width: "100%",
                          paddingVertical: 10,
                          paddingLeft: 10,
                          borderRadius: 10,
                        }}
                        placeholder="Enter your OTP here"
                        value={otp}
                        onChangeText={(text) => setOtp(text)}
                      />
                    </View>
                    <Button
                      title="Mark as Delivered"
                      disabled={isUploading || isPending}
                      onPress={async () => {
                        if (!otp.match(REGEX_ONE_OR_MORE_DIGITS)) {
                          Alert.alert(
                            "Invalid OTP",
                            "Please enter numbers only.",
                            [
                              {
                                text: "OK",
                              },
                            ],
                          )
                          return
                        }

                        setIsUploading(true)
                        const ref = storage().ref(
                          `proof-of-delivery/${packageId}`,
                        )

                        await ref.putFile(newPicture)
                        const downloadUrl = await ref.getDownloadURL()

                        mutate({
                          shipmentId: Number(id),
                          packageId,
                          imageUrl: downloadUrl,
                          code: Number(otp),
                        })
                      }}
                    />
                  </View>
                </View>
              )}
            </>
          )}
        </>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              maxWidth: 300,
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: 24,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Scan the QR Code of the package to be Marked as Delivered.
          </Text>
          <Text
            style={{
              color: "white",
              maxWidth: 240,
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: 32,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            For this to work, camera permissions are required.
          </Text>
          <Button
            title="Request Camera Permission"
            disabled={isLoading}
            onPress={() => getPermission()}
          />
        </View>
      )}
    </View>
  )
}
