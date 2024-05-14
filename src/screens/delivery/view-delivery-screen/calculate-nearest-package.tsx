import { useMutation, useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import { Alert, Text, TouchableOpacity } from "react-native"
import { getNextPackageToDeliverInDelivery } from "@/api/delivery"
import { getCurrentPositionAsync } from "expo-location"

export function CalculateNearestPackage(props: { shipmentId: number }) {
  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const {
        coords: { longitude, latitude },
      } = await getCurrentPositionAsync()

      return await getNextPackageToDeliverInDelivery({
        shipmentId: props.shipmentId,
        long: longitude,
        lat: latitude,
      })
    },
    onSuccess: ({ packageId }) => {
      queryClient.invalidateQueries({
        queryKey: ["getDelivery", props.shipmentId.toString()],
      })
      queryClient.invalidateQueries({
        queryKey: ["getDeliveryPackages", props.shipmentId.toString()],
      })

      if (packageId) {
        Alert.alert(
          "Next Delivery Set",
          `Package with tracking number ${packageId} has been set as the next delivery.`,
          [
            {
              text: "OK",
              onPress: () => {
                router.navigate({
                  pathname:
                    "/(app)/driver/deliveries/[id]/package/[packageId]/details",
                  params: {
                    id: props.shipmentId,
                    packageId,
                  },
                })
              },
            },
          ],
        )
      } else
        Alert.alert(
          "No More Packages",
          `There are no more packages to deliver.`,
          [
            {
              text: "OK",
            },
          ],
        )
    },
    onError: ({ message }) => {
      Alert.alert("Next Delivery Set Failed", message, [
        {
          text: "OK",
        },
      ])
    },
  })

  return (
    <TouchableOpacity
      disabled={isPending}
      activeOpacity={0.6}
      style={{
        backgroundColor: "#F17834",
        minHeight: 48,
        justifyContent: "center",
        borderRadius: 8,
        opacity: isPending ? 0.6 : undefined,
        paddingHorizontal: 12,
        paddingVertical: 12,
      }}
      onPress={() => mutate()}
    >
      <Text
        style={{
          color: "white",
          textAlign: "center",
          fontFamily: "Roboto-Medium",
          fontSize: 16,
        }}
      >
        Find Nearest Package
      </Text>
    </TouchableOpacity>
  )
}
