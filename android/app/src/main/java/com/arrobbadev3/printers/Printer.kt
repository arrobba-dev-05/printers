package com.arrobbadev3.printers

import android.app.Activity
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import com.elgin.e1.Impressora.Termica
import com.facebook.react.bridge.ReadableMap
import java.io.File

class Printer(activity: Activity) {

    companion object {
        private lateinit var mActivity: Activity
        var isPrinterInternSelected: Boolean = false

        fun printerInternalImpStart(): Int {
            printerStop()
            val result = Termica.AbreConexaoImpressora(6, "M8", "", 0)
            if (result == 0) isPrinterInternSelected = true
            return result
        }

        fun printerExternalImpIpStart(map: ReadableMap): Int {
            printerStop()
            val model = map.getString("printerModel") ?: ""
            val ip = map.getString("ip") ?: ""
            val port = map.getInt("port")

            return try {
                val result = Termica.AbreConexaoImpressora(3, model, ip, port)
                if (result == 0) isPrinterInternSelected = false
                result
            } catch (e: Exception) {
                printerInternalImpStart()
            }
        }

        fun printerExternalImpUsbStart(map: ReadableMap): Int {
            printerStop()
            val model = map.getString("printerModel") ?: ""

            return try {
                val result = Termica.AbreConexaoImpressora(1, model, "USB", 0)
                if (result == 0) isPrinterInternSelected = false
                result
            } catch (e: Exception) {
                printerInternalImpStart()
            }
        }

        fun printerStop() {
            Termica.FechaConexaoImpressora()
        }

        fun avancaLinhas(map: ReadableMap): Int {
            return Termica.AvancaPapel(map.getInt("quant"))
        }

        fun cutPaper(map: ReadableMap): Int {
            return Termica.Corte(map.getInt("quant"))
        }

        fun imprimeTexto(map: ReadableMap): Int {
            val text = map.getString("text") ?: ""
            val align = map.getString("align") ?: "Esquerda"
            val font = map.getString("font") ?: ""
            val fontSize = map.getInt("fontSize")
            val isBold = map.getBoolean("isBold")
            val isUnderline = map.getBoolean("isUnderline")

            val alignValue = when (align) {
                "Centralizado" -> 1
                "Direita" -> 2
                else -> 0
            }

            var styleValue = 0
            if (font == "FONT B") styleValue += 1
            if (isUnderline) styleValue += 2
            if (isBold) styleValue += 8

            return Termica.ImpressaoTexto(text, alignValue, styleValue, fontSize)
        }

        private fun codeOfBarCode(barCodeName: String?): Int =
            when (barCodeName) {
                "UPC-A" -> 0
                "UPC-E" -> 1
                "EAN 13", "JAN 13" -> 2
                "EAN 8", "JAN 8" -> 3
                "CODE 39" -> 4
                "ITF" -> 5
                "CODE BAR" -> 6
                "CODE 93" -> 7
                "CODE 128" -> 8
                else -> 0
            }

        fun imprimeBarCode(map: ReadableMap): Int {
            val type = codeOfBarCode(map.getString("barCodeType"))
            val text = map.getString("text") ?: ""
            val height = map.getInt("height")
            val width = map.getInt("width")
            val align = map.getString("align") ?: "Esquerda"

            val alignValue = when (align) {
                "Centralizado" -> 1
                "Direita" -> 2
                else -> 0
            }

            Termica.DefinePosicao(alignValue)
            return Termica.ImpressaoCodigoBarras(type, text, height, width, 4)
        }

        fun imprimeQRCode(map: ReadableMap): Int {
            val size = map.getInt("qrSize")
            val text = map.getString("text") ?: ""
            val align = map.getString("align") ?: "Esquerda"

            val alignValue = when (align) {
                "Centralizado" -> 1
                "Direita" -> 2
                else -> 0
            }

            Termica.DefinePosicao(alignValue)
            return Termica.ImpressaoQRCode(text, size, 2)
        }

        fun imprimeImagem(map: ReadableMap): Int {
            val pathImage = map.getString("pathImage") ?: ""
            val isBase64 = map.getBoolean("isBase64")

            val bitmap: Bitmap = when {
                pathImage == "elgin" -> {
                    val id = mActivity.resources.getIdentifier(
                        pathImage,
                        "drawable",
                        mActivity.packageName
                    )
                    BitmapFactory.decodeResource(mActivity.resources, id)
                }
                isBase64 -> {
                    val decoded = Base64.decode(pathImage, Base64.DEFAULT)
                    BitmapFactory.decodeByteArray(decoded, 0, decoded.size)
                }
                else -> {
                    BitmapFactory.decodeFile(File(pathImage).path)
                }
            }

            return if (isPrinterInternSelected) {
                Termica.ImprimeBitmap(bitmap)
            } else {
                Termica.ImprimeImagem(bitmap)
            }
        }

        fun imprimeXMLNFCe(map: ReadableMap): Int {
            return Termica.ImprimeXMLNFCe(
                map.getString("xmlNFCe"),
                map.getInt("indexcsc"),
                map.getString("csc"),
                map.getInt("param")
            )
        }

        fun imprimeXMLSAT(map: ReadableMap): Int {
            return Termica.ImprimeXMLSAT(
                map.getString("xmlSAT"),
                map.getInt("param")
            )
        }

        fun imprimeCupomTEF(map: ReadableMap): Int {
            return Termica.ImprimeCupomTEF(map.getString("base64"))
        }

        fun statusGaveta(): Int = Termica.StatusImpressora(1)

        fun abrirGaveta(): Int = Termica.AbreGavetaElgin()

        fun statusSensorPapel(): Int = Termica.StatusImpressora(3)
    }

    init {
        mActivity = activity
        Termica.setContext(activity)
    }
}
