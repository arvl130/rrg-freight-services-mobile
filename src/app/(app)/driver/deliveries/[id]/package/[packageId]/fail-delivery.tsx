import { zodResolver } from "@hookform/resolvers/zod"
import { useController, useForm } from "react-hook-form"
import type { Control } from "react-hook-form"
import { TouchableOpacity, ActivityIndicator, Text, View } from "react-native"
import { z } from "zod"
import { Picker } from "@react-native-picker/picker"
import { router, useLocalSearchParams } from "expo-router"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import {
  updatePackageStatusToFailedDelivery,
  getPackageById,
} from "@/api/package"
import { useLocationTracker } from "@/components/location-tracker"
import { ErrorView } from "@/components/error-view"
import { LoadingView } from "@/components/loading-view"
import { Feather } from "@expo/vector-icons"

function FormSelect(props: {
  isEnabled: boolean
  name: keyof FormSchema
  control: Control<FormSchema>
}) {
  const { field } = useController({
    control: props.control,
    name: props.name,
  })

  return (
    <View
      style={{
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        overflow: "hidden",
        elevation: 2,
      }}
    >
      <View
        style={{
          opacity: props.isEnabled ? 0.6 : undefined,
        }}
      >
        <Picker
          enabled={props.isEnabled}
          selectedValue={field.value}
          onValueChange={field.onChange}
          style={{
            height: 50,
          }}
        >
          {FAILURE_REASONS.map(({ id, summary, description }) => (
            <Picker.Item key={id} label={summary} value={description} />
          ))}
        </Picker>
      </View>
    </View>
  )
}

function FormErrorMessage(props: { message?: string }) {
  return (
    <Text
      style={{
        fontSize: 16,
        paddingHorizontal: 12,
        fontFamily: "Roboto",
        color: "#ef4444",
      }}
    >
      {props.message}
    </Text>
  )
}

const FAILURE_REASONS = [
  {
    id: 1,
    summary: "Consignee Not on Address",
    description: "Consignee not available at the address provided.",
  },
  {
    id: 2,
    summary: "Incomplete Address",
    description:
      "Failed delivery due to incomplete address. Please verify and provide accurate delivery details.",
  },
  {
    id: 3,
    summary: "Premises Closed",
    description: "Premises closed at the time of delivery attempt.",
  },
  {
    id: 4,
    summary: "Consignee Contact Info Unreachable",
    description:
      "Consignee could not be reached with the provided contact information.",
  },
  {
    id: 5,
    summary: "Inaccessible Location",
    description:
      "Inaccessible delivery location. Please ensure future deliveries can be accessed.",
  },
  {
    id: 6,
    summary: "Consignee Asked to Reschedule",
    description: "Consignee requested re-scheduling of delivery.",
  },
  {
    id: 7,
    summary: "Due to Weather Conditions",
    description:
      "Unable to deliver package due to adverse weather conditions. Delivery will be re-attempted when conditions permit.",
  },
  {
    id: 8,
    summary: "Consignee Refused to Receive",
    description: "Consignee refused acceptance of package.",
  },
  {
    id: 9,
    summary: "Security Access Restrictions",
    description:
      "Failed delivery attempt due to security access restrictions at the delivery location.",
  },
  {
    id: 10,
    summary: "Wrong Address",
    description: "The address provided for the consignee is incorrect.",
  },
  {
    id: 11,
    summary: "Lost Package",
    description: "Package has been lost.",
  },
  {
    id: 12,
    summary: "Consignee Verification Failed",
    description: "Consignee could not be verified.",
  },
]

const formSchema = z.object({
  failureReason: z.string().min(1, {
    message: "Please choose a reason.",
  }),
})

type FormSchema = z.infer<typeof formSchema>

