import { PRINT_64 } from '@/constants/escpos';
import { connectPrinter, requestPermissions } from '@/functions/handleBlePrinter';
import { useEffect, useState } from 'react';
import { Alert, FlatList, NativeModules, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BLEPrinter, IBLEPrinter } from 'react-native-thermal-receipt-printer';

const RNBLEPrinter = NativeModules.RNBLEPrinter;


export default function Ble_Printer() {
  const [devices, setDevices] = useState<IBLEPrinter[]>([]);
  const [connectedPrinter, setConnectedPrinter] = useState<IBLEPrinter | undefined>(undefined);
  const [printer, setPrinter] = useState<IBLEPrinter | undefined>()
  const [loading, setLoading] = useState(false)

  async function handleSelectPrinter(printer: IBLEPrinter) {
    setLoading(true)
    const newPrinter = await connectPrinter(printer)
    setConnectedPrinter(newPrinter)
    newPrinter && setPrinter(newPrinter)
    setLoading(false)
  }

  useEffect(() => {
    async function init() {
      const response = await requestPermissions();
      if (!response) {
        Alert.alert(
          "Permissões",
          "Permissões Bluetooth necessárias para buscar impressoras."
        );
        return;
      }

      try {
        await BLEPrinter.init();
        const list = await BLEPrinter.getDeviceList();
        setDevices(list);
      } catch (error) {
        Alert.alert("Erro", "Falha ao inicializar impressora BLE: " + error);
      }
    }

    init();
  }, []);

  async function printSample() {
    if (!connectedPrinter) {
      Alert.alert("Erro", "Conecte-se a uma impressora primeiro.");
      return;
    }
    try {
      global.Buffer = global.Buffer || Buffer;

      // const ESCPOS = Buffer.from(PRINT_64).toString("base64")
      RNBLEPrinter.printRawData(PRINT_64, (error: Error) =>
        Alert.alert("Erro", JSON.stringify(error, null, 2))
      );
    } catch (error) {
      Alert.alert("Erro", "Falha ao imprimir: " + error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de impressoras</Text>

      {devices.length === 0 && (
        <View>
          <Text>
            Nenhuma impressora encontrada
          </Text>
        </View>
      )}
      {devices && devices.length > 0 && (
        <FlatList
          style={styles.list}
          data={devices}
          keyExtractor={(item) => item.device_name || item.inner_mac_address}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={[styles.item, connectedPrinter?.inner_mac_address === item.inner_mac_address ? styles.selected : null]}
                onPress={() => handleSelectPrinter(item)}
                disabled={loading}
              >
                <Text style={styles.itemText}>{item.device_name}</Text>
                <Text style={styles.macText}>{item.inner_mac_address}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <View style={styles.boottom}>
        <TouchableOpacity
          style={styles.button}
          onPress={printSample}

        >
          <Text style={styles.text_button}>
            Testar Impressão
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, paddingBottom: 60 },
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