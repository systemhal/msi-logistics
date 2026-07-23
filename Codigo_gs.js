// ==========================================================================
// WHATSAPP ENTERPRISE CRM — GOOGLE APPS SCRIPT BACKEND ENGINE
// Integración Oficial con Meta Cloud API v20.0 + Google Sheets Database
// Código Senior de Envío y Descarga de Medios + Extracción Completa de Logs
// ==========================================================================

const SPREADSHEET_ID = "1MEeCEmjpnUEFz8zQgz6lcaSHU6uRhHZNl4oCCatmePQ";
const ACCESS_TOKEN = "EAASz43rVNgUBSAbTl8hgBWhe290GQMJ77FrGKGxeLrvYLOopaa3tJH9mSQ1ZAIzqSdDzMAlqM9nIPEXLNZClrngOgjuYM4rNo8C6KdFbESWf9QQJ1W0WWUnQZB3pm16XA3uMQ0gGpxb8ASYG46uA8HwZBYBy4CMUIicPfWNRyQqMxP5RFBsvEWplpTeBUAZDZD";
const PHONE_NUMBER_ID = "1266313029888670";
const TEMPLATE_NAME = "encuesta_new_numero";
const VERIFY_TOKEN = "msi_aduanas_token_seguro_2026";
const CRM_SECRET_PIN = "MSI2026*";

// 🔒 FUNCIÓN DE VALIDACIÓN DE AUTENTICACIÓN (CIBERSEGURIDAD)
function validarAccesoCRM(pinIngresado) {
  if (pinIngresado === CRM_SECRET_PIN) {
    var sessionToken = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, CRM_SECRET_PIN + new Date().toDateString())
                                .map(function(b){ return (b<0?b+256:b).toString(16); }).join('');
    return { autorizado: true, token: sessionToken };
  } else {
    return { autorizado: false, error: "PIN de seguridad incorrecto" };
  }
}

// 🚀 MENÚ PERSONALIZADO EN GOOGLE SHEETS
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 WhatsApp API')
    .addItem('📤 Enviar Encuestas Pendientes', 'enviarEncuestasMasivas')
    .addItem('🖥️ Abrir Panel CRM (Estilo Kommo/Zoho)', 'mostrarUrlCrm')
    .addToUi();
}

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyFKmFLY3GJVgFFyASRfWgdj4RPke7AAtI8HHOo6WoC7NPFq6EPaUWONEwuVFcU0iDY/exec";

function mostrarUrlCrm() {
  const html = `<div style="font-family:sans-serif;padding:10px;text-align:center;">
    <h3 style="color:#00a884;margin-bottom:8px;">🖥️ WhatsApp CRM — MSI ADUANAS</h3>
    <p style="font-size:0.9rem;color:#444;margin-bottom:16px;">Haz clic en el botón para abrir el panel de chats en vivo en una nueva pestaña:</p>
    <a href="${WEB_APP_URL}" target="_blank" style="background:#00a884;color:white;padding:12px 20px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;box-shadow:0 4px 12px rgba(0,168,132,0.3);">🚀 Abrir Panel CRM</a>
  </div>`;
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(420).setHeight(190), "WhatsApp CRM");
}

function enviarEncuestasMasivas() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Envíos");
  if (!sheet) {
    SpreadsheetApp.getUi().alert("❌ No se encontró la pestaña 'Envíos'.");
    return;
  }

  const data = sheet.getDataRange().getValues();
  let enviadosCount = 0;
  let erroresLog = [];

  for (let i = 1; i < data.length; i++) {
    const celdaEstado = sheet.getRange(i + 1, 2);
    const celdaFecha = sheet.getRange(i + 1, 3);
    const estado = String(celdaEstado.getValue()).trim();
    let telefono = cleanPhoneNum(data[i][0]);

    if (!telefono) continue;

    if (estado !== "Enviado") {
      const res = enviarPlantillaEncuesta(telefono);
      if (res.exito) {
        celdaEstado.setValue("Enviado");
        celdaFecha.setValue(new Date());
        registrarTrazabilidad(ss, telefono, "Enviado 📤");
        enviadosCount++;
      } else {
        celdaEstado.setValue("Error ❌");
        erroresLog.push(`Teléfono ${telefono}: ${res.error}`);
        registrarTrazabilidad(ss, telefono, "Fallido ❌ (" + res.error + ")");
      }
    }
  }

  let mensajeFinal = `✅ Proceso finalizado. Se enviaron ${enviadosCount} encuestas por WhatsApp.`;
  if (erroresLog.length > 0) {
    mensajeFinal += `\n\n⚠️ Detalles de errores (${erroresLog.length}):\n` + erroresLog.join("\n");
  }
  SpreadsheetApp.getUi().alert(mensajeFinal);
}

