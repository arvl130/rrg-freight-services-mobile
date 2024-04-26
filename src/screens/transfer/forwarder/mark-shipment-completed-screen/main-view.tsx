import { CameraPermissionRequiredView } from "@/components/camera-permission/main-component"
import { CameraView } from "expo-camera/next"
import { useRef, useState } from "react"
import { Alert, Image, Text, TouchableOpacity, View } from "react-native"
import Aperture from "phosphor-react-native/src/icons/Aperture"
import CameraRotate from "phosphor-react-native/src/icons/CameraRotate"
import CheckCircle from "phosphor-react-native/src/icons/CheckCircle"
import ArrowClockwise from "phosphor-react-native/src/icons/ArrowClockwise"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { router, useLocalSearchParams } from "expo-router"
import { updateForwarderTransferShipmentStatusToCompleted } from "@/api/shipment/transfer/fowarder"
import storage from "@react-native-firebase/storage"
import { ProgressDialog } from "react-native-simple-dialogs"
import { useLocationTracker } from "@/components/location-tracker"
import { useSavedShipment } from "@/components/saved-shipment"
import { clearStorage } from "@/utils/storage"

function TakePictureView(props: {
  onPictureTaken: (newPictureUri: string) => void
}) {
  const [isTakingPicture, setIsTakingPicture] = useState(false)
  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(false)
  const cameraRef = useRef<null | CameraView>(null)

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <CameraView
        ref={cameraRef}
        style={{
          flex: 1,
          position: "relative",
        }}
        facing={isUsingFrontCamera ? "front" : "back"}
      >
        <TouchableOpacity
          activeOpacity={0.4}
          disabled={isTakingPicture}
          onPress={async () => {
            setIsTakingPicture(true)
            try {
              const newPicture = await cameraRef.current?.takePictureAsync()
              if (newPicture) props.onPictureTaken(newPicture.uri)
            } catch {
              setIsTakingPicture(false)
            }
          }}
          style={{
            position: "absolute",
            bottom: 24,
            alignSelf: "center",
            opacity: isTakingPicture ? 0.4 : 1,
          }}
        >
          <View
            style={{
              padding: 6,
              borderRadius: 50,
              backgroundColor: "white",
            }}
          >
            <Aperture size={32} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsUsingFrontCamera((prev) => !prev)
          }}
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
          }}
        >
          <View
            style={{
              padding: 6,
              borderRadius: 50,
              backgroundColor: "white",
            }}
          >
            <CameraRotate size={32} />
          </View>
        </TouchableOpacity>
      </CameraView>
    </View>
  )
}

function ReviewPictureView(props: {
  pictureUri: string
  onRetry: () => void
  onAccept: () => void
}) {
  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <Image
        style={{
          flex: 1,
        }}
        source={{
          uri: props.pictureUri,
        }}
      />

      <TouchableOpacity
        onPress={props.onRetry}
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
        }}
      >
        <View
          style={{
            padding: 6,
            borderRadius: 50,
            backgroundColor: "#ef4444",
          }}
        >
          <ArrowClockwise size={32} color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={props.onAccept}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
        }}
      >
        <View
          style={{
            padding: 6,
            borderRadius: 50,
            backgroundColor: "#22c55e",
          }}
        >
          <CheckCircle size={32} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  )
}

function ConfirmView(props: { pictureUri: string }) {
  const { reload } = useSavedShipment()
  const { isTracking, stopTracking } = useLocationTracker()
  const [isUploading, setIsUploading] = useState(false)

  const { id, packageId } = useLocalSearchParams<{
    id: string
    packageId: string
  }>()

  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationFn: async (options: {
      transferShipmentId: number
      imageUrl: string
    }) => {
      if (isTracking) {
        await stopTracking()
        await clearStorage()
        await reload()
      }
      await updateForwarderTransferShipmentStatusToCompleted(options)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getForwarderTransferShipmentsByStatus"],
      })
      queryClient.invalidateQueries({
        queryKey: ["getForwarderTransferShipmentPackages", id],
      })
      queryClient.invalidateQueries({
        queryKey: ["getForwarderTransferShipment", id],
      })

      Alert.alert(
        "Status Updated",
        "The shipment status has been successfully updated.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      )
    },
    onError: ({ message }) => {
      Alert.alert("Mark as Completed Failed", message, [
        {
          text: "OK",
        },
      ])
    },
    onSettled: () => setIsUploading(false),
  })

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <Text
        style={{
          marginBottom: 8,
        }}
      >
        Tap the button below to mark this shipment as completed.
      </Text>

      <View
        style={{
          marginTop: 12,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            backgroundColor: "#3b82f6",
            paddingVertical: 12,
            borderRadius: 8,
            opacity: isUploading || isPending ? 0.6 : 1,
          }}
          disabled={isUploading || isPending}
          onPress={async () => {
            setIsUploading(true)

            const ref = storage().ref(`proof-of-transfer/${packageId}`)
            await ref.putFile(props.pictureUri)
            const downloadUrl = await ref.getDownloadURL()

            mutate({
              transferShipmentId: Number(id),
              imageUrl: downloadUrl,
            })
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Roboto-Medium",
            }}
          >
            Mark as Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ProgressDialog
        title="Loading"
        activityIndicatorColor="#3498db"
        visible={isUploading || isPending}
        activityIndicatorSize="large"
        animationType="fade"
        message="Please wait."
        dialogStyle={{
          borderRadius: 20,
          alignItems: "center",
          maxWidth: 250,
          alignSelf: "center",
          justifyContent: "center",
        }}
      />
    </View>
  )
}

export function MarkAsCompletedPage() {
  const [pictureUri, setPictureUri] = useState<null | string>(null)
  const [isPictureAccepted, setIsPictureAccepted] = useState(false)

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <CameraPermissionRequiredView>
        {pictureUri === null ? (
          <TakePictureView
            onPictureTaken={(newPictureUri) => setPictureUri(newPictureUri)}
          />
        ) : (
          <>
            {isPictureAccepted ? (
              <ConfirmView pictureUri={pictureUri} />
            ) : (
              <ReviewPictureView
                pictureUri={pictureUri}
                onRetry={() => {
                  setPictureUri(null)
                }}
                onAccept={() => {
                  setIsPictureAccepted(true)
                }}
              />
            )}
          </>
        )}
      </CameraPermissionRequiredView>
    </View>
  )
}