function PackageDetailsPage() {
  const { isLoading } = useLocationTracker()
  const { packageId } = useLocalSearchParams<{
    id: string
    packageId: string
  }>()
  const { status, data, error, refetch } = useQuery({
    queryKey: ["getPackageById", packageId],
    queryFn: () => getPackageById(packageId),
  })

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {isLoading ? (
        <Text>Loading ...</Text>
      ) : (
        <View
          style={{
            flex: 1,
          }}
        >
          {status === "pending" && <LoadingView />}
          {status === "error" && (
            <ErrorView
              message={error.message}
              onRetry={() => {
                refetch()
              }}
            />
          )}
          {status === "success" && (
            <View
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: "#F8F8F8",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  marginHorizontal: 0,
                  shadowColor: "#171717",
                  shadowOffset: { width: -2, height: 4 },
                  shadowOpacity: 0,
                  shadowRadius: 0,
                  elevation: 0,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: 12,
                  }}
                >
                  <Feather
                    name="package"
                    style={{
                      fontSize: 96,
                      marginVertical: 12,
                      color: "black",
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Roboto-Bold",
                      fontSize: 20,
                      color: "black",
                    }}
                  >
                    ID: {data.package.id}
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold",
                      }}
                    >
                      Receiver Name:
                    </Text>{" "}
                    {data.package.receiverFullName}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold",
                      }}
                    >
                      Address:
                    </Text>{" "}
                    {data.package.receiverStreetAddress},{" "}
                    {data.package.receiverBarangay}, {data.package.receiverCity}
                    , {data.package.receiverStateOrProvince},{" "}
                    {data.package.receiverCountryCode}{" "}
                    {data.package.receiverPostalCode}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold",
                      }}
                    >
                      Contact Number:
                    </Text>{" "}
                    {data.package.receiverContactNumber}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Bold",
                      }}
                    >
                      Email:
                    </Text>{" "}
                    {data.package.receiverEmailAddress}
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: "black",
                    marginVertical: 24,
                  }}
                />
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

function UpdateForm() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      failureReason: "Consignee not available at the address provided.",
    },
  })
  const { id, packageId } = useLocalSearchParams<{
    id: string
    packageId: string
  }>()
  const { status, data } = useQuery({
    queryKey: ["getPackageById", packageId],
    queryFn: () => getPackageById(packageId),
  })
  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationFn: async (input: { failureReason: string }) => {
      await updatePackageStatusToFailedDelivery({
        shipmentId: Number(id),
        packageId,
        failureReason: input.failureReason,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDelivery", id],
      })
      queryClient.invalidateQueries({
        queryKey: ["getDeliveryPackages", id],
      })

      router.replace({
        pathname: "/(app)/driver/deliveries/[id]/",
        params: {
          id,
        },
      })
    },
  })

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            fontSize: 16,
            paddingTop: 12,
            paddingBottom: 6,
            paddingHorizontal: 12,
            fontFamily: "Roboto-Medium",
            color: "#374151",
          }}
        >
          Failed Delivery Attempts:
        </Text>
        <View style={{ marginLeft: 170 }}>
          <Text
            style={{
              color: "#949494",
              fontSize: 16,
              paddingTop: 12,
              paddingBottom: 6,
              paddingHorizontal: 12,
              fontFamily: "Roboto-Medium",
            }}
          >
            {status === "pending" && "..."}
            {status === "error" && "error"}
            {status === "success" && `${data.package.failedAttempts} / 2`}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: 16,
          paddingTop: 12,
          paddingBottom: 6,
          paddingHorizontal: 12,
          fontFamily: "Roboto-Medium",
          color: "#374151",
        }}
      >
        Please choose a reason for delivery failure:
      </Text>
      <FormSelect
        isEnabled={!isPending}
        control={control}
        name="failureReason"
      />
      {errors.failureReason && (
        <FormErrorMessage message={errors.failureReason.message} />
      )}

      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: "#79CFDC",
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderRadius: 8,
          marginTop: 16,
          opacity: isPending ? 0.6 : undefined,
        }}
        onPress={handleSubmit((formData) => mutate(formData))}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            "Mark as Failed Delivery"
          )}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default function Page() {
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
    >
      <PackageDetailsPage />
      <UpdateForm />
    </View>
  )
}