function enviarPlantillaEncuesta(telefono) {
  const cleanPhone = cleanPhoneNum(telefono);
  const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
  
  const payload = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": cleanPhone,
    "type": "template",
    "template": {
      "name": TEMPLATE_NAME,
      "language": { "code": "es" },
      "components": [
        {
          "type": "button",
          "sub_type": "flow",
          "index": "0",
          "parameters": [
            {
              "type": "action",
              "action": {
                "flow_token": "unused"
              }
            }
          ]
        }
      ]
    }
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "headers": { "Authorization": "Bearer " + ACCESS_TOKEN },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const resJson = JSON.parse(response.getContentText());
    if (resJson.messages && resJson.messages[0].id) {
      const msgId = resJson.messages[0].id;
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      let envSheet = ss.getSheetByName("MensajesEnviados");
      if (!envSheet) {
        envSheet = ss.insertSheet("MensajesEnviados");
        envSheet.appendRow(["Fecha y Hora", "Teléfono", "Mensaje", "MsgId"]);
      }
      envSheet.appendRow([new Date(), cleanPhone, "📋 Encuesta de Satisfacción Enviada", msgId]);
      return { exito: true, msgId: msgId };
    } else {
      const errMsg = resJson.error ? (`(#${resJson.error.code}) ${resJson.error.message}`) : "Respuesta desconocida de Meta";
      return { exito: false, error: errMsg };
    }
  } catch (e) {
    return { exito: false, error: e.toString() };
  }
}

function autorizarPermisosDrive() {
  var testFolder = DriveApp.createFolder("CRM_WhatsApp_Test_Drive");
  testFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  DriveApp.getFolderById(testFolder.getId()).setTrashed(true);
  Logger.log("Permisos completos de escritura en Drive autorizados correctamente.");
}

