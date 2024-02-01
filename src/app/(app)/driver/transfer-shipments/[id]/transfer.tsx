import { updateTransferShipmentStatusToCompleted } from "@/api/transfer-shipment"
import { useCameraPermissions } from "@/hooks/camera"
import storage from "@react-native-firebase/storage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Camera, CameraType } from "expo-camera"
import { router, useLocalSearchParams } from "expo-router"
import { useRef, useState } from "react"
import { View, Text, Button, StyleSheet, Image, Alert } from "react-native"

export default function MarkTransferShipmentAsTransferred() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [isUploading, setIsUploading] = useState(false)
  const { hasPermission, getPermission, isLoading } = useCameraPermissions()
  const [newPicture, setNewPicture] = useState<null | string>(null)
  const cameraRef = useRef<null | Camera>(null)

  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationFn: (props: { imageUrl: string; transferShipmentId: number }) =>
      updateTransferShipmentStatusToCompleted(props),
    onError: (err) => {
      Alert.alert("Status Update Failed", `Error: ${err.message}`, [
        {
          text: "OK",
        },
      ])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTransferShipment", id],
      })
      queryClient.invalidateQueries({
        queryKey: ["getTransferShipmentPackages", id],
      })

      Alert.alert(
        "Status Updated",
        "The transfer shipment status has been successfully updated.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      )
    },
    onSettled: () => setIsUploading(false),
  })

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {hasPermission ? (
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
                  const newPicture = await cameraRef.current?.takePictureAsync()
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
                <Text>Proof of Transfer</Text>
                <Text>Transfer Shipment ID {id}</Text>
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
                  title="Mark as Transferred"
                  disabled={isUploading || isPending}
                  onPress={async () => {
                    setIsUploading(true)

                    const ref = storage().ref(`proof-of-transfer/${id}`)
                    await ref.putFile(newPicture)
                    const downloadUrl = await ref.getDownloadURL()

                    mutate({
                      transferShipmentId: Number(id),
                      imageUrl: downloadUrl,
                    })
                  }}
                />
              </View>
            </View>
          )}
        </>
      ) : (
        <Button
          title="Request Camera Permission"
          disabled={isLoading}
          onPress={() => getPermission()}
        />
      )}
    </View>
  )
}
