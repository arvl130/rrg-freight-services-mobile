import { CameraPermissionRequiredView } from "@/components/camera-permission/main-component"
import { CameraView } from "expo-camera/next"
import { useEffect, useRef, useState } from "react"
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Aperture from "phosphor-react-native/src/icons/Aperture"
import CameraRotate from "phosphor-react-native/src/icons/CameraRotate"
import CheckCircle from "phosphor-react-native/src/icons/CheckCircle"
import ArrowClockwise from "phosphor-react-native/src/icons/ArrowClockwise"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { resendOtp } from "@/api/shipment-package-otp"
import { router, useLocalSearchParams } from "expo-router"
import { updatePackageStatusToDelivered } from "@/api/package"
import storage from "@react-native-firebase/storage"
import { REGEX_ONE_OR_MORE_DIGITS } from "@/utils/constants"
import { ProgressDialog } from "react-native-simple-dialogs"
import { useCountTimer } from "@/store/store"

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

function ResendOtpButton(props: { shipmentId: number; packageId: string }) {
  const count = useCountTimer((state) => state.timer)
  const resendBtn = useCountTimer((state) => state.isButtonDisabled)
  const disableResendBtn = useCountTimer((state) => state.setDisabled)
  const enableResendBtn = useCountTimer((state) => state.setEnabled)
  const [seconds, setSeconds] = useState(count)
  const resetTimer = useCountTimer((state) => state.reset)

  // const seconds=useRef(180)
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

  useEffect(() => {
    if (resendBtn) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1)
      }, 1000)

      if (seconds <= 0) {
        clearTimeout(timer)
        resetTimer()
        setSeconds(count)
        enableResendBtn()
      }
    }
  })

  return (
    <View
      style={{
        marginTop: 12,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: "#6b7280",
          paddingVertical: 12,
          borderRadius: 8,
          opacity: resendOtpMutation.isPending || resendBtn ? 0.6 : 1,
        }}
        disabled={resendOtpMutation.isPending || resendBtn}
        onPress={() => {
          Alert.alert(
            "Confirm Resend",
            "Are you sure you want to send another OTP to the receiver?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  disableResendBtn()
                  resendOtpMutation.mutate({
                    shipmentId: props.shipmentId,
                    packageId: props.packageId,
                  })
                },
              },
            ],
          )
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontFamily: "Roboto-Medium",
          }}
        >
          Resend Receive Code {resendBtn ? <>in {seconds} seconds</> : <></>}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

function EnterOtpView(props: { pictureUri: string }) {
  const [isUploading, setIsUploading] = useState(false)

  const [otp, setOtp] = useState("")
  const { id, packageId } = useLocalSearchParams<{
    id: string
    packageId: string
  }>()

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
        queryKey: ["getPackageById", packageId],
      })
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
        Enter your OTP to mark this package as delivered.
      </Text>
      <TextInput
        style={{
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ccc",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
        }}
        placeholder="Enter your OTP here ..."
        value={otp}
        onChangeText={(text) => setOtp(text)}
      />
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
            if (!otp.match(REGEX_ONE_OR_MORE_DIGITS)) {
              Alert.alert("Invalid OTP", "Please enter numbers only.", [
                {
                  text: "OK",
                },
              ])
              return
            }

            setIsUploading(true)
            const ref = storage().ref(`proof-of-delivery/${packageId}`)

            await ref.putFile(props.pictureUri)
            const downloadUrl = await ref.getDownloadURL()

            mutate({
              shipmentId: Number(id),
              packageId,
              imageUrl: downloadUrl,
              code: Number(otp),
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
            Mark as Delivered
          </Text>
        </TouchableOpacity>
      </View>
      <ResendOtpButton shipmentId={Number(id)} packageId={packageId} />

      <ProgressDialog
        title="Loading..."
        activityIndicatorColor="#3498db"
        visible={isUploading || isPending}
        activityIndicatorSize="large"
        animationType="fade"
        message="please wait..."
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

export function MarkAsDeliveredPage() {
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
              <EnterOtpView pictureUri={pictureUri} />
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
