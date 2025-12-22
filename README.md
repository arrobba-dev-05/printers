# Exemplos para conexão de impressora

## Impressora PDV:

Instruções para utilizar a impressora embutida dos PDV`s. É necessário configurações nos arquivos nativos do android, nesse caso é possível utilizar Bare Workflow da expo.

- Pasta libs: É necessário criar uma pasta libs dentro da pasta android, example `android\app\libs`
- SDK elgin: É necessário copiar os arquivos relacionados ao sdk disponibilizado pela elgin,
`e1-V02.31.03-release.aar` e `minipdvm8-v01.00.00-release.aar`.
- Vincular as libs: Para vincular as libs da elgin deve abrir o arquivo `build.gradle` e adicionar o seguinte bloco:
```js 
repositories {
    flatDir {
        dirs 'libs'
    }
}
```
   Também é necessário adicionar as libs dentro do array de dependencias do mesmo arquivo `build.gradle`, exemplo:

```js

implementation(name: 'e1-V02.31.03-release', ext: 'aar')
implementation(name: 'minipdvm8-v01.00.00-release', ext: 'aar')

```
- Copiar arquivos: Deve copiar os seguintes arquivos para a pasta referente ao seu projeto
`android\app\src\main\java\com\nome-do-usuario\printers`, arquivos necessários: `Printer.kt`, `PrinterModule.kt`, `PrinterPackage.kt`

- Declarar arquivos no MainActivity: Declarar a variável da classe exemplo:

```kotlin
import com.arrobbadev3.printers.Printer;
class MainActivity : ReactActivity() {
   companion object {
    lateinit var printer: Printer
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreenManager.registerOnActivity(this)
    super.onCreate(null)
     MainActivity.printer = Printer(this)
  }

  //Código continua
  
  }

```
- Vincular o package no MainApplication: é preciso vincular o package dentro de do arquivo MainApplication exemplo:

```kotlin 
import com.arrobbadev3.printers.Printer // <-- Importado aqui

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
      this,
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {

              add(PrinterPackage()) // <-- Adicionado aqui
            }

          override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

          override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      }
  )
  }
```
- Exemplo utilização no react native:
``` js
import { NativeModules } from 'react-native';

/**
 * Interface do Native Module baseada no que criamos no Kotlin
 */
interface PrinterModuleType {
  initPrinter(): void;
  connectInternal(): Promise<number>;
  connectExternalIp(params: { printerModel: string; ip: string; port: number }): Promise<number>;
  connectExternalUsb(params: { printerModel: string }): Promise<number>;
  printText(params: {
    text: string;
    align: string;
    isBold: boolean;
    isUnderline: boolean;
    font: string;
    fontSize: number;
  }): Promise<number>;
  printBarCode(params: {
    barCodeType: string;
    text: string;
    height: number;
    width: number;
    align: string;
  }): Promise<number>;
  printQRCode(params: { qrSize: number; text: string; align: string }): Promise<number>;
  printImage(params: { pathImage: string; isBase64: boolean }): Promise<number>;
  advanceLines(params: { quant: number }): Promise<number>;
  cutPaper(params: { quant: number }): Promise<number>;
  openDrawer(): Promise<number>;
  getDrawerStatus(): Promise<number>;
  getPaperSensorStatus(): Promise<number>;
  printXMLNFCe(params: { xmlNFCe: string; indexcsc: number; csc: string; param: number }): Promise<number>;
  printXMLSAT(params: { xmlSAT: string; param: number }): Promise<number>;
  printCupomTEF(params: { base64: string }): Promise<number>;
  stopPrinter(): void;
}

const { PrinterModule } = NativeModules as {
  PrinterModule: PrinterModuleType;
};

type AlignType = 'Esquerda' | 'Centralizado' | 'Direita';

export default class PrinterService {
  /**
   * Inicializa o contexto da impressora no Android. 
   * Deve ser chamado antes de qualquer outra operação.
   */
  init(): void {
    PrinterModule.initPrinter();
  }

  async sendStartConnectionPrinterIntern(): Promise<number> {
    return await PrinterModule.connectInternal();
  }

  async sendStartConnectionPrinterExternIp(
    printerModel: string,
    ip: string,
    port: number
  ): Promise<number> {
    return await PrinterModule.connectExternalIp({ printerModel, ip, port });
  }

