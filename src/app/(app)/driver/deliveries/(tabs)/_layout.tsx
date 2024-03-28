import { MaterialTopTabs } from "@/components/material-top-tabs"

export default function Layout() {
  return (
    <MaterialTopTabs>
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: "In Transit",
        }}
      />
      <MaterialTopTabs.Screen
        name="preparing"
        options={{
          title: "Preparing",
        }}
      />
      <MaterialTopTabs.Screen
        name="completed"
        options={{
          title: "Completed",
        }}
      />
    </MaterialTopTabs>
  )
}
