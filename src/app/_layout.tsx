import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Tipos de impressoras"
        }}
      />
      <Stack.Screen
        name="bluetooth/ble_printer"
        options={{
          title: "Impressora Bluetooth"
        }}
      />
      <Stack.Screen
        name="usb/usb_printer"
        options={{
          title: "Impressora USB"
        }}
      />
      <Stack.Screen
        name="net/net_printer"
        options={{
          title: "Impressora em Rede"
        }}
      />
      <Stack.Screen
        name="pdv/pdv_printer"
        options={{
          title: "Impressora PDV"
        }}
      />
    </Stack>
  )
}