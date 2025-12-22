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