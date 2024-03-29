import {
  getCurrentUserDetails,
  updateCurrentUserDetails,
} from "@/api/user/details"
import { ErrorView } from "@/components/error-view"
import { LoadingView } from "@/components/loading-view"
import type { PublicUser } from "@/server/db/entities"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import toast from "react-hot-toast/headless"
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import type { Control } from "react-hook-form"
import { useController, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Gender } from "@/utils/constants"
import { SUPPORTED_GENDERS } from "@/utils/constants"
import { z } from "zod"
import { router } from "expo-router"
import { useSession } from "@/components/auth"

const formSchema = z.object({
  displayName: z
    .string()
    .min(1, {
      message: "Display name is required.",
    })
    .max(100, {
      message: "Display name is too long.",
    }),
  contactNumber: z
    .string()
    .min(1, {
      message: "Contact number is required.",
    })
    .max(15, {
      message: "Contac number is too long.",
    }),
  emailAddress: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .max(100, {
      message: "Email is too long.",
    })
    .email({
      message: "Email has invalid format.",
    }),
  gender: z.custom<Gender>((val) => SUPPORTED_GENDERS.includes(val as Gender)),
})

type FormSchema = z.infer<typeof formSchema>

function FormInput(props: {
  isReadOnly: boolean
  name: keyof FormSchema
  control: Control<FormSchema>
}) {
  const { field } = useController({
    control: props.control,
    name: props.name,
  })

  return (
    <TextInput
      readOnly={props.isReadOnly}
      value={field.value}
      onChangeText={field.onChange}
      style={{
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#d1d5db",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
      }}
    />
  )
}

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
        >
          {SUPPORTED_GENDERS.map((gender) => (
            <Picker.Item key={gender} label={gender} value={gender} />
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

function UpdateForm(props: { user: PublicUser }) {
  const { reload } = useSession()
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: props.user.displayName,
      contactNumber: props.user.contactNumber,
      emailAddress: props.user.emailAddress,
      gender: props.user.gender,
    },
  })

  const { isPending, mutate } = useMutation({
    mutationFn: updateCurrentUserDetails,
    onSuccess: () => {
      reload()
      router.replace("/driver/settings")
    },
  })

  return (
    <View>
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
        Display Name
      </Text>
      <FormInput isReadOnly={isPending} name="displayName" control={control} />
      {errors.displayName && (
        <FormErrorMessage message={errors.displayName.message} />
      )}

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
        Email Address
      </Text>
      <FormInput isReadOnly={isPending} name="emailAddress" control={control} />
      {errors.emailAddress && (
        <FormErrorMessage message={errors.emailAddress.message} />
      )}

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
        Contact No.
      </Text>
      <FormInput
        isReadOnly={isPending}
        name="contactNumber"
        control={control}
      />
      {errors.contactNumber && (
        <FormErrorMessage message={errors.contactNumber.message} />
      )}

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
        Gender
      </Text>
      <FormSelect isEnabled={!isPending} control={control} name="gender" />
      {errors.gender && <FormErrorMessage message={errors.gender.message} />}

      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: "#3b82f6",
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderRadius: 8,
          marginTop: 16,
          opacity: isPending ? 0.6 : undefined,
        }}
        onPress={handleSubmit((formData) => {
          mutate(formData)
        })}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {isPending ? <ActivityIndicator color="white" /> : "Save"}
        </Text>
      </TouchableOpacity>
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
