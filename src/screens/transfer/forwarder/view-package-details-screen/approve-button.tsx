import { approveWarehouseTransferShipmentPackageById } from "@/api/shipment/transfer/warehouse"
import { AntDesign } from "@expo/vector-icons"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"

export function ApproveButton(props: {
  shipmentId: number
  packageId: string
}) {
  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      await approveWarehouseTransferShipmentPackageById(props)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "getWarehouseTransferShipmentPackages",
          props.shipmentId.toString(),
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          "getWarehouseTransferShipmentPackageById",
          props.shipmentId.toString(),
          props.packageId,
        ],
      })
      router.navigate({
        pathname: "/(app)/driver/transfer/warehouse/[id]/packages/checklist",
        params: {
          id: props.shipmentId,
        },
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
        onPress={() => mutate()}
      >
        <AntDesign name="checksquareo" size={15} color="white" />
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontFamily: "Roboto-Medium",
          }}
        >
          Check
        </Text>
      </TouchableOpacity>
    </View>
  )
}
