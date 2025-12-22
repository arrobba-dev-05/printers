package com.arrobbadev3.printers

import android.app.Activity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Promise
// O import abaixo deve apontar para onde sua classe Printer está
import com.arrobbadev3.printers.Printer

class PrinterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // Declaramos a variável printer aqui para que possa ser usada no initPrinter
    private var printerInstance: Printer? = null

    override fun getName(): String = "PrinterModule"

    @ReactMethod
    fun initPrinter() {
        // Acessamos a activity através do reactApplicationContext de forma explícita
        val activity = reactApplicationContext.currentActivity
        
        if (activity != null) {
            printerInstance = Printer(activity)
        } else {
            android.util.Log.e("PrinterModule", "Não foi possível inicializar: currentActivity retornou null.")
        }
    }
    // --- Métodos de Conexão ---

    @ReactMethod
    fun connectInternal(promise: Promise) {
        try {
            promise.resolve(Printer.printerInternalImpStart())
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun connectExternalIp(map: ReadableMap, promise: Promise) {
        try {
            promise.resolve(Printer.printerExternalImpIpStart(map))
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun connectExternalUsb(map: ReadableMap, promise: Promise) {
        try {
            promise.resolve(Printer.printerExternalImpUsbStart(map))
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun stopPrinter() {
        Printer.printerStop()
    }

    // --- Métodos de Impressão ---

    @ReactMethod
    fun printText(map: ReadableMap, promise: Promise) {
        promise.resolve(Printer.imprimeTexto(map))
    }

    @ReactMethod
    fun printBarCode(map: ReadableMap, promise: Promise) {
        promise.resolve(Printer.imprimeBarCode(map))
    }

    @ReactMethod
    fun printQRCode(map: ReadableMap, promise: Promise) {
        promise.resolve(Printer.imprimeQRCode(map))
    }

    @ReactMethod
    fun printImage(map: ReadableMap, promise: Promise) {
        promise.resolve(Printer.imprimeImagem(map))
    }

    // --- Comandos de Papel e Gaveta ---

    @ReactMethod
    fun advanceLines(map: ReadableMap, promise: Promise) {
        promise.resolve(Printer.avancaLinhas(map))
    }

    @ReactMethod
    fun cutPaper(map: ReadableMap, promise: Promise) {
        promise.resolve(Printer.cutPaper(map))
    }

    @ReactMethod
    fun openDrawer(promise: Promise) {
        promise.resolve(Printer.abrirGaveta())
    }

    @ReactMethod
    fun getDrawerStatus(promise: Promise) {
        promise.resolve(Printer.statusGaveta())
    }

    @ReactMethod
    fun getPaperSensorStatus(promise: Promise) {
        promise.resolve(Printer.statusSensorPapel())
    }

    // --- Documentos Fiscais ---

    @ReactMethod
    fun printXMLNFCe(map: ReadableMap, promise: Promise) {
        promise.resolve(Printer.imprimeXMLNFCe(map))
    }

    @ReactMethod
    fun printXMLSAT(map: ReadableMap, promise: Promise) {
        promise.resolve(Printer.imprimeXMLSAT(map))
    }

    @ReactMethod
    fun printCupomTEF(map: ReadableMap, promise: Promise) {
        promise.resolve(Printer.imprimeCupomTEF(map))
    }
}