// 1. SERVIR PANEL CRM O ATENDER PETICIONES REST
function doGet(e) {
  var mode = e.parameter ? e.parameter['hub.mode'] : null;
  var token = e.parameter ? e.parameter['hub.verify_token'] : null;
  var challenge = e.parameter ? e.parameter['hub.challenge'] : null;

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    return ContentService.createTextOutput(challenge);
  }

  var action = e.parameter ? e.parameter.action : null;
  
  if (action === "getChats") {
    var chats = obtenerChatsEnVivo();
    var cb = e.parameter.callback;
    if (cb) {
      return ContentService.createTextOutput(cb + "(" + JSON.stringify({chats: chats}) + ")")
                           .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(JSON.stringify({chats: chats}))
                         .setMimeType(ContentService.MimeType.JSON);
  }

  // NUEVO: Para guardar logs desde GitHub Pages / Localhost sin error de CORS
  if (action === "logMessage") {
    var p = e.parameter.phone;
    var msg = e.parameter.msg;
    var msgId = e.parameter.msgId;
    
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var envSheet = ss.getSheetByName("MensajesEnviados");
    if (!envSheet) {
      envSheet = ss.insertSheet("MensajesEnviados");
      envSheet.appendRow(["Fecha y Hora", "Teléfono", "Mensaje", "MsgId"]);
    }
    envSheet.appendRow([new Date(), cleanPhoneNum(p), msg, msgId]);
    registrarTrazabilidad(ss, p, "Respuesta/Archivo Enviado 📤");
    
    var cb = e.parameter.callback;
    if (cb) {
      return ContentService.createTextOutput(cb + "(" + JSON.stringify({exito: true}) + ")")
                           .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(JSON.stringify({exito: true}))
                         .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'updateStage') {
    var phone = e.parameter.phone;
    var stage = e.parameter.stage;
    var resStage = actualizarEtapaCliente(phone, stage);
    return ContentService.createTextOutput(JSON.stringify(resStage))
                         .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'sendMessage') {
    var phoneSend = e.parameter.phone;
    var textSend = e.parameter.text;
    var resSend = enviarRespuestaManual(phoneSend, textSend);
    return ContentService.createTextOutput(JSON.stringify(resSend))
                         .setMimeType(ContentService.MimeType.JSON);
  }

  return HtmlService.createHtmlOutput(getCrmHtml())
                    .setTitle("WhatsApp CRM | MSI ADUANAS")
                    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// 2. WEBHOOK DESDE META
function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    var logSheet = ss.getSheetByName("Logs");
    if (!logSheet) {
      logSheet = ss.insertSheet("Logs");
      logSheet.appendRow(["Fecha y Hora", "JSON Recibido"]);
    }
    logSheet.appendRow([new Date(), rawData]);

    var contents = JSON.parse(rawData);
    if (contents.entry && contents.entry[0].changes) {
      var value = contents.entry[0].changes[0].value;

      if (value && value.statuses && value.statuses.length > 0) {
        var statusObj = value.statuses[0];
        var estadoTexto = "";
        if (statusObj.status === "delivered") estadoTexto = "Entregado 🚚";
        else if (statusObj.status === "read") estadoTexto = "Leído 👁️";
        else if (statusObj.status === "failed") estadoTexto = "Fallido ❌";
        if (estadoTexto !== "") registrarTrazabilidad(ss, statusObj.recipient_id, estadoTexto);
      }

      if (value && value.messages && value.messages.length > 0) {
        var msg = value.messages[0];
        if (msg.type === "interactive" && msg.interactive && msg.interactive.nfm_reply) {
          var phone = cleanPhoneNum(msg.from);
          var responseJson = {};
          try {
            var rawResp = msg.interactive.nfm_reply.response_json;
            responseJson = typeof rawResp === 'string' ? JSON.parse(rawResp) : rawResp;
          } catch(err) {}

          var sheet = ss.getSheetByName("Respuestas");
          if (sheet) {
            sheet.appendRow([
              new Date(), phone,
              responseJson.rapidez_respuesta || "",
              responseJson.conocimiento_tecnico || "",
              responseJson.acompanamiento_operaciones || "",
              responseJson.respaldo_soporte || "",
              responseJson.cambio_ejecutivo || "",
              responseJson.recomendar_msi || ""
            ]);
          }
          registrarTrazabilidad(ss, phone, "Respondido ✅");
        }
      }
    }
  } catch (error) {}
  return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
}

// 3. ENVIAR RESPUESTA MANUAL
function enviarRespuestaManual(telefono, mensajeTexto) {
  var url = "https://graph.facebook.com/v20.0/" + PHONE_NUMBER_ID + "/messages";
  var cleanPhone = cleanPhoneNum(telefono);

  var payload = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": cleanPhone,
    "type": "text",
    "text": { "body": mensajeTexto }
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "headers": { "Authorization": "Bearer " + ACCESS_TOKEN },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var resJson = JSON.parse(response.getContentText());
    if (resJson.messages && resJson.messages[0].id) {
      var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      var envSheet = ss.getSheetByName("MensajesEnviados");
      if (!envSheet) {
        envSheet = ss.insertSheet("MensajesEnviados");
        envSheet.appendRow(["Fecha y Hora", "Teléfono", "Mensaje", "MsgId"]);
      }
      envSheet.appendRow([new Date(), cleanPhone, mensajeTexto, resJson.messages[0].id]);
      registrarTrazabilidad(ss, cleanPhone, "Respuesta Enviada 📤");
      return { exito: true };
    } else {
      return { exito: false, error: resJson.error ? resJson.error.message : "Error Meta" };
    }
  } catch(e) {
    return { exito: false, error: e.toString() };
  }
}

