import { Alert, PermissionsAndroid, Platform } from "react-native";
import { BLEPrinter, IBLEPrinter } from "react-native-thermal-receipt-printer";

//Solicita permissòes para impressão
export async function requestPermissions() {
  try {
    // Android 12+ (API 31+)
    if (Platform.OS === "android" && Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      const allGranted = Object.values(result).every(
        (status) => status === PermissionsAndroid.RESULTS.GRANTED
      );
      return allGranted;
    }

    // Android 6 to 11 (API 23–30)
    // if (
    //   Platform.OS === "android" &&
    //   Platform.Version >= 23 &&
    //   Platform.Version <= 30
    // ) {
    //   const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;

    //   const hasPermission = await PermissionsAndroid.check(permission);
    //   if (hasPermission) {
    //     setGranted(true);
    //     return true;
    //   }

    //   const result = await PermissionsAndroid.request(permission);

    //   if (result === PermissionsAndroid.RESULTS.GRANTED) {
    //     setGranted(true);
    //     return true;
    //   }

    //   if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    //     setGranted(false);

    //     Alert.alert(
    //       "Permissão necessária",
    //       "Para localizar impressoras, habilite a permissão de Localização nas configurações do app.",
    //       [
    //         { text: "Cancelar", style: "cancel" },
    //         {
    //           text: "Abrir configurações",
    //           onPress: () => Linking.openSettings(),
    //         },
    //       ]
    //     );

    //     return false;
    //   }

    //   // DENIED
    //   setGranted(false);
    //   return false;
    // }


    // iOS / outros → sempre liberado

    return true;

  } catch (err) {
    Alert.alert("Erro ao solicitar permissões Bluetooth:", String(err))
    return false;
  }
}

//Realiza a conexão com a impressora
export async function connectPrinter(dataPrinter: IBLEPrinter, message: boolean = true): Promise<IBLEPrinter | undefined> {
  try {
    const printer = await BLEPrinter.connectPrinter(dataPrinter.inner_mac_address);
    message && Alert.alert("Sucesso", "Conectado à impressora!");
    return printer
  } catch (error) {
    Alert.alert("Erro", "Não foi possível conectar: " + error);
    return undefined
  }
}