import type { BarCodeScannedCallback } from "expo-barcode-scanner"
import { BarCodeScanner } from "expo-barcode-scanner"
import { Button, StyleSheet, View } from "react-native"

export function ScannerView({
  onBarCodeScanned,
  cancel,
}: {
  onBarCodeScanned: BarCodeScannedCallback
  cancel: () => void
}) {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={onBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <Button title="Cancel" onPress={cancel} />
    </View>
  )
}