// 3b. SUBIR Y ENVIAR ARCHIVO A META MEDIA API (SIGNATURA EXACTA: telefono, base64Data, fileName, mimeType)
function subirYEnviarArchivo(telefono, base64Data, fileName, mimeType) {
  try {
    var cleanPhone = cleanPhoneNum(telefono);

    if (!mimeType) mimeType = "image/jpeg";
    if (!fileName) fileName = "imagen.jpg";

    var cleanBase64 = String(base64Data).replace(/[^A-Za-z0-9\+\/\=]/g, "");
    var decoded = Utilities.base64Decode(cleanBase64);
    var blob = Utilities.newBlob(decoded, mimeType, fileName);
    blob.setName(fileName);

    var waType = (mimeType && mimeType.indexOf("image/") === 0) ? "image" : "document";

    var urlMedia = "https://graph.facebook.com/v20.0/" + PHONE_NUMBER_ID + "/media";
    var payloadMedia = {
      "messaging_product": "whatsapp",
      "file": blob,
      "type": mimeType
    };

    var optionsMedia = {
      "method": "post",
      "headers": { "Authorization": "Bearer " + ACCESS_TOKEN },
      "payload": payloadMedia,
      "muteHttpExceptions": true
    };

    var resMedia = UrlFetchApp.fetch(urlMedia, optionsMedia);
    var resMediaJson = JSON.parse(resMedia.getContentText());

    if (resMediaJson && resMediaJson.id) {
      var mediaId = resMediaJson.id;
      var urlMsg = "https://graph.facebook.com/v20.0/" + PHONE_NUMBER_ID + "/messages";
      var msgPayload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": cleanPhone,
        "type": waType
      };

      if (waType === "image") {
        msgPayload.image = { "id": mediaId };
      } else {
        msgPayload.document = { "id": mediaId, "filename": fileName };
      }

      var optionsMsg = {
        "method": "post",
        "contentType": "application/json",
        "headers": { "Authorization": "Bearer " + ACCESS_TOKEN },
        "payload": JSON.stringify(msgPayload),
        "muteHttpExceptions": true
      };

      var resMsg = UrlFetchApp.fetch(urlMsg, optionsMsg);
      var resMsgJson = JSON.parse(resMsg.getContentText());

      if (resMsgJson.messages && resMsgJson.messages[0] && resMsgJson.messages[0].id) {
        var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        var envSheet = ss.getSheetByName("MensajesEnviados");
        if (!envSheet) {
          envSheet = ss.insertSheet("MensajesEnviados");
          envSheet.appendRow(["Fecha y Hora", "Teléfono", "Mensaje", "MsgId"]);
        }
        var label = waType === "image" ? "📷 Imagen enviada" : "📎 " + fileName;
        envSheet.appendRow([new Date(), cleanPhone, label, resMsgJson.messages[0].id]);
        registrarTrazabilidad(ss, cleanPhone, "Archivo Enviado 📤");
        return { exito: true };
      } else {
        var errDesc = resMsgJson.error ? ("(#" + resMsgJson.error.code + ") " + resMsgJson.error.message) : "Meta no aceptó el envío del mensaje";
        return { exito: false, error: errDesc };
      }
    } else {
      var errMediaDesc = resMediaJson.error ? ("(#" + resMediaJson.error.code + ") " + resMediaJson.error.message) : "Meta no pudo procesar el archivo subido";
      return { exito: false, error: errMediaDesc };
    }
  } catch(e) {
    return { exito: false, error: e.toString() };
  }
}

// Alias para compatibilidad
function enviarMediaWhatsApp(telefono, base64Data, mimeType, fileName) {
  return subirYEnviarArchivo(telefono, base64Data, fileName, mimeType);
}

