/**
 * API REST GOOGLE APPS SCRIPT PARA MSI LOGISTICS (LIMPIEZA DE COLUMNAS DUMMY Y SEGURO DE CARGA PERFECCIONADO)
 */

const SPREADSHEET_IDS = {
  'registro_servicios': 'ID_GOOGLE_SHEET_REGISTRO_SERVICIOS',
  'base_datos_operativa': 'ID_GOOGLE_SHEET_BASE_DATOS_OPERATIVA',
  'registro_importaciones': 'ID_GOOGLE_SHEET_REGISTRO_IMPORTACIONES'
};

const TIMEZONE = 'America/Lima';

// Opciones exactas para la columna SERVICIO de Clientes - Consignatarios
const CLIENTES_SERVICIO_OPTIONS = [
  'ADUANA Y CARGA',
  'ADUANAS',
  'CARGA',
  'CURRIER',
  'DIRECCIONAMIENTO',
  'OTROS'
];

// Prefijos para Auto-ID en Base Datos Operativa
const ID_PREFIXES = {
  'Clientes - Consignatarios': 'MSI-ID-000',
  'Comerciales - MSI': 'MSI-00',
  'Comerciales Oper. - Logis.': 'COPL-MSI-00',
  'Agentes Carga': 'AG-MSI-00',
  'Operador Logístico': 'OPL-MSI-00',
  'Seguro Carga': 'S-MSI-00',
  'Agencia de Aduana': 'ADU-MSI-00',
  'Emp. Transporte Local': 'ETL-MSI-00',
  'Deposito Aduanero': 'DPA-MSI-00',
  'Almacén Temporal': 'AT-MSI-00',
  'Servicio de Montacarga': 'SM-MSI-00',
  'Almacén Trasegado': 'ALT-MSI-00',
  'Tramite de Mercancia Restringid': 'MR-MSI-00',
  'Servicio Marketing': 'MK-MSI-00',
  'Soporte Tecnico': 'T-MSI-00',
  'Empresa Transporte para Envio P': 'EP-MSI-00',
  'Agente Maritimo - VB': 'AGM-MSI-00',
  'Gate IN': 'GI-MSI-00',
  'Línea Naviera - AVLL': 'LN-MSI-00',
  'Direccionamiento': 'D-MSI-00'
};

