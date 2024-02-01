import { getDeliveryLocations } from "@/api/shipment-location"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { DateTime } from "luxon"
import { ScrollView, Text, View } from "react-native"

export default function ViewDeliveryLocationsPage() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { status, data, error } = useQuery({
    queryKey: ["getDeliveryLocations", id],
    queryFn: () => getDeliveryLocations(Number(id)),
  })

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
      contentContainerStyle={{
        rowGap: 8,
      }}
    >
      {status === "pending" && <Text>Loading ...</Text>}
      {status === "error" && <Text>Error: {error.message}</Text>}
      {status === "success" && (
        <>
          {data.locations.map((location) => (
            <View
              key={location.id}
              style={{
                backgroundColor: "#fb923c",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "600",
                  marginBottom: 4,
                }}
              >
                {location.long}&quot;, {location.lat}&quot;
              </Text>
              <Text
                style={{
                  color: "white",
                }}
              >
                {DateTime.fromISO(location.createdAt).toLocaleString(
                  DateTime.DATETIME_SHORT_WITH_SECONDS,
                )}
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  )
}