// 3c. DESCARGAR MEDIA ENTRANTE (CON CACHÉ DE 6 HORAS)
function obtenerUrlDescargaMedia(mediaId, fileName) {
  if (!mediaId) return null;
  var cacheKey = "MEDIA_URL_" + mediaId;
  var cached = CacheService.getScriptCache().get(cacheKey);
  if (cached) return cached;

  try {
    var res = UrlFetchApp.fetch("https://graph.facebook.com/v20.0/" + mediaId, {
      headers: { "Authorization": "Bearer " + ACCESS_TOKEN },
      muteHttpExceptions: true
    });
    var metaJson = JSON.parse(res.getContentText());
    if (!metaJson || !metaJson.url) return null;

    var fileRes = UrlFetchApp.fetch(metaJson.url, {
      headers: { "Authorization": "Bearer " + ACCESS_TOKEN },
      muteHttpExceptions: true
    });
    var blob = fileRes.getBlob();
    if (fileName) blob.setName(fileName);

    var folders = DriveApp.getFoldersByName("Archivos_Recibidos_WhatsApp");
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder("Archivos_Recibidos_WhatsApp");
    var driveFile = folder.createFile(blob);
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var driveUrl = "https://drive.google.com/uc?export=download&id=" + driveFile.getId();
    CacheService.getScriptCache().put(cacheKey, driveUrl, 21600);
    return driveUrl;
  } catch(e) {
    return null;
  }
}

// LIMPIADOR RIGUROSO DE TELÉFONOS (SENIOR DEV)
function cleanPhoneNum(val) {
  if (!val) return "";
  var s = String(val).trim();
  if (s.indexOf("e") !== -1 || s.indexOf("E") !== -1 || s.indexOf(".") !== -1) {
    var num = Number(val);
    if (!isNaN(num)) s = num.toFixed(0);
  }
  var clean = s.replace(/\D/g, "");
  if (!clean.startsWith("51") && clean.length === 9) clean = "51" + clean;
  return clean;
}

// PARSEADOR INFALIBLE DE FECHAS (SENIOR DEV)
function parseFechaSheet(raw, fallbackTs) {
  if (!raw) {
    var d = fallbackTs ? new Date(fallbackTs) : new Date();
    return { ts: d.getTime(), timeStr: Utilities.formatDate(d, "GMT-5", "HH:mm"), dateStr: Utilities.formatDate(d, "GMT-5", "dd/MM/yyyy"), fullStr: Utilities.formatDate(d, "GMT-5", "dd/MM/yyyy HH:mm") };
  }

  if (raw && typeof raw.getTime === 'function' && !isNaN(raw.getTime())) {
    var ts = raw.getTime();
    return {
      ts: ts,
      timeStr: Utilities.formatDate(raw, "GMT-5", "HH:mm"),
      dateStr: Utilities.formatDate(raw, "GMT-5", "dd/MM/yyyy"),
      fullStr: Utilities.formatDate(raw, "GMT-5", "dd/MM/yyyy HH:mm")
    };
  }

  var str = String(raw).trim();
  var mSp = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (mSp) {
    var day = parseInt(mSp[1], 10);
    var month = parseInt(mSp[2], 10) - 1;
    var year = parseInt(mSp[3], 10);
    var hour = mSp[4] ? parseInt(mSp[4], 10) : 0;
    var min = mSp[5] ? parseInt(mSp[5], 10) : 0;
    var sec = mSp[6] ? parseInt(mSp[6], 10) : 0;
    var dObj = new Date(year, month, day, hour, min, sec);
    if (!isNaN(dObj.getTime())) {
      var ts = dObj.getTime();
      return {
        ts: ts,
        timeStr: Utilities.formatDate(dObj, "GMT-5", "HH:mm"),
        dateStr: Utilities.formatDate(dObj, "GMT-5", "dd/MM/yyyy"),
        fullStr: Utilities.formatDate(dObj, "GMT-5", "dd/MM/yyyy HH:mm")
      };
    }
  }

  var d2 = new Date(str);
  if (d2 && typeof d2.getTime === 'function' && !isNaN(d2.getTime())) {
    var ts = d2.getTime();
    return {
      ts: ts,
      timeStr: Utilities.formatDate(d2, "GMT-5", "HH:mm"),
      dateStr: Utilities.formatDate(d2, "GMT-5", "dd/MM/yyyy"),
      fullStr: Utilities.formatDate(d2, "GMT-5", "dd/MM/yyyy HH:mm")
    };
  }

  var dFallback = fallbackTs ? new Date(fallbackTs) : new Date();
  return { ts: dFallback.getTime(), timeStr: Utilities.formatDate(dFallback, "GMT-5", "HH:mm"), dateStr: Utilities.formatDate(dFallback, "GMT-5", "dd/MM/yyyy"), fullStr: Utilities.formatDate(dFallback, "GMT-5", "dd/MM/yyyy HH:mm") };
}