  async sendStartConnectionPrinterExternUsb(printerModel: string): Promise<number> {
    return await PrinterModule.connectExternalUsb({ printerModel });
  }

  async sendPrinterText(
    text: string,
    align: AlignType = 'Esquerda',
    isBold: boolean = false,
    isUnderline: boolean = false,
    fontFamily: string = 'FONT A',
    fontSize: number = 20
  ): Promise<number> {
    return await PrinterModule.printText({
      text,
      align,
      isBold,
      isUnderline,
      font: fontFamily,
      fontSize,
    });
  }

  async sendPrinterBarCode(
    barCodeType: string,
    text: string,
    height: number,
    width: number,
    align: AlignType = 'Esquerda'
  ): Promise<number> {
    return await PrinterModule.printBarCode({
      barCodeType,
      text,
      height,
      width,
      align,
    });
  }

  async sendPrinterQrCode(
    qrSize: number,
    text: string,
    align: AlignType = 'Esquerda'
  ): Promise<number> {
    return await PrinterModule.printQRCode({ qrSize, text, align });
  }

  async sendPrinterImage(pathImage: string, isBase64: boolean): Promise<number> {
    return await PrinterModule.printImage({ pathImage, isBase64 });
  }

  async sendPrinterNFCe(
    xmlNFCe: string,
    indexcsc: number,
    csc: string,
    param: number
  ): Promise<number> {
    return await PrinterModule.printXMLNFCe({ xmlNFCe, indexcsc, csc, param });
  }

  async sendPrinterSAT(xmlSAT: string, param: number): Promise<number> {
    return await PrinterModule.printXMLSAT({ xmlSAT, param });
  }

  async sendPrinterCupomTEF(base64: string): Promise<number> {
    return await PrinterModule.printCupomTEF({ base64 });
  }

  async getStatusSensorPapel(): Promise<number> {
    return await PrinterModule.getPaperSensorStatus();
  }

  async getStatusGaveta(): Promise<number> {
    return await PrinterModule.getDrawerStatus();
  }

  async sendOpenGaveta(): Promise<number> {
    return await PrinterModule.openDrawer();
  }

  async jumpLine(quant: number): Promise<number> {
    return await PrinterModule.advanceLines({ quant });
  }

  async cutPaper(quant: number): Promise<number> {
    return await PrinterModule.cutPaper({ quant });
  }

  printerStop(): void {
    PrinterModule.stopPrinter();
  }
}

```

## Base para impressoras BLE, Internet ou USB:


Instruções para utilizar impressoras BLE, Internet ou USB. É necessário utilizar a lib `
https://github.com/HeligPfleigh/react-native-thermal-receipt-printer`.

- Configurações no app.json:\

 Adicionar dentro da tag expo

```json
"features": [
   {
      "name": "android.hardware.usb.host",
      "required": true
   }
],
```
Adicionar as permissões android dentro da tag android

```json

"permissions": [
     "android.permission.BLUETOOTH_ADMIN",
     "android.permission.BLUETOOTH_CONNECT",
     "android.permission.BLUETOOTH",
     "android.permission.ACCESS_COARSE_LOCATION",
     "android.permission.ACESS_FINE_LOCATION",
     "android.permission.BLUETOOTH_SCAN",
     "android.permission.BLUETOOTH_ADVERTISE",
     "android.permission.WRITE_EXTERNAL_STORAGE",
     "android.permission.READ_EXTERNAL_STORAGE",
     "android.permission.MANAGE_EXTERNAL_STORAGE",
     "android.permission.BLUETOOTH_ADMIN",
     "android.permission.BLUETOOTH_CONNECT",
     "android.permission.BLUETOOTH",
     "android.permission.ACCESS_COARSE_LOCATION",
     "android.permission.ACESS_FINE_LOCATION",
     "android.permission.BLUETOOTH_SCAN",
     "android.permission.BLUETOOTH_ADVERTISE",
     "android.permission.WRITE_EXTERNAL_STORAGE",
     "android.permission.READ_EXTERNAL_STORAGE",
     "android.permission.MANAGE_EXTERNAL_STORAGE",
     "android.permission.USB_PERMISSION"
],
```