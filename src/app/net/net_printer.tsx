import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { INetPrinter, NetPrinter } from "react-native-thermal-receipt-printer";

export default function Net_Printer() {
  const [printers, setPrinters] = useState<INetPrinter[]>([]);
  const [currentPrinter, setCurrentPrinter] = useState<INetPrinter | undefined>(undefined);

  // Inicializa o módulo da impressora
  useEffect(() => {
    NetPrinter.init()
      .then(() => {
        // Lista fixa de impressoras (pode vir de API futuramente)
        setPrinters([
          {
            device_name: "Impressora Caixa",
            host: "192.168.100.250",
            port: 9100,
          },
        ]);
      })
      .catch((error) => {
        console.warn("Erro ao inicializar NetPrinter:", error);
      });
  }, []);

  const connectPrinter = async (host: string, port: number) => {
    try {
      const printer = await NetPrinter.connectPrinter(host, port);
      setCurrentPrinter(printer);
      Alert.alert("Sucesso", "Impressora conectada com sucesso!");
    } catch (error) {
      console.warn(error);
      Alert.alert("Erro", "Não foi possível conectar à impressora");
    }
  };

  const printTextTest = () => {
    if (!currentPrinter) {
      Alert.alert("Aviso", "Conecte uma impressora primeiro");
      return;
    }

    NetPrinter.printText("<C>Teste de impressao</C>\n");
  };

  const printBillTest = () => {
    if (!currentPrinter) {
      Alert.alert("Aviso", "Conecte uma impressora primeiro");
      return;
    }

    NetPrinter.printBill(`
      <C><B>LOJA EXEMPLO</B></C>
      <C>-------------------</C>
      Produto 1        10,00
      Produto 2        15,00
      <C>-------------------</C>
      <R>Total: 25,00</R>
      <C>Obrigado pela preferencia!</C>
    `);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Impressoras disponíveis</Text>

      {printers.map((printer, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => connectPrinter(printer.host, printer.port)}
        >
          <Text style={styles.itemText}>{printer.device_name}</Text>
          <Text style={styles.macText}>
            {printer.host}:{printer.port}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={printTextTest}>
        <Text style={styles.text_button}>Imprimir Texto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={printBillTest}>
        <Text style={styles.text_button}>Imprimir Cupom</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, paddingBottom: 60, gap: 15 },
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