// 4. OBTENER CHATS EN VIVO (CON LECTURA Y DESCARGA DE IMÁGENES/DOCUMENTOS ENTRANTES)
function obtenerChatsEnVivo() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var chatsMap = {};

  var clientStages = {};
  var crmSheet = ss.getSheetByName("Clientes_CRM");
  if (crmSheet && crmSheet.getLastRow() >= 2) {
    var crmData = crmSheet.getRange(2, 1, crmSheet.getLastRow() - 1, 3).getValues();
    for (var c = 0; c < crmData.length; c++) {
      var ph = cleanPhoneNum(crmData[c][0]);
      if (ph) clientStages[ph] = crmData[c][1] || "Nuevo Lead";
    }
  }

  // --- PASO 1: Leer mensajes ENTRANTES desde Logs ---
  var logSheet = ss.getSheetByName("Logs");
  if (logSheet && logSheet.getLastRow() >= 2) {
    var lastRow = logSheet.getLastRow();
    var logsData = logSheet.getRange(2, 1, (lastRow - 1), 2).getValues();
    for (var i = 0; i < logsData.length; i++) {
      try {
        var rawTime = logsData[i][0];
        if (!rawTime) continue;

        var rawStr = String(logsData[i][1] || "");
        if (!rawStr) continue;

        var parsed = null;
        try { parsed = JSON.parse(rawStr); } catch(err) { parsed = null; }

        var phone = "";
        var name = "";
        var msgObj = null;
        var metaSeconds = null;
        var rowIdx = i + 1;

        if (parsed && parsed.entry && parsed.entry[0] && parsed.entry[0].changes && parsed.entry[0].changes[0].value) {
          var val = parsed.entry[0].changes[0].value;
          if (val.messages && val.messages.length > 0) {
            var msg = val.messages[0];
            phone = cleanPhoneNum(msg.from);
            name = (val.contacts && val.contacts[0] && val.contacts[0].profile) ? val.contacts[0].profile.name : ("Cliente +" + phone);
            if (msg.timestamp) metaSeconds = parseInt(msg.timestamp, 10) * 1000;

            var dtInfo = parseFechaSheet(rawTime, metaSeconds);
            var ts = metaSeconds || dtInfo.ts;
            if (!ts || isNaN(ts) || ts <= 0) ts = 1784700000000 + (rowIdx * 1000);
            var fullStr = dtInfo.fullStr || "00/00/0000 00:00";
            var dateStr = dtInfo.dateStr || "";

            if (msg.type === "text" && msg.text) {
              msgObj = { type: 'inbound', text: msg.text.body, fullStr: fullStr, dateStr: dateStr, ts: ts, rowIdx: rowIdx };
            } else if (msg.type === "document") {
              var fileName = (msg.document && msg.document.filename) ? msg.document.filename : "Archivo PDF";
              var mediaId = msg.document ? msg.document.id : null;
              var mediaUrl = mediaId ? obtenerUrlDescargaMedia(mediaId, fileName) : null;
              msgObj = { type: 'inbound', text: "📎 " + fileName, mediaUrl: mediaUrl, fullStr: fullStr, dateStr: dateStr, ts: ts, rowIdx: rowIdx };
            } else if (msg.type === "image") {
              var mediaId = msg.image ? msg.image.id : null;
              var fileName = "imagen_" + (mediaId || Date.now()) + ".jpg";
              var mediaUrl = mediaId ? obtenerUrlDescargaMedia(mediaId, fileName) : null;
              msgObj = { type: 'inbound', text: "📷 Imagen recibida", mediaUrl: mediaUrl, fullStr: fullStr, dateStr: dateStr, ts: ts, rowIdx: rowIdx };
            } else if (msg.type === "interactive" && msg.interactive) {
              if (msg.interactive.nfm_reply) {
                var resJson = {};
                try {
                  var rawResp = msg.interactive.nfm_reply.response_json;
                  resJson = typeof rawResp === 'string' ? JSON.parse(rawResp) : rawResp;
                } catch(err) {}
                msgObj = {
                  type: 'survey_flow', fullStr: fullStr, dateStr: dateStr, ts: ts, rowIdx: rowIdx,
                  scores: {
                    rapidez: resJson.rapidez_respuesta || '5',
                    conocimiento: resJson.conocimiento_tecnico || '5',
                    acompanamiento: resJson.acompanamiento_operaciones || '5',
                    respaldo: resJson.respaldo_soporte || '5',
                    cambio: resJson.cambio_ejecutivo || 'No',
                    recomendacion: resJson.recomendar_msi || '5'
                  }
                };
              } else if (msg.interactive.button_reply) {
                msgObj = { type: 'inbound', text: msg.interactive.button_reply.title || "Opción seleccionada", fullStr: fullStr, dateStr: dateStr, ts: ts, rowIdx: rowIdx };
              }
            }
          }
        }

        // --- REGEX FALLBACK PARSER ---
        if (!msgObj && rawStr.indexOf("from") !== -1) {
          var mFrom = rawStr.match(/"from"\s*:\s*"(\d+)"/);
          if (mFrom) {
            phone = cleanPhoneNum(mFrom[1]);
            name = "Cliente +" + phone;
            var dtInfo = parseFechaSheet(rawTime);
            var ts = dtInfo.ts || (1784700000000 + (rowIdx * 1000));
            var fullStr = dtInfo.fullStr || "00/00/0000 00:00";
            var dateStr = dtInfo.dateStr || "";

            if (rawStr.indexOf("nfm_reply") !== -1 || rawStr.indexOf("response_json") !== -1) {
              var getScore = function(key) {
                var m = rawStr.match(new RegExp('\\\\?"' + key + '\\\\?"\\s*:\\s*\\\\?"([^\\\\"]+)\\\\?"'));
                return m ? m[1] : "5";
              };
              msgObj = {
                type: 'survey_flow', fullStr: fullStr, dateStr: dateStr, ts: ts, rowIdx: rowIdx,
                scores: {
                  rapidez: getScore("rapidez_respuesta"),
                  conocimiento: getScore("conocimiento_tecnico"),
                  acompanamiento: getScore("acompanamiento_operaciones"),
                  respaldo: getScore("respaldo_soporte"),
                  cambio: getScore("cambio_ejecutivo"),
                  recomendacion: getScore("recomendar_msi")
                }
              };
            } else {
              var mBody = rawStr.match(/"text"\s*:\s*\{\s*"body"\s*:\s*"([^"]+)"\}/) || rawStr.match(/"body"\s*:\s*"([^"]+)"/);
              if (mBody) {
                msgObj = { type: 'inbound', text: mBody[1], fullStr: fullStr, dateStr: dateStr, ts: ts, rowIdx: rowIdx };
              }
            }
          }
        }

        if (phone && msgObj) {
          if (!chatsMap[phone]) {
            chatsMap[phone] = { id: phone, phone: phone, name: name, lastMsg: '', time: msgObj.fullStr, stage: clientStages[phone] || "Nuevo Lead", messages: [] };
          }
          chatsMap[phone].time = msgObj.fullStr;
          if (msgObj.type === 'survey_flow') chatsMap[phone].lastMsg = "📋 Encuesta completada";
          else chatsMap[phone].lastMsg = msgObj.text || "Mensaje recibido";

          chatsMap[phone].messages.push(msgObj);
        }
      } catch(e) {}
    }
  }

  // --- PASO 2: Leer mensajes ENVIADOS desde MensajesEnviados ---
  var envSheet = ss.getSheetByName("MensajesEnviados");
  if (envSheet && envSheet.getLastRow() >= 2) {
    var envLastRow = envSheet.getLastRow();
    var envData = envSheet.getRange(2, 1, (envLastRow - 1), 3).getValues();
    for (var j = 0; j < envData.length; j++) {
      try {
        var envTime = envData[j][0];
        if (!envTime) continue;
        var envDtInfo = parseFechaSheet(envTime);
        var envRowIdx = j + 100000;
        var envTs = envDtInfo.ts || (1784700000000 + (envRowIdx * 1000));

        var envFullStr = envDtInfo.fullStr || "00/00/0000 00:00";
        var envDateStr = envDtInfo.dateStr || "";
        var envPhone = cleanPhoneNum(envData[j][1]);
        if (!envPhone) continue;
        var envText = String(envData[j][2] || "");

        if (!chatsMap[envPhone]) {
          chatsMap[envPhone] = { id: envPhone, phone: envPhone, name: "Cliente +" + envPhone, lastMsg: '', time: envFullStr, stage: clientStages[envPhone] || "Nuevo Lead", messages: [] };
        }
        chatsMap[envPhone].messages.push({ type: 'outbound', text: envText, fullStr: envFullStr, dateStr: envDateStr, ts: envTs, rowIdx: envRowIdx });
        chatsMap[envPhone].lastMsg = "Tú: " + envText;
        chatsMap[envPhone].time = envFullStr;
      } catch(e) {}
    }
  }

  var result = [];
  var phones = Object.keys(chatsMap);
  for (var k = 0; k < phones.length; k++) {
    var chat = chatsMap[phones[k]];
    chat.messages.sort(function(a, b) {
      if (a.ts && b.ts && a.ts !== b.ts) {
        return a.ts - b.ts;
      }
      return (a.rowIdx || 0) - (b.rowIdx || 0);
    });
    result.push(chat);
  }

  result.sort(function(a, b) {
    var lastA = (a.messages && a.messages.length > 0) ? (a.messages[a.messages.length - 1].ts || 0) : 0;
    var lastB = (b.messages && b.messages.length > 0) ? (b.messages[b.messages.length - 1].ts || 0) : 0;
    return lastB - lastA;
  });

  return result;
}

