import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Text, TouchableOpacity, View } from "react-native"
import { useLocationTracker } from "@/components/location-tracker"
import { updateDeliveryStatusToCompleted } from "@/api/package"
import type { Package } from "@/server/db/entities"
import type { ShipmentPackageStatus } from "@/utils/constants"

type ShipmentPackage = Package & {
  shipmentPackageStatus: ShipmentPackageStatus
  shipmentPackageIsDriverApproved: boolean
}

export function CompletePackageButton(props: {
  shipmentId: number
  shipmentPackages: ShipmentPackage[]
}) {
  const { isTracking, stopTracking } = useLocationTracker()
  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationKey: ["updateDeliveryStatusToCompleted", props.shipmentId],
    mutationFn: async () => {
      if (isTracking) await stopTracking()
      await updateDeliveryStatusToCompleted(props.shipmentId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDeliveriesByStatus"],
      })
      queryClient.invalidateQueries({
        queryKey: ["getDeliveryPackages", props.shipmentId.toString()],
      })
      queryClient.invalidateQueries({
        queryKey: ["getDelivery", props.shipmentId.toString()],
      })
    },
  })

  return (
    <View
      style={{
        marginTop: 12,
      }}
    >
      <TouchableOpacity
        disabled={isPending}
        activeOpacity={0.6}
        style={{
          backgroundColor: "#16a34a",
          minHeight: 48,
          flexDirection: "row",
          justifyContent: "center",
          columnGap: 4,
          alignItems: "center",
          borderRadius: 8,
          opacity: isPending ? 0.6 : undefined,
        }}
        onPress={() => {
          mutate()
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
          Mark as Completed
        </Text>
      </TouchableOpacity>
    </View>
  )
}
