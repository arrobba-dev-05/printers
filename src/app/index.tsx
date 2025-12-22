import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.navigate("/bluetooth/ble_printer")}

      >
        <Text style={styles.text_button}>
          Bluetooth
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.navigate("/net/net_printer")}

      >
        <Text style={styles.text_button}>
          Internet
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.navigate("/usb/usb_printer")}

      >
        <Text style={styles.text_button}>
          USB
        </Text>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 50, gap: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selected: {
    backgroundColor: "#cde1f9",
  },
  itemText: {
    fontSize: 16,
  },
  macText: {
    fontSize: 12,
    color: "#666",
  },
  boottom: {
    width: "100%"
  },
  button: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#1F488A",
    justifyContent: "center",
    alignItems: "center"
  },
  text_button: {
    color: "white",
    fontWeight: "bold"
  },
  list: {
    borderBlockColor: "#FFF5",
    borderRadius: 10
  }
});