function actualizarEtapaCliente(telefono, nuevaEtapa) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var cleanPhone = cleanPhoneNum(telefono);
  var sheet = ss.getSheetByName("Clientes_CRM");
  if (!sheet) {
    sheet = ss.insertSheet("Clientes_CRM");
    sheet.appendRow(["Teléfono", "Etapa_Kanban", "Fecha_Actualización"]);
  }

  var data = sheet.getDataRange().getValues();
  var encon = false;
  for (var i = 1; i < data.length; i++) {
    if (cleanPhoneNum(data[i][0]) === cleanPhone) {
      sheet.getRange(i + 1, 2).setValue(nuevaEtapa);
      sheet.getRange(i + 1, 3).setValue(new Date());
      encon = true;
      break;
    }
  }

  if (!encon) {
    sheet.appendRow([cleanPhone, nuevaEtapa, new Date()]);
  }
  return { exito: true };
}

function registrarTrazabilidad(ss, telefono, estado) {
  var sheet = ss.getSheetByName("Trazabilidad");
  if (!sheet) {
    sheet = ss.insertSheet("Trazabilidad");
    sheet.appendRow(["Fecha y Hora", "Teléfono del Cliente", "Estado del Mensaje"]);
  }
  sheet.appendRow([new Date(), cleanPhoneNum(telefono), estado]);
}

function getCrmHtml() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>WhatsApp CRM</title></head><body><h1>WhatsApp Enterprise CRM</h1></body></html>`;
}
