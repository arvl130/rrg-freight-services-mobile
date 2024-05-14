import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Link, router } from "expo-router"
import { Alert, Text, TouchableOpacity, View } from "react-native"
import { getNextPackageToDeliverInDelivery } from "@/api/delivery"
import { getCurrentPositionAsync } from "expo-location"
import type { Package } from "@/server/db/entities"
import type { ShipmentPackageStatus } from "@/utils/constants"

type ShipmentPackage = Package & {
  shipmentPackageStatus: ShipmentPackageStatus
  shipmentPackageIsDriverApproved: boolean
}

export function GoToNearestPackage(props: {
  shipmentId: number
  shipmentPackages: ShipmentPackage[]
  nextToBeDeliveredPackageId: string
}) {
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

  const inTransitPackages = props.shipmentPackages.filter(
    ({ shipmentPackageStatus }) => shipmentPackageStatus === "IN_TRANSIT",
  )

  const nextPackageIsStillInTransit = inTransitPackages.some(
    ({ id }) => id === props.nextToBeDeliveredPackageId,
  )

  if (nextPackageIsStillInTransit)
    return (
      <View>
        <Link
          asChild
          href={{
            pathname:
              "/(app)/driver/deliveries/[id]/package/[packageId]/details",
            params: {
              id: props.shipmentId,
              packageId: props.nextToBeDeliveredPackageId,
            },
          }}
        >
          <TouchableOpacity
            disabled={isPending}
            activeOpacity={0.6}
            style={{
              backgroundColor: "#F17834",
              minHeight: 48,
              justifyContent: "center",
              borderRadius: 8,
              opacity: isPending ? 0.6 : undefined,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontFamily: "Roboto-Medium",
                fontSize: 16,
              }}
            >
              Go To Nearest Package
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    )
  else
    return (
      <View>
        <TouchableOpacity
          disabled={isPending}
          activeOpacity={0.6}
          style={{
            backgroundColor: "#F17834",
            minHeight: 48,
            justifyContent: "center",
            borderRadius: 8,
            opacity: isPending ? 0.6 : undefined,
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
            Find Next Nearest Package
          </Text>
        </TouchableOpacity>
      </View>
    )
}