function doGet(e) {
  const action = e.parameter.action || 'data';
  let responseData = {};

  try {
    if (action === 'catalog') {
      responseData = { success: true, message: 'API REST activa' };
    } else {
      const spKey = e.parameter.sp || 'registro_servicios';
      const sheetName = e.parameter.sheet || 'Registro Cliente';
      const page = parseInt(e.parameter.page || 1);
      const pageSize = parseInt(e.parameter.pageSize || 50);
      const search = e.parameter.search || '';

      responseData = getSheetData(spKey, sheetName, page, pageSize, search);
    }
  } catch (err) {
    responseData = { success: false, error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let responseData = {};
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;

    if (action === 'updateCell') {
      responseData = updateCell(contents.sp, contents.sheet, contents.rowNum, contents.colIdx, contents.newValue);
    } else if (action === 'updateRow') {
      responseData = updateRow(contents.sp, contents.sheet, contents.rowNum, contents.data);
    } else if (action === 'addRow') {
      responseData = addRow(contents.sp, contents.sheet, contents.data);
    } else if (action === 'deleteRow') {
      responseData = deleteRow(contents.sp, contents.sheet, contents.rowNum);
    } else {
      responseData = { success: false, message: 'Acción no válida' };
    }
  } catch (err) {
    responseData = { success: false, error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(spKey, sheetName, page, pageSize, searchQuery) {
  const cacheKey = 'DATA_' + spKey + '_' + sheetName.replace(/\s+/g, '_') + '_' + page + '_' + pageSize + '_' + searchQuery.toLowerCase().trim();
  const cache = CacheService.getScriptCache();
  
  if (!searchQuery) {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      try {
        return JSON.parse(cachedData);
      } catch (eCache) {}
    }
  }

  const spId = SPREADSHEET_IDS[spKey];
  if (!spId || spId.includes('ID_GOOGLE_SHEET_')) {
    return { rows: [], columns: [], totalRows: 0, needsConfig: true };
  }

  const ss = SpreadsheetApp.openById(spId);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { rows: [], columns: [], totalRows: 0, error: 'Hoja no encontrada: ' + sheetName };

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  // "Seguro de carga internacional" usa Fila 1; todas las demás usan Fila 4
  const headerRow = (sheetName === 'Seguro de carga internacional') ? 1 : 4;
  const startRow = headerRow + 1;

  if (lastRow < headerRow) return { rows: [], columns: [], totalRows: 0 };

  const headerValues = sheet.getRange(headerRow, 1, 1, lastCol).getValues()[0];
  let columns = [];
  
  for (let c = 0; c < headerValues.length; c++) {
    let label = headerValues[c] ? headerValues[c].toString().trim() : '';
    if (!label) continue;

    let lUpper = label.toUpperCase();
    
    // FILTRADO DE COLUMNAS DUMMY Y BASURA ("Columna 1", "Column 20", etc.)
    if (lUpper.startsWith('COLUMNA') || lUpper.startsWith('COLUMN')) continue;

    // En Registro Carga, filtrar 'MARCA TEMPORAL', 'COLUMN 20', 'COLUMN 21'
    if (sheetName === 'Registro Carga') {
      if (lUpper.includes('MARCA TEMPORAL') || lUpper === 'COLUMN 20' || lUpper === 'COLUMN 21') continue;
    }

    let isAuto = (lUpper.includes('MARCA TEMPORAL') || lUpper === 'ID' || lUpper === 'CODIGO_CLIENTE');
    let isSelect = false;

    if (!lUpper.includes('DIRECCION')) {
      isSelect = (lUpper.includes('SERVICIO') || lUpper.includes('TIPO') || lUpper.includes('ESTADO') || lUpper.includes('INCOTERM') || lUpper.includes('CARGA LCL') || lUpper.includes('COURRIER') || lUpper.includes('CANAL'));
    }
    
    let opts = [];
    if (sheetName === 'Clientes - Consignatarios' && lUpper === 'SERVICIO') {
      opts = CLIENTES_SERVICIO_OPTIONS;
      isSelect = true;
    }

    columns.push({
      col: c + 1,
      key: 'col_' + (c + 1),
      label: label,
      auto: isAuto,
      editable: !isAuto,
      type: isSelect ? 'select' : 'text',
      options: opts
    });
  }

  if (lastRow < startRow) return { rows: [], columns: columns, totalRows: 0 };

  const numRowsToFetch = lastRow - startRow + 1;
  const dataRange = sheet.getRange(startRow, 1, numRowsToFetch, lastCol).getValues();
  const bgCols = Math.min(lastCol, 10);
  let bgRange = [];
  try {
    bgRange = sheet.getRange(startRow, 1, numRowsToFetch, bgCols).getBackgrounds();
  } catch (eBg) {
    bgRange = [];
  }

  let rows = [];
  const searchLower = searchQuery.toLowerCase().trim();

  for (let i = 0; i < dataRange.length; i++) {
    const rowNum = startRow + i;
    const rowData = dataRange[i];
    let searchStr = '';
    let obj = { _row_num: rowNum };
    let isEmpty = true;

    // Detectar color de fondo pintado en las celdas de la fila en Google Sheets
    var rowBg = '';
    if (bgRange && bgRange[i]) {
      var roBg = bgRange[i][3] ? bgRange[i][3].toString().toLowerCase() : '';
      if (roBg && roBg !== '#ffffff' && roBg !== '#fff' && roBg !== 'white' && roBg !== '#000000') {
        rowBg = roBg;
      } else {
        for (var col = 0; col < bgRange[i].length; col++) {
          var bg = bgRange[i][col] ? bgRange[i][col].toString().toLowerCase() : '';
          if (bg && bg !== '#ffffff' && bg !== '#fff' && bg !== 'white' && bg !== '#000000') {
            rowBg = bg;
            break;
          }
        }
      }
    }

    if (rowBg) {
      if (rowBg === '#c6e0b4' || rowBg === '#dcfce7' || rowBg === '#e2efda' || rowBg === '#a8d08d') {
        obj._sheet_color = 'VERDE';
      } else if (rowBg === '#d9d9d9' || rowBg === '#f1f5f9' || rowBg === '#e7e6e6' || rowBg === '#bfbfbf') {
        obj._sheet_color = 'GRIS';
      } else if (rowBg === '#fcf7e8' || rowBg === '#fef9c3' || rowBg === '#fff2cc' || rowBg === '#ffe699') {
        obj._sheet_color = 'CREMA';
      } else if (rowBg === '#fee2e2' || rowBg === '#fce4d6' || rowBg === '#f8cbad') {
        obj._sheet_color = 'ROJO';
      } else {
        obj._sheet_color = 'CUSTOM';
        obj._custom_hex = rowBg;
      }
    }

    columns.forEach(colMeta => {
      let cIdx = colMeta.col - 1;
      let val = formatVal(rowData[cIdx]);
      if (val !== '') isEmpty = false;
      obj[colMeta.key] = val;
      searchStr += ' ' + val.toString().toLowerCase();
    });

    if (!isEmpty && (!searchLower || searchStr.includes(searchLower))) {
      rows.push(obj);
    }
  }

  const totalRows = rows.length;
  const startIdx = (page - 1) * pageSize;
  const paginated = rows.slice(startIdx, startIdx + pageSize);
  const result = { rows: paginated, columns: columns, totalRows: totalRows, page: page };

  if (!searchQuery && result.rows && result.rows.length > 0) {
    try {
      cache.put(cacheKey, JSON.stringify(result), 35);
    } catch (ePut) {}
  }

  return result;
}

function updateCell(spKey, sheetName, rowNum, colIdx, newValue) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const spId = SPREADSHEET_IDS[spKey];
    const ss = SpreadsheetApp.openById(spId);
    const sheet = ss.getSheetByName(sheetName);

    sheet.getRange(rowNum, colIdx).setValue(newValue);

    // Reflejar sombreado en Google Sheets si cambia estado operativo
    var valUpper = newValue ? newValue.toString().toUpperCase() : '';
    var hexColor = null;
    if (valUpper.includes('SE RETIRO') || valUpper.includes('RETIRO DEL ALMACEN')) {
      hexColor = '#d9d9d9'; // Gris
    } else if (valUpper.includes('CONCLUIDO') || valUpper.includes('DERIVO') || valUpper === 'SI') {
      hexColor = '#c6e0b4'; // Verde
    } else if (valUpper.includes('EN TRAMITE') || valUpper.includes('CONFIRMACION DE ZARPE')) {
      hexColor = '#fcf7e8'; // Crema
    } else if (valUpper.includes('CANCELADO') || valUpper.includes('INCAUTADO')) {
      hexColor = '#fee2e2'; // Rojo
    }

    if (hexColor) {
      var lastCol = sheet.getLastColumn() || 10;
      sheet.getRange(rowNum, 1, 1, lastCol).setBackground(hexColor);
    }

    return { success: true, message: 'Celda actualizada en Google Sheets' };
  } finally {
    lock.releaseLock();
  }
}

function updateRow(spKey, sheetName, rowNum, rowData) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const spId = SPREADSHEET_IDS[spKey];
    const ss = SpreadsheetApp.openById(spId);
    const sheet = ss.getSheetByName(sheetName);

    Object.keys(rowData).forEach(k => {
      if (k.startsWith('col_')) {
        let colIdx = parseInt(k.replace('col_', ''));
        sheet.getRange(rowNum, colIdx).setValue(rowData[k]);
      }
    });

    // Aplicar sombreado de color a toda la fila en Google Sheets
    if (rowData._manual_color) {
      var hexColor = null;
      if (rowData._manual_color === 'VERDE') hexColor = '#c6e0b4';
      else if (rowData._manual_color === 'GRIS') hexColor = '#d9d9d9';
      else if (rowData._manual_color === 'CREMA') hexColor = '#fcf7e8';
      else if (rowData._manual_color === 'ROJO') hexColor = '#fee2e2';
      else if (rowData._manual_color === 'AUTOMATICO') hexColor = '#ffffff';

      if (hexColor) {
        var lastCol = sheet.getLastColumn() || 10;
        sheet.getRange(rowNum, 1, 1, lastCol).setBackground(hexColor);
      }
    }

    return { success: true, message: 'Fila actualizada correctamente' };
  } finally {
    lock.releaseLock();
  }
}

