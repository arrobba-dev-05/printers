import PrinterService from "@/services/service_printer";
import { useEffect, useState } from "react";
import { Alert, DeviceEventEmitter, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IBLEPrinter } from "react-native-thermal-receipt-printer";


const printerService = new PrinterService();


export default function Pdv_Printer() {
  const [printer, setPrinter] = useState<IBLEPrinter | undefined>()
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    startConnectPrinterIntern();

    return () => {
      printerService.printerStop();
    };
  }, []);

  function startConnectPrinterIntern() {
    printerService.sendStartConnectionPrinterIntern();
  }

  function actualStatusPrinter() {
    printerService.getStatusSensorPapel();

    let actualEvent = DeviceEventEmitter.addListener(
      'eventStatusPrinter',
      event => {
        let actualReturn = event.statusPrinter;

        if (actualReturn === '5') {
          Alert.alert('Retorno', 'Papel está presente e não está próximo!');
        } else if (actualReturn === '6') {
          Alert.alert('Retorno', 'Papel está próximo do fim!');
        } else if (actualReturn === '7') {
          Alert.alert('Retorno', 'Papel ausente!');
        } else {
          Alert.alert('Retorno', 'Status Desconhecido');
        }
      },
    );

    setTimeout(() => {
      actualEvent.remove();
    }, 2000);
  }

  function handlePrint() {
    const text = `
      LOJA EXEMPLO\n
      -------------------\n
      Produto 1        10,00\n
      Produto 2        15,00\n
      -------------------\n
      Total: 25,00\n
      Obrigado pela preferencia!
    `
    printerService.sendPrinterText(text, "Esquerda", true, false, "FONT A", 10)
    printerService.cutPaper(5)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de impressoras</Text>

      <TouchableOpacity
        style={[styles.item]}
        onPress={actualStatusPrinter}
        disabled={loading}
      >
        <Text style={styles.itemText}>Verificar status</Text>

      </TouchableOpacity>

      <View style={styles.boottom}>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePrint}

        >
          <Text style={styles.text_button}>
            Testar Impressão
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
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