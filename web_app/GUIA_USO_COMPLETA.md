# 🚀 Guía Completa de Uso - Sistema Web Multi-Spreadsheet MSI Logistics

Bienvenido al sistema web integral de gestión operativa para **MSI Logistics**. Este sistema permite visualizar, editar en celda (inline editing), filtrar y gestionar **3 Google Spreadsheets / archivos Excel** con **27 hojas operativas** divididas en 3 niveles de menú.

---

## 📂 Archivos y Estructura del Sistema

```
10. BaseDatos MSI/
├── run_app.bat                      ← Ejecutable doble-clic para iniciar el servidor
├── Registro de Servicios.xlsx       ← Spreadsheet 1 (4 Hojas)
├── Base Datos Operativa.xlsx        ← Spreadsheet 2 (20 Hojas en 4 subcategorías)
├── Registro Importaciones.xlsx      ← Spreadsheet 3 (3 Hojas)
└── web_app/                         ← Aplicación Web Python + Flask + AG Grid
    ├── app.py                       ← Servidor backend Flask API
    ├── config.py                    ← Configuración de las 27 hojas y subcategorías
    ├── data_manager.py              ← Motor de lectura y escritura en celdas
    ├── static/
    │   ├── css/styles.css           ← Estilos, barra lateral y badges de colores
    │   └── js/app.js                ← Tabla dinámica AG Grid y edición inline
    └── templates/
        └── index.html               ← Interfaz web principal
```

---

## ⚡ Cómo Iniciar la Aplicación

1. **Vía Doble-Clic**:
   - Haz doble clic en el archivo `run_app.bat` ubicado en la carpeta principal `10. BaseDatos MSI`.

2. **Vía Terminal / PowerShell**:
   ```bash
   cd "c:\Users\USUARIO\Documents\Pojects_gravitity\10. BaseDatos MSI\web_app"
   python app.py
   ```

3. **Abrir en el Navegador**:
   - Abre Google Chrome, Edge o Firefox y navega a: **`http://localhost:5000`**

---

## 🗺️ Estructura del Menú Lateral (3 Niveles)

El menú izquierdo incluye los 3 Spreadsheets y sus 27 hojas organizadas así:

- 📊 **Dashboard Overview** (Vista general con contadores y resumen de registros)
- 🚢 **Registro de Servicios (Cuadro de Embarque)**
  - 👤 `Registro Cliente`
  - 📦 `Registro Carga`
  - ✈️ `Registro Courrier`
  - 🛡️ `Seguro de carga internacional`
- 📁 **Base Datos Operativa**
  - 📌 **Informativo**
    - `Clientes - Consignatarios`
    - `Comerciales - MSI`
    - `Comerciales Oper. - Logis.`
  - 📦 **Carga**
    - `Agentes Carga`
    - `Operador Logístico`
    - `Seguro Carga`
  - ⚙️ **Operaciones**
    - `Agencia de Aduana`
    - `Emp. Transporte Local`
    - `Deposito Aduanero`
    - `Almacén Temporal`
    - `Servicio de Montacarga`
    - `Almacén Trasegado`
    - `Tramite de Mercancia Restringid`
  - 🏢 **Proveedores**
    - `Servicio Marketing`
    - `Soporte Tecnico`
    - `Empresa Transporte para Envio P`
    - `Agente Maritimo - VB`
    - `Gate IN`
    - `Línea Naviera - AVLL`
    - `Direccionamiento`
- 🛃 **Registro Importaciones**
  - `Despacho Aduanas`
  - `Registro Ordenes MSI`
  - `Ordenes Mocayas`

---

## ✏️ Características y Funcionalidades

### 1. Edición Directa en Celda (Inline Cell Editing)
- Puedes hacer **doble-clic sobre cualquier celda** de la tabla para modificar su contenido directamente.
- Si la celda es de tipo lista (Ej: *Servicio*, *Tipo Documento*, *Proveedor*, *Estado Actual*, *Incoterm*), se desplegará un menú de selección (*Dropdown*).
- Al presionar **Enter** o hacer clic fuera de la celda, los cambios **se guardan automáticamente** en tiempo real.

### 2. Colores Dinámicos por Valor (Colored Pill Badges)
- Al igual que en tus capturas de pantalla, las celdas con valores clave muestran etiquetas de colores distintivos:
  - 🟢 **Verde**: `CARGA Y ADUANA`, `CONCLUIDO`, `CARGA CULMINADA`, `SI`, `RUC`, `FCL`
  - 🟡 **Amarillo / Naranja**: `CARGA`, `EN TRAMITE`, `CONFIRMACION DE ZARPE`, `FOB`, `EXW`
  - 🔵 **Azul**: `ADUANA`, `COURRIER`, `SE RETIRO DEL ALMACEN`, `DNI`
  - 🟢 **Turquesa**: `DIRECCIONAMIENTO`, `SCHARFF`, `AQP EXPRESS`
  - 🔴 **Rosa / Rojo**: `IMPORTACION CARGA Y ADUANA`, `INCAUTADO`, `NO`, `CANCELADO`
  - 🟣 **Morado**: `COMISIONISTA`, `CHARTER LINK LOGISTICS`, `TRANSMARES`

### 3. Encabezados Fijos (Sticky Headers) y Filtros estilo Excel
- Los encabezados de las tablas se mantienen **fijos en la parte superior** mientras navegas por miles de registros.
- Cada columna incluye un ícono de filtro para ordenar (Ascendente/Descendente) o filtrar por valores específicos.

### 4. Búsqueda Global en Tiempo Real
- La barra de búsqueda en la parte superior te permite filtrar registros instantáneamente en cualquiera de las 27 hojas.

### 5. Botón "+ Nuevo Registro"
- Haz clic en el botón superior derecho para abrir un formulario modal dinámico y registrar nuevos datos en la hoja activa.

---

## 🔄 Conexión y Sincronización con Google Sheets

El sistema está diseñado con arquitectura híbrida:
- **Modo Local (Instantáneo)**: Lee y guarda directamente en los archivos Excel de tu carpeta local con respuestas de <20ms.
- **Sincronización con Google Sheets**: Para conectar directamente con Google Sheets en vivo en la nube, puedes colocar tus credenciales `credentials.json` (Service Account) en la carpeta `web_app/` o vincular el ID de tu Google Sheet en `config.py`.

---

## ➕ Cómo Agregar Futuros Google Sheets al Sistema

Si en el futuro deseas incorporar un **4to o 5to Google Sheet**:

1. Copia el nuevo archivo Excel a la carpeta principal `10. BaseDatos MSI/`.
2. Ejecuta el script generador de catálogo:
   ```bash
   python scratch/generate_catalog.py
   ```
3. ¡El sistema detectará automáticamente las nuevas hojas y las agregará al menú lateral!