function addRow(spKey, sheetName, rowData) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const spId = SPREADSHEET_IDS[spKey];
    const ss = SpreadsheetApp.openById(spId);
    const sheet = ss.getSheetByName(sheetName);

    if (sheetName === 'Registro Cliente' || sheetName === 'Clientes - Consignatarios') {
      const docColIdx = (sheetName === 'Registro Cliente') ? 6 : 4;
      const newDocVal = (sheetName === 'Registro Cliente') ? (rowData['col_6'] || '') : (rowData['col_4'] || '');

      if (newDocVal) {
        const cleanNewDoc = newDocVal.toString().replace(/[^0-9A-Za-z]/g, '');
        const lastRow = sheet.getLastRow();
        if (lastRow >= 5) {
          const existingDocs = sheet.getRange(5, docColIdx, lastRow - 4, 1).getValues();
          for (let r = 0; r < existingDocs.length; r++) {
            let exDoc = existingDocs[r][0] ? existingDocs[r][0].toString().replace(/[^0-9A-Za-z]/g, '') : '';
            if (exDoc && exDoc === cleanNewDoc) {
              return { 
                success: false, 
                isDuplicate: true, 
                message: '⚠️ ALERTA: El cliente con número de documento (' + newDocVal + ') ya se encuentra registrado.' 
              };
            }
          }
        }
      }
    }

    let maxCol = sheet.getLastColumn() || 10;
    let newRow = new Array(maxCol).fill('');

    Object.keys(rowData).forEach(k => {
      if (k.startsWith('col_')) {
        let idx = parseInt(k.replace('col_', '')) - 1;
        if (idx >= 0 && idx < maxCol) newRow[idx] = rowData[k];
      }
    });

    newRow[0] = new Date();

    if (spKey === 'base_datos_operativa' && ID_PREFIXES[sheetName]) {
      const prefix = ID_PREFIXES[sheetName];
      const nextNum = sheet.getLastRow() - 3;
      if (sheetName === 'Clientes - Consignatarios') {
        newRow[1] = 'MSI-ID-' + (100 + nextNum);
      } else {
        newRow[1] = prefix + nextNum;
      }
    }

    sheet.appendRow(newRow);

    if (rowData._manual_color) {
      var hexColor = null;
      if (rowData._manual_color === 'VERDE') hexColor = '#c6e0b4';
      else if (rowData._manual_color === 'GRIS') hexColor = '#d9d9d9';
      else if (rowData._manual_color === 'CREMA') hexColor = '#fcf7e8';
      else if (rowData._manual_color === 'ROJO') hexColor = '#fee2e2';

      if (hexColor) {
        var addedRowIdx = sheet.getLastRow();
        sheet.getRange(addedRowIdx, 1, 1, maxCol).setBackground(hexColor);
      }
    }

    return { success: true, message: 'Registro agregado con éxito' };
  } finally {
    lock.releaseLock();
  }
}

function deleteRow(spKey, sheetName, rowNum) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const spId = SPREADSHEET_IDS[spKey];
    const ss = SpreadsheetApp.openById(spId);
    const sheet = ss.getSheetByName(sheetName);

    sheet.deleteRow(rowNum);
    return { success: true, message: 'Fila eliminada' };
  } finally {
    lock.releaseLock();
  }
}

function formatVal(val) {
  if (val === null || val === undefined || val === '') return '';
  if (val instanceof Date) return Utilities.formatDate(val, TIMEZONE, 'dd/MM/yyyy HH:mm');
  return val.toString();
}
