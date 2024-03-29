import { useMutation } from "@tanstack/react-query"
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import type { Control } from "react-hook-form"
import { useController, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { router } from "expo-router"
import { updateCurrentUserPassword } from "@/api/user/password"
import { useEffect } from "react"
import toast from "react-hot-toast/headless"
import XCircle from "phosphor-react-native/src/icons/XCircle"

const formSchema = z.object({
  currentPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(4096),
  newPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(4096),
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
      secureTextEntry
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

function UpdateForm() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      currentPassword: "",
    },
  })

  const { isPending, mutate, error } = useMutation({
    mutationFn: updateCurrentUserPassword,
    onSuccess: () => {
      router.replace("/driver/settings")
    },
  })

  useEffect(() => {
    if (error)
      toast.error(error.message, {
        icon: <XCircle color="#ef4444" weight="fill" />,
      })
  }, [error])

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
        Current Password
      </Text>
      <FormInput
        isReadOnly={isPending}
        name="currentPassword"
        control={control}
      />
      {errors.currentPassword && (
        <FormErrorMessage message={errors.currentPassword.message} />
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
        New Password
      </Text>
      <FormInput isReadOnly={isPending} name="newPassword" control={control} />
      {errors.newPassword && (
        <FormErrorMessage message={errors.newPassword.message} />
      )}

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
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 12,
      }}
    >
      <UpdateForm />
    </View>
  )
}
