import storage from "@react-native-firebase/storage"
import { getCurrentUserDetails } from "@/api/user/details"
import { ErrorView } from "@/components/error-view"
import { LoadingView } from "@/components/loading-view"
import type { PublicUser } from "@/server/db/entities"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import PhosphorIconUser from "phosphor-react-native/src/icons/User"
import { useEffect, useState } from "react"
import toast from "react-hot-toast/headless"
import { Image, Text, TouchableOpacity, View } from "react-native"
import {
  MediaTypeOptions,
  launchImageLibraryAsync,
  launchCameraAsync,
} from "expo-image-picker"
import {
  removeCurrentUserPhotoUrl,
  updateCurrentUserPhotoUrl,
} from "@/api/user/photo"
import { router } from "expo-router"
import { useSession } from "@/components/auth"
import Warning from "phosphor-react-native/src/icons/Warning"
import CameraSlash from "phosphor-react-native/src/icons/CameraSlash"
import { usePickerCameraPermission } from "@/components/picker-camera-permission"

function UpdateForm(props: { user: PublicUser }) {
  const { permission, requestPermission } = usePickerCameraPermission()
  useEffect(() => {
    if (!permission?.granted) {
      toast.error("Camera is not accessible", {
        icon: <CameraSlash size={16} color="#f3f4f6" weight="fill" />,
      })
    }
  }, [permission])

  const { user, reload } = useSession()
  const [isChoosing, setIsChoosing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [newPhotoUrl, setNewPhotoUrl] = useState<null | string>(null)

  const queryClient = useQueryClient()
  const updatePhotoUrlMutation = useMutation({
    mutationFn: updateCurrentUserPhotoUrl,
    onSuccess: () => {
      reload()
      queryClient.refetchQueries({
        queryKey: ["getCurrentUserDetails"],
      })
      router.replace("/driver/settings")
    },
  })

  const removePhotoUrlMutation = useMutation({
    mutationFn: removeCurrentUserPhotoUrl,
    onSuccess: () => {
      reload()
      queryClient.refetchQueries({
        queryKey: ["getCurrentUserDetails"],
      })
      router.replace("/driver/settings")
    },
  })

  const isDisabled =
    isChoosing ||
    isUploading ||
    updatePhotoUrlMutation.isPending ||
    removePhotoUrlMutation.isPending

  return (
    <View>
      <View
        style={{
          alignItems: "center",
          paddingTop: 24,
        }}
      >
        {newPhotoUrl ? (
          <Image
            style={{
              height: 150,
              width: 150,
              backgroundColor: "#e5e7eb",
              borderRadius: 150 / 2,
            }}
            source={{
              uri: newPhotoUrl,
            }}
          />
        ) : (
          <>
            {props.user.photoUrl ? (
              <Image
                style={{
                  height: 150,
                  width: 150,
                  backgroundColor: "#e5e7eb",
                  borderRadius: 150 / 2,
                }}
                source={{
                  uri: props.user.photoUrl,
                }}
              />
            ) : (
              <View
                style={{
                  height: 150,
                  width: 150,
                  backgroundColor: "#e5e7eb",
                  borderRadius: 150 / 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PhosphorIconUser size={72} color="#6b7280" />
              </View>
            )}
          </>
        )}
      </View>

      {newPhotoUrl ? (
        <View
          style={{
            marginTop: 24,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            disabled={isDisabled}
            style={{
              backgroundColor: "#6b7280",
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: 8,
              marginBottom: 12,
              opacity: isDisabled ? 0.6 : undefined,
            }}
            onPress={() => {
              setNewPhotoUrl(null)
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Roboto-Medium",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Use a different photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            disabled={isDisabled}
            style={{
              backgroundColor: "#3b82f6",
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: 8,
              opacity: isDisabled ? 0.6 : undefined,
            }}
            onPress={async () => {
              if (user) {
                setIsUploading(true)
                try {
                  const ref = storage().ref(`profile-photos/${user.id}`)
                  await ref.putFile(newPhotoUrl)
                  const photoUrl = await ref.getDownloadURL()

                  updatePhotoUrlMutation.mutate({
                    photoUrl,
                  })
                } finally {
                  setIsUploading(false)
                }
              }
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Roboto-Medium",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            marginTop: 24,
          }}
        >
          {props.user.photoUrl && (
            <TouchableOpacity
              activeOpacity={0.6}
              disabled={isDisabled}
              style={{
                backgroundColor: "#ef4444",
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 8,
                marginBottom: 12,
                opacity: isDisabled ? 0.6 : undefined,
              }}
              onPress={() => {
                removePhotoUrlMutation.mutate()
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Roboto-Medium",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Remove Photo
              </Text>
            </TouchableOpacity>
          )}

          <View
            style={{
              flexDirection: "row",
              columnGap: 12,
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              {permission?.granted ? (
                <TouchableOpacity
                  activeOpacity={0.6}
                  disabled={isDisabled}
                  style={{
                    backgroundColor: "#3b82f6",
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    opacity: isDisabled ? 0.6 : undefined,
                  }}
                  onPress={async () => {
                    setIsChoosing(true)
                    try {
                      const { canceled, assets } = await launchCameraAsync({
                        mediaTypes: MediaTypeOptions.Images,
                      })

                      if (canceled) return
                      const [{ uri }] = assets

                      setNewPhotoUrl(uri)
                    } catch (e) {
                      if (e instanceof Error) {
                        toast.error(e.message, {
                          icon: (
                            <Warning size={16} color="#f59e0b" weight="fill" />
                          ),
                        })
                      } else {
                        toast.error("Unknown error occured", {
                          icon: (
                            <Warning size={16} color="#f59e0b" weight="fill" />
                          ),
                        })
                      }
                    } finally {
                      setIsChoosing(false)
                    }
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "Roboto-Medium",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Take Photo
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.6}
                  disabled={isDisabled}
                  style={{
                    backgroundColor: "#6b7280",
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    opacity: isDisabled ? 0.6 : undefined,
                  }}
                  onPress={() => {
                    requestPermission()
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "Roboto-Medium",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Request Camera
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flex: 1,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.6}
                disabled={isDisabled}
                style={{
                  backgroundColor: "#3b82f6",
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  opacity: isDisabled ? 0.6 : undefined,
                }}
                onPress={async () => {
                  setIsChoosing(true)
                  try {
                    const { canceled, assets } = await launchImageLibraryAsync({
                      mediaTypes: MediaTypeOptions.Images,
                    })

                    if (canceled) return
                    const [{ uri }] = assets

                    setNewPhotoUrl(uri)
                  } finally {
                    setIsChoosing(false)
                  }
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Roboto-Medium",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  Choose Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default function Page() {
  const { status, data, error } = useQuery({
    queryKey: ["getCurrentUserDetails"],
    queryFn: () => getCurrentUserDetails(),
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 12,
      }}
    >
      {status === "pending" && <LoadingView />}
      {status === "error" && <ErrorView message={error.message} />}
      {status === "success" && <UpdateForm user={data.user} />}
    </View>
  )
}
