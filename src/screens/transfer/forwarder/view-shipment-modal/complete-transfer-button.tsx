import { Link } from "expo-router"
import { Text, TouchableOpacity } from "react-native"

export function MarkAsTransferredButton(props: { shipmentId: number }) {
  return (
    <Link
      asChild
      href={{
        pathname: "/(app)/driver/transfer/forwarder/[id]/mark-as-completed",
        params: {
          id: props.shipmentId,
        },
      }}
    >
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          borderRadius: 6,
          backgroundColor: "#3b82f6",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 12,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
          }}
        >
          Mark as Transferred
        </Text>
      </TouchableOpacity>
    </Link>
  )
}
