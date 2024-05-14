import { Text, TouchableOpacity } from "react-native"
import { useLocationTracker } from "@/components/location-tracker"
import { clearStorage, saveId } from "@/utils/storage"
import { useSavedShipment } from "@/components/saved-shipment"

export function StartStopTransfer({ shipmentId }: { shipmentId: number }) {
  const { reload } = useSavedShipment()
  const { isTracking, startTracking, stopTracking } = useLocationTracker()

  if (isTracking)
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "#ef4444",
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 12,
        }}
        activeOpacity={0.6}
        onPress={async () => {
          await clearStorage()
          await reload()
          await stopTracking()
        }}
      >
        <Text
          style={{
            fontFamily: "Roboto-Medium",
            color: "white",
            fontSize: 16,
            paddingHorizontal: 6,
            textAlign: "center",
          }}
        >
          Stop Transfer
        </Text>
      </TouchableOpacity>
    )

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        borderRadius: 6,
        paddingVertical: 12,
        backgroundColor: "#22c55e",
      }}
      activeOpacity={0.6}
      onPress={async () => {
        await saveId({
          id: shipmentId,
          type: "TRANSFER",
        })
        await reload()
        await startTracking()
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
        Start Transfer
      </Text>
    </TouchableOpacity>
  )
}
