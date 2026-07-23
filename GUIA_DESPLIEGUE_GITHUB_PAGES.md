# 🚀 Guía de Despliegue: HTML en GitHub Pages + API REST Google Apps Script

Esta guía te muestra cómo tener tu sistema web **100% alojado en GitHub Pages** (con tu archivo `index.html` FUERA de Apps Script) y conectado a Google Sheets vía **Apps Script API REST**.

---

## 🏛️ Arquitectura del Sistema

```
┌───────────────────────────────────────────────────┐
│ GitHub Pages (HTML + CSS + JavaScript)            │
│ URL: https://tu-usuario.github.io/tu-repositorio/ │
│ • index.html                                      │
│ • static/css/styles.css                           │
│ • static/js/app.js                                │
└─────────────────────────┬─────────────────────────┘
                          │ fetch() JSON
┌─────────────────────────▼─────────────────────────┐
│ Google Apps Script API REST (api/Code.gs)         │
│ • doGet() & doPost() procesan JSON                │
└─────────────────────────┬─────────────────────────┘
                          │ API SpreadsheetApp
┌─────────────────────────▼─────────────────────────┐
│ Google Sheets (3 Archivos / 27 Hojas)             │
│ • Registro de Servicios                           │
│ • Base Datos Operativa                            │
│ • Registro Importaciones                          │
└───────────────────────────────────────────────────┘
```

---

## 📋 Pasos para Desplegar

### Paso 1: Configurar la API REST en Google Apps Script
1. Entra a **[script.google.com](https://script.google.com)** y crea un **Nuevo proyecto**.
2. Copia todo el contenido del archivo **[`api/Code.gs`](file:///c:/Users/USUARIO/Documents/Pojects_gravitity/10.%20BaseDatos%20MSI/api/Code.gs)** de tu proyecto y pégalo en el editor de Apps Script.
3. En las líneas 6-8, coloca los **3 IDs reales** de tus Google Sheets en Google Drive.
4. Haz clic en **Implementar** → **Nueva implementación**.
5. Tipo: **Aplicación web**.
6. En *"Quién tiene acceso"*, selecciona **Cualquier persona**.
7. Haz clic en **Implementar** y **copia la URL generada** (ej: `https://script.google.com/macros/s/AKfycbx.../exec`).

---

### Paso 2: Vincular la URL de la API en tu archivo JS
1. Abre tu archivo local **[`web_app/static/js/app.js`](file:///c:/Users/USUARIO/Documents/Pojects_gravitity/10.%20BaseDatos%20MSI/web_app/static/js/app.js)**.
2. En la **Línea 6**, pega la URL de la API que copiaste en el Paso 1:
   ```javascript
   const APPS_SCRIPT_API_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```

---

### Paso 3: Activar GitHub Pages en tu Repositorio
1. Sube tu código a tu repositorio de **GitHub**.
2. En la página de tu repositorio en GitHub, ve a **Settings** → **Pages**.
3. En **Source**, selecciona **Deploy from a branch**.
4. En **Branch**, selecciona **main** (o master) y la carpeta `/ (root)`.
5. Haz clic en **Save**.
6. En 1-2 minutos GitHub te dará tu URL permanente:
   **`https://tu-usuario.github.io/tu-repositorio/`**

---

## ✅ ¡Listo!
- Tu archivo `index.html` está alojado en **GitHub Pages** (fuera de Apps Script).
- Tu backend corre en **Google Apps Script API REST**.
- No ejecutas ningún archivo `.bat`, no usas servidores de pago, y funciona **24/7 de forma 100% gratuita**.
