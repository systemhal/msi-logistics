/**
 * CONFIGURACIÓN DE CONEXIÓN CON APPS SCRIPT API
 */
const APPS_SCRIPT_API_URL = 'https://script.google.com/macros/s/AKfycbyHWHtFGoquJHQq_hI57a4gNPMP87HUTA_WIy9-LOqEQ7x_mY0RX3VF5hJ1yse35yIA-Q/exec'; 

// State Management
let currentCatalog = [];
let currentSpId = 'registro_servicios';
let currentSheetName = 'Registro Cliente';
let currentColsConfig = [];
let currentEditRowNum = null;

let gridApi = null;
let gridOptions = null;
let searchDebounceTimeout = null;

// Multi-select active filters state
let activeMultiFilters = {};

// Desglosables por defecto
const CLIENTES_SERVICIO_OPTIONS = [
    'ADUANA Y CARGA',
    'ADUANAS',
    'CARGA',
    'CURRIER',
    'DIRECCIONAMIENTO',
    'OTROS'
];

/**
 * Busca de forma segura un nodo en AG Grid por su número de fila exacto del Spreadsheet (_row_num)
 */
function getRowNodeByRowNum(rowNum) {
    if (!gridApi) return null;
    let foundNode = null;
    gridApi.forEachNode(node => {
        if (!foundNode && node.data && node.data._row_num === rowNum) {
            foundNode = node;
        }
    });
    return foundNode;
}

/**
 * Gestor de colores manuales persistentes en localStorage
 */
function getSavedManualColor(sheetName, rowNum, rowData) {
    const key = `row_color_${sheetName}_${rowNum}`;
    return localStorage.getItem(key) || (rowData ? rowData._manual_color : null) || 'AUTOMATICO';
}

function saveManualColor(sheetName, rowNum, colorVal) {
    const key = `row_color_${sheetName}_${rowNum}`;
    if (colorVal && colorVal !== 'AUTOMATICO') {
        localStorage.setItem(key, colorVal);
    } else {
        localStorage.removeItem(key);
    }
}

/**
 * Obtiene las opciones desglosables específicas por columna y hoja
 */
function getOptionsForColumn(label, sheetName) {
    const labelUpper = (label || '').toUpperCase();
    if (labelUpper.includes('DIRECCION')) return [];

    if (labelUpper.includes('TIPO DOC') || labelUpper.includes('TIPO DOCUMENTO')) {
        return ['RUC', 'DNI', 'CE', 'PASAPORTE'];
    }
    if (sheetName === 'Clientes - Consignatarios' && labelUpper.includes('SERVICIO')) {
        return ['ADUANA Y CARGA', 'ADUANAS', 'CARGA', 'CURRIER', 'DIRECCIONAMIENTO', 'OTROS'];
    }
    if (labelUpper.includes('SERVICIO')) {
        return ['CARGA Y ADUANA', 'ADUANA Y CARGA', 'COURRIER', 'CURRIER', 'SEGURO', 'ADUANA', 'CARGA', 'OTROS'];
    }
    if (labelUpper.includes('INCOTERM')) {
        return ['FOB', 'CIF', 'EXW', 'FCA', 'CFR', 'DDP', 'DAP'];
    }
    if (labelUpper.includes('ESTADO')) {
        return ['SE RETIRO DEL ALMACEN', 'EN TRAMITE', 'CONFIRMACION DE ZARPE', 'CONCLUIDO', 'CANCELADO'];
    }
    if (labelUpper.includes('CARGA LCL') || labelUpper.includes('LCL O FCL')) {
        return ['LCL', 'FCL', '20ST / FCL', 'FCL 1X20', 'FCL 1X40', 'FCL 40 HC', 'AEREO'];
    }
    if (labelUpper.includes('COURRIER') || labelUpper.includes('CURRIER')) {
        return ['DHL', 'FEDEX', 'UPS', 'TNT', 'SCHARFF', 'AQP EXPRESS', 'OTRO'];
    }
    if (labelUpper.includes('NOTIFICO') || labelUpper.includes('VENTA')) {
        return ['SI', 'NO', 'Si', 'No'];
    }
    if (labelUpper.includes('CANAL')) {
        return ['ROJO', 'NARANJA', 'VERDE'];
    }
    return [];
}

/**
 * Editor Inline de Desglosables sin overlay blanco ni mezclado de opciones
 */
class CustomInlineSelectEditor {
    init(params) {
        this.eInput = document.createElement('select');
        this.eInput.style.width = '100%';
        this.eInput.style.height = '100%';
        this.eInput.style.fontSize = '12px';
        this.eInput.style.fontFamily = 'Inter, sans-serif';
        this.eInput.style.fontWeight = '600';
        this.eInput.style.border = '2px solid #ec3237';
        this.eInput.style.borderRadius = '4px';
        this.eInput.style.background = '#ffffff';
        this.eInput.style.outline = 'none';
        this.eInput.style.padding = '0 4px';
        this.eInput.style.color = '#0f172a';

        let values = params.values ? [...params.values] : [];
        const currentVal = params.value ? String(params.value).trim() : '';

        if (currentVal && !values.some(v => String(v).trim() === currentVal)) {
            values.push(currentVal);
        }

        values.forEach(val => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.text = val;
            if (String(val).trim() === currentVal) {
                opt.selected = true;
            }
            this.eInput.appendChild(opt);
        });
    }

    getGui() {
        return this.eInput;
    }

    afterGuiAttached() {
        this.eInput.focus();
    }

    getValue() {
        return this.eInput.value;
    }

    destroy() {}

    isPopup() {
        return false;
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    fetchCatalog();
    fetchDashboardStats();
    renderInicioSheetsSection();
});

function fetchCatalog() {
    try {
        renderSidebarDefault();
    } catch (err) {
        console.error('Error fetching catalog:', err);
    }
}

function renderSidebarDefault() {
    currentCatalog = [
        {
            id: 'registro_servicios',
            title: 'Registro de Servicios',
            icon: 'fa-ship',
            type: 'flat',
            sheets: [
                { name: 'Registro Cliente', icon: 'fa-user-tie' },
                { name: 'Registro Carga', icon: 'fa-box-open' },
                { name: 'Registro Courrier', icon: 'fa-plane-departure' },
                { name: 'Seguro de carga internacional', icon: 'fa-shield-halved' }
            ]
        },
        {
            id: 'base_datos_operativa',
            title: 'Base Datos Operativa',
            icon: 'fa-database',
            type: 'grouped',
            groups: [
                { key: 'Informativo', label: '📌 Informativo', sheets: [{ name: 'Clientes - Consignatarios' }, { name: 'Comerciales - MSI' }, { name: 'Comerciales Oper. - Logis.' }] },
                { key: 'Carga', label: '📦 Carga', sheets: [{ name: 'Agentes Carga' }, { name: 'Operador Logístico' }, { name: 'Seguro Carga' }] },
                { key: 'Operaciones', label: '⚙️ Operaciones', sheets: [{ name: 'Agencia de Aduana' }, { name: 'Emp. Transporte Local' }, { name: 'Deposito Aduanero' }, { name: 'Almacén Temporal' }, { name: 'Servicio de Montacarga' }, { name: 'Almacén Trasegado' }, { name: 'Tramite de Mercancia Restringid' }] },
                { key: 'Proveedores', label: '🏢 Proveedores', sheets: [{ name: 'Servicio Marketing' }, { name: 'Soporte Tecnico' }, { name: 'Empresa Transporte para Envio P' }, { name: 'Agente Maritimo - VB' }, { name: 'Gate IN' }, { name: 'Línea Naviera - AVLL' }, { name: 'Direccionamiento' }] }
            ]
        },
        {
            id: 'registro_importaciones',
            title: 'Registro Importaciones',
            icon: 'fa-file-invoice-dollar',
            type: 'flat',
            sheets: [
                { name: 'Despacho Aduanas', icon: 'fa-table' },
                { name: 'Registro Ordenes MSI', icon: 'fa-table' },
                { name: 'Ordenes Mocayas', icon: 'fa-table' }
            ]
        }
    ];
    renderSidebar();
}

let googleSheetsLinks = [
    {
        id: 'registro_servicios',
        title: 'Registro de Servicios',
        icon: 'fa-ship',
        color: 'linear-gradient(135deg, #ec3237 0%, #b91c1c 100%)',
        description: 'Contiene Registro Cliente, Registro Carga, Registro Courrier y Seguro de Carga Internacional.',
        url: 'https://docs.google.com/spreadsheets/d/12WXMgbK3u5hmyV1eScVProdItxc6RDssRBdRTMG0Zb8/edit'
    },
    {
        id: 'base_datos_operativa',
        title: 'Base Datos Operativa',
        icon: 'fa-database',
        color: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        description: 'Directorio maestro de Clientes, Consignatarios, Agentes de Carga, Almacenes y Proveedores.',
        url: 'https://docs.google.com/spreadsheets/d/1MVY3aojC4qJ99DVEnGVdqjlt3Bl_0YbqE3PFjQNjOH8/edit'
    },
    {
        id: 'registro_importaciones',
        title: 'Registro Importaciones',
        icon: 'fa-file-invoice-dollar',
        color: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        description: 'Control de Despachos de Aduana, Registro de Órdenes MSI y Órdenes Mocayas.',
        url: 'https://docs.google.com/spreadsheets/d/1-GxPudEQPNyz_wamNMevY60bJKUgvUfBum-QC--95PY/edit'
    }
];

function loadSavedSheetLinks() {
    const saved = localStorage.getItem('msi_google_sheets_links');
    if (saved) {
        try {
            googleSheetsLinks = JSON.parse(saved);
        } catch(e) {}
    }
}

function saveSheetLinks() {
    localStorage.setItem('msi_google_sheets_links', JSON.stringify(googleSheetsLinks));
}

function renderSidebar() {
    const navTree = document.getElementById('navTree');
    if (!navTree) return;

    let html = `
        <div class="nav-item active" id="nav-dash" onclick="showDashboard()">
            <i class="fa-solid fa-house menu-icon"></i>
            <span>Inicio</span>
        </div>
    `;

    currentCatalog.forEach(cat => {
        const catId = `cat-${cat.id}`;
        html += `
            <div class="nav-item" onclick="toggleCategory('${catId}', this)">
                <i class="fa-solid ${cat.icon} menu-icon"></i>
                <span>${cat.title}</span>
                <i class="fa-solid fa-chevron-right arrow"></i>
            </div>
            <div class="nav-submenu" id="${catId}">
        `;

        if (cat.type === 'flat') {
            cat.sheets.forEach(sheet => {
                const icon = sheet.icon || 'fa-table';
                html += `
                    <div class="nav-sheet-item" onclick="selectSheet('${cat.id}', '${sheet.name}', this)">
                        <i class="fa-solid ${icon}"></i>
                        <span>${sheet.name}</span>
                    </div>
                `;
            });
        } else if (cat.type === 'grouped') {
            cat.groups.forEach(grp => {
                const grpId = `grp-${cat.id}-${grp.key}`;
                html += `
                    <div class="nav-subgroup-title" onclick="toggleSubgroup('${grpId}', this)">
                        <span>${grp.label}</span>
                        <i class="fa-solid fa-chevron-right arrow"></i>
                    </div>
                    <div class="nav-subgroup-list" id="${grpId}">
                `;

                grp.sheets.forEach(sheet => {
                    html += `
                        <div class="nav-sheet-item level-3" onclick="selectSheet('${cat.id}', '${sheet.name}', this)">
                            <i class="fa-solid fa-table"></i>
                            <span>${sheet.name}</span>
                        </div>
                    `;
                });

                html += `</div>`;
            });
        }

        html += `</div>`;
    });

    navTree.innerHTML = html;
}

function toggleCategory(catId, el) {
    const submenu = document.getElementById(catId);
    if (submenu) submenu.classList.toggle('open');
    if (el) el.classList.toggle('open');
}

function toggleSubgroup(grpId, el) {
    const sublist = document.getElementById(grpId);
    if (sublist) sublist.classList.toggle('open');
    if (el) el.classList.toggle('open');
}

function showDashboard() {
    document.querySelectorAll('.nav-item, .nav-sheet-item').forEach(e => e.classList.remove('active'));
    const dash = document.getElementById('nav-dash');
    if (dash) dash.classList.add('active');

    document.getElementById('dashboardView').classList.add('active');
    document.getElementById('gridView').classList.remove('active');

    document.getElementById('currentTitle').textContent = 'Inicio';
    document.getElementById('currentBreadcrumb').textContent = 'Inicio';
    fetchDashboardStats();
    renderInicioSheetsSection();
}

function renderInicioSheetsSection() {
    loadSavedSheetLinks();
    let container = document.getElementById('inicioSheetsContainer');
    if (!container) {
        const dashView = document.getElementById('dashboardView');
        if (!dashView) return;
        container = document.createElement('div');
        container.id = 'inicioSheetsContainer';
        container.style.marginTop = '28px';
        dashView.appendChild(container);
    }

    let html = `
        <div class="sheets-header-banner">
            <div>
                <h2><i class="fa-solid fa-file-excel" style="color:#10b981; margin-right:8px;"></i> Accesos Directos a Libros de Google Sheets</h2>
                <p>Haz clic en cualquier enlace para abrir la hoja de cálculo oficial en Google Sheets o edita/agrega nuevos enlaces guardados.</p>
            </div>
            <button class="btn-sheets-open" onclick="addNewSheetLink()" style="flex:none; padding:10px 18px;">
                <i class="fa-solid fa-plus"></i> Agregar Nuevo Enlace
            </button>
        </div>

        <div class="sheets-grid">
    `;

    googleSheetsLinks.forEach((item, index) => {
        const bgGradient = item.color || 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        html += `
            <div class="sheet-card">
                <div class="sheet-card-top">
                    <div class="sheet-card-icon" style="background: ${bgGradient};">
                        <i class="fa-solid ${item.icon || 'fa-file-excel'}"></i>
                    </div>
                    <div class="sheet-card-info">
                        <h3>${escapeHtml(item.title)}</h3>
                        <p>${escapeHtml(item.description || 'Libro de trabajo en vivo de Google Sheets')}</p>
                    </div>
                </div>

                <div class="sheet-card-url-box" title="${escapeHtml(item.url)}">
                    <i class="fa-solid fa-link" style="color:#10b981; margin-right:6px;"></i> ${escapeHtml(item.url)}
                </div>

                <div class="sheet-card-actions">
                    <a href="${escapeHtml(item.url)}" target="_blank" class="btn-sheets-open">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir en Sheets
                    </a>
                    <button class="btn-sheets-copy" onclick="copySheetLinkToClipboard('${escapeHtml(item.url)}')" title="Copiar Enlace">
                        <i class="fa-solid fa-copy"></i> Copiar
                    </button>
                    <button class="btn-sheets-edit" onclick="editSheetLink(${index})" title="Editar Enlace">
                        <i class="fa-solid fa-pen-to-square"></i> Editar
                    </button>
                </div>
            </div>
        `;
    });

    html += `
            <div class="sheet-card-add" onclick="addNewSheetLink()">
                <i class="fa-solid fa-circle-plus" style="font-size: 38px; color: #10b981;"></i>
                <div style="font-size: 15px; font-weight: 800;">Agregar Enlace de Google Sheets</div>
                <div style="font-size: 12px; opacity: 0.85; text-align: center;">Registra un nuevo libro de trabajo para acceso rápido</div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function editSheetLink(index) {
    const item = googleSheetsLinks[index];
    if (!item) return;

    const newUrl = prompt(`Editar Enlace URL para "${item.title}":`, item.url);
    if (newUrl !== null && newUrl.trim() !== '') {
        googleSheetsLinks[index].url = newUrl.trim();
        saveSheetLinks();
        renderInicioSheetsSection();
    }
}

function addNewSheetLink() {
    const title = prompt('Nombre de la Hoja / Libro de Google Sheets:');
    if (!title || !title.trim()) return;

    const url = prompt('Enlace URL de Google Sheets:');
    if (!url || !url.trim()) return;

    const desc = prompt('Descripción corta (Opcional):') || 'Libro de trabajo adicional';

    googleSheetsLinks.push({
        id: 'custom_' + Date.now(),
        title: title.trim(),
        icon: 'fa-file-excel',
        color: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        description: desc.trim(),
        url: url.trim()
    });

    saveSheetLinks();
    renderInicioSheetsSection();
}

function copySheetLinkToClipboard(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('📋 ¡Enlace copiado al portapapeles!');
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
}

function selectSheet(spId, sheetName, el) {
    document.querySelectorAll('.nav-item, .nav-sheet-item').forEach(e => e.classList.remove('active'));
    if (el) el.classList.add('active');

    currentSpId = spId;
    currentSheetName = sheetName;
    activeMultiFilters = {};
    closeFloatingPopover();

    document.getElementById('dashboardView').classList.remove('active');
    const sheetsView = document.getElementById('sheetsView');
    if (sheetsView) sheetsView.classList.remove('active');

    document.getElementById('gridView').classList.add('active');

    document.getElementById('currentTitle').textContent = sheetName;
    document.getElementById('currentBreadcrumb').textContent = `${spId} / ${sheetName}`;

    loadGridData();
}

/**
 * Renderizador de Badges con Colores Exactos por Proveedor y Estado
 */
function cellBadgeRenderer(params) {
    const val = params.value;
    if (val === null || val === undefined || val === '') return '';

    const str = String(val).trim();
    let badgeClass = 'badge-gray';
    const s = str.toUpperCase();

    if (s.includes('GROUP TITANS')) badgeClass = 'badge-gray';
    else if (s.includes('GOLD PERU') || s.includes('SOUTH CARGO')) badgeClass = 'badge-pink';
    else if (s.includes('TRANSMARES')) badgeClass = 'badge-green';
    else if (s.includes('CHARTER LINK')) badgeClass = 'badge-blue';
    else if (s === 'MSL' || s.includes('MSL CORPORATE')) badgeClass = 'badge-purple';
    else if (s.includes('WOLRDPASS') || s.includes('WORLD PASS')) badgeClass = 'badge-indigo';
    else if (s.includes('KERRY')) badgeClass = 'badge-violet';
    else if (s.includes('TRANSOCEAN')) badgeClass = 'badge-orange';
    else if (s.includes('CRAFT')) badgeClass = 'badge-yellow';
    else if (s.includes('GOLDEN SHIPPING')) badgeClass = 'badge-purple-dark';
    else if (['CARGA Y ADUANA', 'ADUANA Y CARGA', 'CONCLUIDO', 'CARGA CULMINADA', 'SI', 'RUC', 'FCL', 'ROJO', 'NARANJA'].some(k => s.includes(k))) {
        badgeClass = s.includes('ROJO') ? 'badge-red' : (s.includes('NARANJA') ? 'badge-yellow' : 'badge-green');
    } else if (['CARGA', 'EN TRAMITE', 'CONFIRMACION DE ZARPE', 'FOB', 'EXW'].some(k => s.includes(k))) {
        badgeClass = 'badge-yellow';
    } else if (['ADUANA', 'ADUANAS', 'COURRIER', 'CURRIER', 'SE RETIRO DEL ALMACEN', 'DNI'].some(k => s.includes(k))) {
        badgeClass = 'badge-blue';
    } else if (['DIRECCIONAMIENTO', 'SCHARFF', 'AQP EXPRESS', 'DHL', 'FEDEX', 'UPS'].some(k => s.includes(k))) {
        badgeClass = 'badge-teal';
    } else if (['IMPORTACION', 'INCAUTADO', 'CANCELADO', 'NO'].some(k => s.includes(k))) {
        badgeClass = 'badge-pink';
    } else if (['COMISIONISTA', 'CHARTER', 'GOLD', 'OTROS'].some(k => s.includes(k))) {
        badgeClass = 'badge-purple';
    }

    return `<span class="badge-pill ${badgeClass}">${escapeHtml(str)}</span>`;
}

function cellActionsRenderer(params) {
    const rowNum = params.data._row_num;
    return `
        <div class="grid-actions">
            <button class="btn-icon btn-icon-edit" onclick="editRecord(${rowNum})" title="Editar Fila">
                <i class="fa-solid fa-pencil"></i>
            </button>
            <button class="btn-icon btn-icon-delete" onclick="deleteRecord(${rowNum})" title="Eliminar Fila">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
}

const CREMA_RO_SET = new Set([
    '26/00315', '26/00339', '26/00344', '26/00359', '26/00364', '26/00369', '26/00370', '26/00371',
    '26/00373', '26/00379', '26/00381', '26/00382', '26/00383', '26/00384', '26/00385', '26/00386',
    '26/00387', '26/00388', '26/00389', '26/00390', '26/00391', '26/00392', '26/00393', '26/00394',
    '26/00395', '26/00396', '26/00397', '26/00398', '26/00399', '26/00400', '26/00401', '26/00402',
    '26/00403', '26/00404', '26/00405', '26/00406', '26/00407', '26/00408', '26/00409', '26/00410',
    '26/00411', '26/00412', '26/00413', '26/00414', '26/00415', '26/00416', '26/00417', '26/00418',
    '26/00419', '26/00420', '26/00421', '26/00422', '26/00423', '26/00424', '26/00425', '26/00426',
    '26/00427', '26/00428', '26/00429', '26/00430', '26/00431', '26/00432', '26/00433', '26/00434',
    '26/00435', '26/00436', '26/00437', '26/00438', '26/00439', '26/00440', '26/00441', '26/00442',
    '26/00443', '26/00444', '26/00445', '26/00446', '26/00447', '26/00448', '26/00449', '26/00450',
    '26/00451', '26/00452', '26/00453', '26/00454', '26/00455', '26/00456', '26/00457', '26/00458',
    '26/00459', '26/00460', '26/00461', '26/00462', '26/00463', '26/00464', '26/00465', '26/00466',
    '26/00467', '26/00468', '26/00469', '26/00470', '26/00471'
]);

/**
 * Determina el tono de color exacto de la fila entera (Persistente)
 */
function getRowColorCategory(data) {
    if (!data) return 'BLANCO';

    // Prioridad a color manual guardado en localStorage o data
    const manualCol = (data._row_num ? localStorage.getItem(`row_color_${currentSheetName}_${data._row_num}`) : null) || data._manual_color;
    if (manualCol && manualCol !== 'AUTOMATICO') {
        return manualCol;
    }

    // Color de fondo pintado directamente en la hoja de Google Sheets
    if (data._sheet_color && data._sheet_color !== 'AUTOMATICO') {
        return data._sheet_color;
    }

    // Verificar si la fila contiene uno de los ROs asignados a Crema Suave (#fcf7e8)
    for (let k in data) {
        const strVal = String(data[k] || '').trim();
        if (CREMA_RO_SET.has(strVal)) {
            return 'CREMA';
        }
    }

    let estado = '';
    let notifico = '';

    Object.keys(data).forEach(k => {
        const val = String(data[k] || '').toUpperCase();
        if (val.includes('SE RETIRO') || val.includes('RETIRO DEL ALMACEN') || val.includes('EN TRAMITE') || val.includes('CONFIRMACION DE ZARPE') || val.includes('CONCLUIDO') || val.includes('CANCELADO') || val.includes('CARGA CULMINADA')) {
            estado = val;
        }
        if (val === 'SI' || val === 'NO') {
            notifico = val;
        }
    });

    if (estado.includes('SE RETIRO') || estado.includes('RETIRO DEL ALMACEN')) {
        return 'GRIS';
    }
    if (notifico === 'SI' || estado.includes('CONCLUIDO') || estado.includes('CARGA CULMINADA') || estado.includes('DERIVO')) {
        return 'VERDE';
    }
    if (estado.includes('EN TRAMITE') || estado.includes('CONFIRMACION DE ZARPE')) {
        return 'CREMA';
    }
    if (estado.includes('CANCELADO') || estado.includes('INCAUTADO')) {
        return 'ROJO';
    }
    return 'BLANCO';
}

function getRowClassRule(params) {
    const cat = getRowColorCategory(params.data);
    if (cat === 'VERDE') return 'row-bg-green';
    if (cat === 'GRIS') return 'row-bg-gray';
    if (cat === 'CREMA') return 'row-bg-yellow';
    if (cat === 'ROJO') return 'row-bg-red';
    return '';
}

// Dynamic AG Grid Initialization with Native External Filter callbacks
function initAgGrid(cols) {
    const gridDiv = document.querySelector('#myGrid');
    if (!gridDiv) return;
    gridDiv.innerHTML = '';

    const columnDefs = cols.map(c => {
        const opts = getOptionsForColumn(c.label, currentSheetName);
        const isSelect = opts.length > 0;

        const colDef = {
            headerName: c.label || c.key,
            field: c.key,
            editable: c.editable !== false,
            sortable: true,
            filter: true,
            floatingFilter: true,
            resizable: true
        };

        if (isSelect) {
            colDef.cellEditor = CustomInlineSelectEditor;
            colDef.cellEditorParams = { values: opts };
            colDef.cellRenderer = cellBadgeRenderer;
        } else if (c.label && c.label.toUpperCase().includes('PROVEEDOR')) {
            colDef.cellRenderer = cellBadgeRenderer;
        }

        return colDef;
    });

    columnDefs.push({
        headerName: 'Acciones',
        field: '_actions',
        width: 100,
        editable: false,
        sortable: false,
        filter: false,
        pinned: 'right',
        cellRenderer: cellActionsRenderer
    });

    gridOptions = {
        columnDefs: columnDefs,
        rowData: [],
        pagination: true,
        paginationPageSize: 50,
        rowHeight: 40,
        headerHeight: 42,
        animateRows: true,
        getRowClass: getRowClassRule,
        getRowStyle: (params) => {
            if (params.data && params.data._custom_hex) {
                return { background: params.data._custom_hex };
            }
            return null;
        },
        onCellValueChanged: onCellValueChanged,
        isExternalFilterPresent: () => {
            return Object.keys(activeMultiFilters).some(k => activeMultiFilters[k] && activeMultiFilters[k].length > 0);
        },
        doesExternalFilterPass: (node) => {
            if (!node.data) return true;

            for (let colKey in activeMultiFilters) {
                const selected = activeMultiFilters[colKey];
                if (selected && selected.length > 0) {
                    if (colKey === '_row_color_filter') {
                        const rowColorCat = getRowColorCategory(node.data);
                        if (!selected.includes(rowColorCat)) return false;
                    } else {
                        const cellVal = node.data[colKey] !== undefined && node.data[colKey] !== null ? String(node.data[colKey]).trim() : '';
                        const matches = selected.some(sel => String(sel).trim().toLowerCase() === cellVal.toLowerCase());
                        if (!matches) return false;
                    }
                }
            }
            return true;
        },
        defaultColDef: {
            minWidth: 140,
            flex: 1
        },
        overlayLoadingTemplate: `
            <div class="msi-senior-loader">
                <div class="msi-loader-card">
                    <div class="msi-loader-logo-box">
                        <img src="icono.png" alt="MSI Logo">
                        <div class="msi-loader-ring"></div>
                    </div>
                    <div class="msi-loader-text-group">
                        <div class="msi-loader-title">Sincronizando Base de Datos</div>
                        <div class="msi-loader-sub"><i class="fa-solid fa-cloud-arrow-down"></i> Conexión en vivo con Google Sheets</div>
                    </div>
                    <div class="msi-loader-progress-track">
                        <div class="msi-loader-progress-bar"></div>
                    </div>
                </div>
            </div>
        `,
        overlayNoRowsTemplate: `
            <div class="msi-senior-loader">
                <div class="msi-loader-card" style="padding: 24px 32px !important;">
                    <i class="fa-solid fa-folder-open" style="font-size:32px; color:#94a3b8; margin-bottom:4px;"></i>
                    <div class="msi-loader-title">No hay registros disponibles</div>
                    <div class="msi-loader-sub">Usa el botón "+ Nuevo Registro" para ingresar uno</div>
                </div>
            </div>
        `
    };

    gridApi = agGrid.createGrid(gridDiv, gridOptions);
}

/**
 * Mapeo exacto de la columna objetivo
 */
function findColDefByTargetLabel(targetLabel) {
    if (!currentColsConfig || !currentColsConfig.length) return null;

    if (targetLabel === 'RO') {
        return currentColsConfig.find(c => (c.label || '').trim().toUpperCase() === 'RO');
    }
    if (targetLabel.includes('Nro Documento')) {
        return currentColsConfig.find(c => {
            const l = (c.label || '').trim().toUpperCase();
            return (l.includes('NRO') && (l.includes('DOC') || l.includes('DOCUMENTO'))) || l === 'NRO DOCUMENTO';
        });
    }
    if (targetLabel.includes('Razón Social')) {
        return currentColsConfig.find(c => (c.label || '').toUpperCase().includes('RAZON') || (c.label || '').toUpperCase().includes('RAZÓN'));
    }
    if (targetLabel.includes('Codigo_Cliente')) {
        return currentColsConfig.find(c => (c.label || '').toUpperCase().includes('CODIGO') || (c.label || '').toUpperCase().includes('CÓDIGO'));
    }
    if (targetLabel.includes('Proveedor')) {
        return currentColsConfig.find(c => (c.label || '').toUpperCase().includes('PROVEEDOR'));
    }
    if (targetLabel.includes('Consignatario')) {
        return currentColsConfig.find(c => (c.label || '').toUpperCase().includes('CONSIGNATARIO'));
    }
    if (targetLabel.includes('Courrier Internacional')) {
        return currentColsConfig.find(c => (c.label || '').toUpperCase().includes('COURRIER') || (c.label || '').toUpperCase().includes('CURRIER'));
    }
    if (targetLabel.includes('Almacén') || targetLabel.includes('Almacen')) {
        return currentColsConfig.find(c => (c.label || '').toUpperCase().includes('ALMACEN') || (c.label || '').toUpperCase().includes('ALMACÉN'));
    }
    if (targetLabel.includes('Observaciones')) {
        return currentColsConfig.find(c => (c.label || '').toUpperCase().includes('OBSERVACION'));
    }
    if (targetLabel.includes('Estado Actual')) {
        return currentColsConfig.find(c => (c.label || '').toUpperCase().includes('ESTADO ACTUAL'));
    }
    if (targetLabel.includes('Servicio')) {
        return currentColsConfig.find(c => (c.label || '').toUpperCase().includes('SERVICIO'));
    }

    return null;
}

/**
 * Renderiza la barra de Filtros Avanzados Multiselección en la barra superior
 */
function renderMultiFiltersBar() {
    let toolbar = document.querySelector('.grid-toolbar');
    if (!toolbar) return;

    let filterBar = document.getElementById('multiFilterBar');
    if (!filterBar) {
        filterBar = document.createElement('div');
        filterBar.id = 'multiFilterBar';
        filterBar.className = 'multi-filter-bar';
        toolbar.insertBefore(filterBar, toolbar.firstChild);
    }
    filterBar.innerHTML = '';

    let filterCols = [];
    if (currentSheetName === 'Registro Cliente') {
        filterCols = ['Servicio', 'Razón Social', 'Nro Documento', 'Codigo_Cliente'];
    } else if (currentSheetName === 'Registro Carga') {
        filterCols = ['RO', 'Consignatario', 'Proveedor (Agencia de Carga)', 'Estado Actual'];
    } else if (currentSheetName === 'Registro Courrier') {
        filterCols = ['RO', 'Consignatario', 'Courrier Internacional', 'Almacén', 'Observaciones'];
    }

    filterCols.forEach(targetLabel => {
        const colDef = findColDefByTargetLabel(targetLabel);
        if (!colDef) return;

        const colKey = colDef.key;
        const container = document.createElement('div');
        container.className = 'filter-dropdown-container';

        const selectedCount = (activeMultiFilters[colKey] || []).length;
        const btnText = selectedCount > 0 ? `${targetLabel} (${selectedCount})` : `Filtro ${targetLabel}`;

        container.innerHTML = `
            <button class="filter-btn-trigger ${selectedCount > 0 ? 'active' : ''}" onclick="toggleFixedPopover('${colKey}', '${escapeHtml(targetLabel)}', this, event)">
                <i class="fa-solid fa-filter"></i>
                <span>${escapeHtml(btnText)}</span>
                <i class="fa-solid fa-chevron-down"></i>
            </button>
        `;

        filterBar.appendChild(container);
    });

    // RENDERIZAR FILTRO POR COLOR DE FILA
    const colorColKey = '_row_color_filter';
    const colorContainer = document.createElement('div');
    colorContainer.className = 'filter-dropdown-container';
    const selectedColorCount = (activeMultiFilters[colorColKey] || []).length;
    const colorBtnText = selectedColorCount > 0 ? `Color Fila (${selectedColorCount})` : `Filtro Color Fila`;

    colorContainer.innerHTML = `
        <button class="filter-btn-trigger ${selectedColorCount > 0 ? 'active' : ''}" onclick="toggleFixedPopover('${colorColKey}', 'Color Fila', this, event)">
            <i class="fa-solid fa-palette"></i>
            <span>${escapeHtml(colorBtnText)}</span>
            <i class="fa-solid fa-chevron-down"></i>
        </button>
    `;

    filterBar.appendChild(colorContainer);
}

/**
 * Abre la ventana de filtro construyendo elementos DOM reales
 */
function toggleFixedPopover(colKey, labelText, btnEl, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    let currentFloating = document.getElementById('floatingFilterPopover');
    
    if (currentFloating && currentFloating.getAttribute('data-colkey') === colKey) {
        closeFloatingPopover();
        return;
    }

    closeFloatingPopover();

    const rect = btnEl.getBoundingClientRect();
    const floatingPop = document.createElement('div');
    floatingPop.id = 'floatingFilterPopover';
    floatingPop.setAttribute('data-colkey', colKey);
    floatingPop.style.position = 'fixed';
    floatingPop.style.top = `${rect.bottom + 6}px`;
    floatingPop.style.left = `${Math.min(rect.left, window.innerWidth - 300)}px`;
    floatingPop.style.width = '290px';
    floatingPop.style.background = '#ffffff';
    floatingPop.style.border = '1.5px solid #ec3237';
    floatingPop.style.borderRadius = '10px';
    floatingPop.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
    floatingPop.style.zIndex = '999999';
    floatingPop.style.padding = '12px';

    floatingPop.onclick = (e) => e.stopPropagation();

    // Encabezado
    const header = document.createElement('div');
    header.style.cssText = 'font-size:12.5px; font-weight:800; color:var(--msi-red); margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;';
    header.innerHTML = `<span>${escapeHtml(labelText)}</span><i class="fa-solid fa-xmark" style="cursor:pointer;" onclick="closeFloatingPopover()"></i>`;
    floatingPop.appendChild(header);

    // Campo de búsqueda
    if (colKey !== '_row_color_filter') {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'popover-search-input';
        searchInput.placeholder = 'Buscar...';
        searchInput.oninput = (e) => filterPopoverList(colKey, e.target.value);
        floatingPop.appendChild(searchInput);
    }

    // Lista de Opciones
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'popover-options-list';
    optionsContainer.id = `opts-${colKey}`;

    if (colKey === '_row_color_filter') {
        const colorOptions = [
            { key: 'VERDE', label: '🟢 Verde Suave (Notificado / Concluido)' },
            { key: 'GRIS', label: '⚪ Gris Suave (Se Retiró del Almacén)' },
            { key: 'CREMA', label: '🟡 Crema Suave (En Trámite / Zarpe / RO)' },
            { key: 'ROJO', label: '🔴 Rojo Suave (Cancelado / Incautado)' }
        ];

        colorOptions.forEach(opt => {
            const item = document.createElement('label');
            item.className = 'popover-option-item';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = opt.key;
            if ((activeMultiFilters[colKey] || []).includes(opt.key)) cb.checked = true;
            cb.onchange = () => onMultiFilterChange(colKey);
            const span = document.createElement('span');
            span.textContent = opt.label;

            item.appendChild(cb);
            item.appendChild(span);
            optionsContainer.appendChild(item);
        });
    } else {
        const uniqueVals = getUniqueValuesForCol(colKey);
        if (uniqueVals.length > 0) {
            uniqueVals.forEach(val => {
                const item = document.createElement('label');
                item.className = 'popover-option-item';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.value = val;
                if ((activeMultiFilters[colKey] || []).includes(val)) cb.checked = true;
                cb.onchange = () => onMultiFilterChange(colKey);
                const span = document.createElement('span');
                span.textContent = val;

                item.appendChild(cb);
                item.appendChild(span);
                optionsContainer.appendChild(item);
            });
        } else {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = 'font-size:12px; color:#64748b; padding:10px; text-align:center;';
            emptyDiv.textContent = 'No hay valores en esta columna';
            optionsContainer.appendChild(emptyDiv);
        }
    }

    floatingPop.appendChild(optionsContainer);

    // Acciones (Seleccionar Todos / Limpiar)
    const actions = document.createElement('div');
    actions.className = 'popover-actions';
    actions.innerHTML = `
        <button class="popover-btn" onclick="selectAllMultiFilter('${colKey}', true)">Seleccionar Todos</button>
        <button class="popover-btn" onclick="selectAllMultiFilter('${colKey}', false)">Limpiar</button>
    `;
    floatingPop.appendChild(actions);

    document.body.appendChild(floatingPop);
}

function closeFloatingPopover() {
    const p = document.getElementById('floatingFilterPopover');
    if (p) p.remove();
}

function getUniqueValuesForCol(colKey) {
    const valsSet = new Set();
    if (!gridApi) return [];
    gridApi.forEachNode(n => {
        if (n.data && n.data[colKey] !== undefined && n.data[colKey] !== null) {
            const str = String(n.data[colKey]).trim();
            if (str !== '') valsSet.add(str);
        }
    });
    return Array.from(valsSet).sort();
}

function filterPopoverList(colKey, searchVal) {
    const list = document.getElementById(`opts-${colKey}`);
    if (!list) return;
    const searchLower = searchVal.toLowerCase();
    list.querySelectorAll('.popover-option-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchLower) ? 'flex' : 'none';
    });
}

function onMultiFilterChange(colKey) {
    const list = document.getElementById(`opts-${colKey}`);
    if (!list) return;
    const checkedVals = [];
    list.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
        checkedVals.push(cb.value);
    });
    activeMultiFilters[colKey] = checkedVals;
    applyMultiFilters();
}

function selectAllMultiFilter(colKey, selectAll) {
    const list = document.getElementById(`opts-${colKey}`);
    if (!list) return;
    list.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = selectAll;
    });
    onMultiFilterChange(colKey);
}

/**
 * Notifica a AG Grid que los filtros externos cambiaron de forma limpia
 */
function applyMultiFilters() {
    if (!gridApi) return;
    gridApi.onFilterChanged();
    renderMultiFiltersBar();
}

// Close popovers when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#floatingFilterPopover') && !e.target.closest('.filter-btn-trigger')) {
        closeFloatingPopover();
    }
});

// EXECUTIVE CONFIRMATION FLOATING MODAL BUILDER
function showExecutiveConfirmModal(options) {
    let modal = document.getElementById('msiExecConfirmModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'msiExecConfirmModal';
        modal.className = 'msi-exec-modal-overlay';
        document.body.appendChild(modal);
    }

    const iconClass = options.icon || 'fa-triangle-exclamation';
    const iconBg = options.iconBg || 'rgba(236, 50, 55, 0.12)';
    const iconColor = options.iconColor || '#ec3237';
    const confirmBtnClass = options.isDanger ? 'btn-exec-confirm btn-danger' : 'btn-exec-confirm';

    modal.innerHTML = `
        <div class="msi-exec-modal-card">
            <div class="msi-exec-modal-header">
                <div class="msi-exec-modal-icon-box" style="background: ${iconBg}; color: ${iconColor};">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
                <div class="msi-exec-modal-title-box">
                    <h3>${escapeHtml(options.title || 'Confirmar Acción')}</h3>
                    <p>${escapeHtml(options.subtitle || 'Sistema de Gestión Operativa MSI Logistics')}</p>
                </div>
            </div>
            <div class="msi-exec-modal-body">
                <div class="msi-exec-modal-msg">${options.message || ''}</div>
                ${options.detailHtml || ''}
            </div>
            <div class="msi-exec-modal-footer">
                <button class="btn-exec-cancel" id="execModalCancelBtn">${escapeHtml(options.cancelText || '✕ Cancelar')}</button>
                <button class="${confirmBtnClass}" id="execModalConfirmBtn">${escapeHtml(options.confirmText || '✓ Confirmar')}</button>
            </div>
        </div>
    `;

    modal.classList.add('active');

    const cancelBtn = modal.querySelector('#execModalCancelBtn');
    const confirmBtn = modal.querySelector('#execModalConfirmBtn');

    cancelBtn.onclick = () => {
        modal.classList.remove('active');
        if (typeof options.onCancel === 'function') options.onCancel();
    };

    confirmBtn.onclick = () => {
        modal.classList.remove('active');
        if (typeof options.onConfirm === 'function') options.onConfirm();
    };
}

let isRevertingCell = false;

// Inline Edit Intercepted with Executive Confirmation Modal
async function onCellValueChanged(event) {
    if (isRevertingCell) return;

    const oldValue = event.oldValue !== undefined && event.oldValue !== null ? String(event.oldValue) : '';
    const newValue = event.newValue !== undefined && event.newValue !== null ? String(event.newValue) : '';

    if (oldValue === newValue) return;

    const rowNum = event.data._row_num;
    const colName = event.colDef.headerName || event.colDef.field || 'Celda';

    showExecutiveConfirmModal({
        title: 'Confirmar Modificación de Celda',
        subtitle: `Hoja: ${currentSheetName} | Fila #${rowNum}`,
        icon: 'fa-pen-to-square',
        iconBg: 'rgba(236, 50, 55, 0.12)',
        iconColor: '#ec3237',
        message: `¿Deseas aplicar y guardar este cambio en el registro <b>#${rowNum}</b>?`,
        detailHtml: `
            <div class="confirm-diff-box">
                <div class="diff-field-name"><i class="fa-solid fa-table-columns" style="color:#ec3237; margin-right:4px;"></i> Columna: ${escapeHtml(colName)}</div>
                <div class="diff-comparison-grid">
                    <div class="diff-val-box old">
                        <span>Anterior</span>
                        <strong>${escapeHtml(oldValue || '(Vacío)')}</strong>
                    </div>
                    <i class="fa-solid fa-arrow-right diff-arrow-icon"></i>
                    <div class="diff-val-box new">
                        <span>Nuevo Valor</span>
                        <strong>${escapeHtml(newValue || '(Vacío)')}</strong>
                    </div>
                </div>
            </div>
        `,
        confirmText: '✓ Confirmar y Guardar',
        cancelText: '✕ Cancelar',
        onConfirm: async () => {
            await saveCellEditToServer(event);
        },
        onCancel: () => {
            isRevertingCell = true;
            if (event.node && event.node.data) {
                event.node.data[event.colDef.field] = event.oldValue;
            }
            if (gridApi) {
                gridApi.refreshCells({
                    rowNodes: [event.node],
                    columns: [event.colDef.field],
                    force: true
                });
            }
            setTimeout(() => { isRevertingCell = false; }, 100);
        }
    });
}

async function saveCellEditToServer(event) {
    const rowNum = event.data._row_num;
    const colKey = event.colDef.field;
    const newValue = event.newValue;
    const colIdx = parseInt(colKey.replace('col_', ''));
    const colLabel = (event.colDef.headerName || '').toUpperCase();

    if ((currentSheetName === 'Registro Cliente' || currentSheetName === 'Clientes - Consignatarios') && (colLabel.includes('NRO') || colLabel.includes('RUC') || colLabel.includes('DOCUMENTO'))) {
        const dup = findDuplicateDocument(newValue, rowNum);
        if (dup) {
            showExecutiveConfirmModal({
                title: '⚠️ ALERTA DE CLIENTE DUPLICADO',
                subtitle: 'Sistema de Verificación MSI',
                icon: 'fa-triangle-exclamation',
                iconBg: '#fee2e2',
                iconColor: '#dc2626',
                message: `El número de documento <b>${escapeHtml(newValue)}</b> ya se encuentra registrado para otro cliente en la base de datos.`,
                confirmText: 'Entendido',
                cancelText: 'Cerrar'
            });
        }
    }

    try {
        if (APPS_SCRIPT_API_URL) {
            await fetch(APPS_SCRIPT_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updateCell',
                    sp: currentSpId,
                    sheet: currentSheetName,
                    rowNum: rowNum,
                    colIdx: colIdx,
                    newValue: newValue
                })
            });
        } else {
            const response = await fetch('/api/update-cell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sp: currentSpId,
                    sheet: currentSheetName,
                    rowNum: rowNum,
                    colKey: colKey,
                    newValue: newValue
                })
            });
            const res = await response.json();
            if (!res.success) {
                showExecutiveConfirmModal({
                    title: 'Error de Actualización',
                    icon: 'fa-circle-xmark',
                    iconBg: '#fee2e2',
                    iconColor: '#dc2626',
                    message: res.message,
                    confirmText: 'Aceptar',
                    cancelText: 'Cerrar'
                });
            }
        }
    } catch (err) {
        console.error('Error saving cell edit:', err);
    }
}

function findDuplicateDocument(docVal, excludeRowNum = null) {
    if (!docVal || !gridApi) return false;
    const cleanDoc = String(docVal).replace(/[^0-9A-Za-z]/g, '').toLowerCase();
    if (!cleanDoc) return false;

    let isDuplicate = false;
    gridApi.forEachNode(node => {
        if (isDuplicate || !node.data) return;
        if (excludeRowNum && node.data._row_num === excludeRowNum) return;

        Object.keys(node.data).forEach(k => {
            if (k.startsWith('col_')) {
                const val = node.data[k];
                if (val) {
                    const cleanVal = String(val).replace(/[^0-9A-Za-z]/g, '').toLowerCase();
                    if (cleanVal === cleanDoc) {
                        isDuplicate = true;
                    }
                }
            }
        });
    });

    return isDuplicate;
}

// Load Data into Grid
async function loadGridData(search = '') {
    if (gridApi) gridApi.showLoadingOverlay();

    try {
        let url = `/api/data?sp=${currentSpId}&sheet=${encodeURIComponent(currentSheetName)}&pageSize=1000&search=${encodeURIComponent(search)}`;
        if (APPS_SCRIPT_API_URL) {
            url = `${APPS_SCRIPT_API_URL}?sp=${encodeURIComponent(currentSpId)}&sheet=${encodeURIComponent(currentSheetName)}&pageSize=1000&search=${encodeURIComponent(search)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.columns && data.columns.length > 0) {
            currentColsConfig = data.columns;
            initAgGrid(data.columns);
        }

        if (data.rows) {
            // Cargar color manual guardado para cada fila
            data.rows.forEach(r => {
                if (r._row_num) {
                    const savedCol = getSavedManualColor(currentSheetName, r._row_num, r);
                    if (savedCol && savedCol !== 'AUTOMATICO') {
                        r._manual_color = savedCol;
                    }
                }
            });

            gridApi.setGridOption('rowData', data.rows);
            document.getElementById('gridRowCounter').textContent = `Total Registros: ${data.totalRows}`;
            renderMultiFiltersBar();
        } else {
            gridApi.showNoRowsOverlay();
        }

        if (data.needsConfig) {
            alert('Reemplaza los IDs de tus Google Sheets en api/Code.gs para conectar con los datos de Google Sheets en vivo.');
        }
    } catch (err) {
        console.error('Error loading grid data:', err);
        if (gridApi) gridApi.showNoRowsOverlay();
    }
}

function onSearchInput(val) {
    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(() => {
        if (gridApi) {
            gridApi.setGridOption('quickFilterText', val);
        }
    }, 250);
}

function refreshCurrentSheet() {
    loadGridData();
}

/**
 * Abre el Modal Form (Editar Registro) asegurando buscar el nodo por su _row_num exacto del Spreadsheet
 */
function editRecord(rowNum) {
    currentEditRowNum = rowNum;
    const rowNode = getRowNodeByRowNum(rowNum);
    const rowData = rowNode ? rowNode.data : {};

    document.getElementById('modalTitle').textContent = `Editar Registro #${rowNum} - ${currentSheetName}`;
    const fieldsContainer = document.getElementById('modalFormFields');

    let html = '';

    // CAMPO ADICIONAL: SELECCIÓN MANUAL DE COLOR DE FILA
    const currentManualColor = getSavedManualColor(currentSheetName, rowNum, rowData);
    html += `<div class="form-group" style="grid-column: span 2; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1.5px solid #cbd5e1;">`;
    html += `<label style="color: var(--msi-red); font-weight: 800;"><i class="fa-solid fa-palette"></i> Color Personalizado para la Fila</label>`;
    html += `<select class="form-control" name="_manual_color" style="font-weight: 700;">`;
    html += `<option value="AUTOMATICO" ${currentManualColor === 'AUTOMATICO' ? 'selected' : ''}>⚡ Automático (Según Estado / Operaciones)</option>`;
    html += `<option value="VERDE" ${currentManualColor === 'VERDE' ? 'selected' : ''}>🟢 Verde Suave (Derivado a Operaciones / Concluido)</option>`;
    html += `<option value="GRIS" ${currentManualColor === 'GRIS' ? 'selected' : ''}>⚪ Gris Suave (Se Retiró del Almacén)</option>`;
    html += `<option value="CREMA" ${currentManualColor === 'CREMA' ? 'selected' : ''}>🟡 Crema / Amarillo Suave (En Trámite / Zarpe / RO)</option>`;
    html += `<option value="ROJO" ${currentManualColor === 'ROJO' ? 'selected' : ''}>🔴 Rojo Suave (Cancelado / Incautado)</option>`;
    html += `</select>`;
    html += `</div>`;

    currentColsConfig.forEach(c => {
        const labelUpper = (c.label || '').toUpperCase();
        const isAuto = c.auto || (labelUpper.includes('MARCA TEMPORAL') || labelUpper === 'ID' || labelUpper === 'CODIGO_CLIENTE');
        const opts = getOptionsForColumn(c.label, currentSheetName);
        const isSelect = opts.length > 0;

        html += `<div class="form-group">`;
        html += `<label>${c.label}${isAuto ? ' (Autogenerado)' : ''}</label>`;

        let currentVal = rowData[c.key] !== undefined ? rowData[c.key] : '';

        if (isAuto) {
            html += `<input type="text" class="form-control" name="${c.key}" value="${escapeHtml(currentVal)}" readonly style="background:#f1f5f9;">`;
        } else if (isSelect) {
            html += `<select class="form-control" name="${c.key}">`;
            html += `<option value="">Seleccionar...</option>`;
            opts.forEach(opt => {
                const sel = (String(opt).trim() === String(currentVal).trim()) ? 'selected' : '';
                html += `<option value="${escapeHtml(opt)}" ${sel}>${escapeHtml(opt)}</option>`;
            });
            html += `</select>`;
        } else {
            const isDoc = (labelUpper.includes('NRO') || labelUpper.includes('RUC') || labelUpper.includes('DOCUMENTO'));
            html += `<input type="text" class="form-control ${isDoc ? 'doc-input-field' : ''}" name="${c.key}" value="${escapeHtml(currentVal)}" ${isDoc ? `oninput="checkDocDuplicate(this, ${rowNum})"` : ''}>`;
            if (isDoc) {
                html += `<div id="docDupWarning" style="display:none; color:#dc2626; font-size:11.5px; font-weight:600; margin-top:4px;">⚠️ ¡ALERTA! El cliente con este número de documento ya se encuentra registrado.</div>`;
            }
        }
        html += `</div>`;
    });

    fieldsContainer.innerHTML = html;
    document.getElementById('recordModal').classList.add('active');
}

function checkDocDuplicate(inputEl, excludeRowNum = null) {
    const val = inputEl.value;
    const warnEl = document.getElementById('docDupWarning');
    if (!warnEl) return;

    if (val && findDuplicateDocument(val, excludeRowNum)) {
        warnEl.style.display = 'block';
        inputEl.style.borderColor = '#dc2626';
    } else {
        warnEl.style.display = 'none';
        inputEl.style.borderColor = '#e2e8f0';
    }
}

function deleteRecord(rowNum) {
    showExecutiveConfirmModal({
        title: '⚠️ Confirmar Eliminación',
        subtitle: `Hoja: ${currentSheetName} | Fila #${rowNum}`,
        icon: 'fa-trash-can',
        iconBg: '#fee2e2',
        iconColor: '#dc2626',
        isDanger: true,
        message: `¿Estás seguro de que deseas eliminar permanentemente el registro <b>#${rowNum}</b> de la hoja <b>${escapeHtml(currentSheetName)}</b>?`,
        detailHtml: `<div style="font-size:12px; color:#991b1b; background:#fef2f2; padding:10px 12px; border-radius:8px; border:1px solid #fecaca; margin-top:10px;"><i class="fa-solid fa-triangle-exclamation" style="margin-right:4px;"></i> Esta acción eliminará la fila de la base de datos de Google Sheets y no se podrá recuperar.</div>`,
        confirmText: '🗑️ Eliminar Registro',
        cancelText: '✕ Cancelar',
        onConfirm: () => {
            executeDeleteRow(rowNum);
        }
    });
}

function executeDeleteRow(rowNum) {
    try {
        if (APPS_SCRIPT_API_URL) {
            fetch(APPS_SCRIPT_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'deleteRow',
                    sp: currentSpId,
                    sheet: currentSheetName,
                    rowNum: rowNum
                })
            });
            loadGridData();
        } else {
            fetch('/api/delete-row', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sp: currentSpId,
                    sheet: currentSheetName,
                    rowNum: rowNum
                })
            }).then(r => r.json()).then(res => {
                if (res.success) loadGridData();
                else alert('Error eliminando fila: ' + res.message);
            });
        }
    } catch (err) {
        console.error('Error deleting record:', err);
    }
}

function openNewRecordModal() {
    currentEditRowNum = null;
    if (!currentColsConfig.length) {
        alert('Por favor selecciona una hoja primero.');
        return;
    }

    document.getElementById('modalTitle').textContent = `Nuevo Registro - ${currentSheetName}`;
    const fieldsContainer = document.getElementById('modalFormFields');

    let html = '';

    // CAMPO ADICIONAL: SELECCIÓN MANUAL DE COLOR DE FILA
    html += `<div class="form-group" style="grid-column: span 2; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1.5px solid #cbd5e1;">`;
    html += `<label style="color: var(--msi-red); font-weight: 800;"><i class="fa-solid fa-palette"></i> Color Personalizado para la Fila</label>`;
    html += `<select class="form-control" name="_manual_color" style="font-weight: 700;">`;
    html += `<option value="AUTOMATICO">⚡ Automático (Según Estado / Operaciones)</option>`;
    html += `<option value="VERDE">🟢 Verde Suave (Derivado a Operaciones / Concluido)</option>`;
    html += `<option value="GRIS">⚪ Gris Suave (Se Retiró del Almacén)</option>`;
    html += `<option value="CREMA">🟡 Crema / Amarillo Suave (En Trámite / Zarpe / RO)</option>`;
    html += `<option value="ROJO">🔴 Rojo Suave (Cancelado / Incautado)</option>`;
    html += `</select>`;
    html += `</div>`;

    currentColsConfig.forEach(c => {
        const labelUpper = (c.label || '').toUpperCase();
        const isAuto = c.auto || (labelUpper.includes('MARCA TEMPORAL') || labelUpper === 'ID' || labelUpper === 'CODIGO_CLIENTE');
        if (isAuto) return;

        const opts = getOptionsForColumn(c.label, currentSheetName);
        const isSelect = opts.length > 0;

        html += `<div class="form-group">`;
        html += `<label>${c.label}</label>`;

        if (isSelect) {
            html += `<select class="form-control" name="${c.key}">`;
            html += `<option value="">Seleccionar...</option>`;
            opts.forEach(opt => {
                html += `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`;
            });
            html += `</select>`;
        } else {
            const isDoc = (labelUpper.includes('NRO') || labelUpper.includes('RUC') || labelUpper.includes('DOCUMENTO'));
            html += `<input type="text" class="form-control ${isDoc ? 'doc-input-field' : ''}" name="${c.key}" ${isDoc ? 'oninput="checkDocDuplicate(this)"' : ''}>`;
            if (isDoc) {
                html += `<div id="docDupWarning" style="display:none; color:#dc2626; font-size:11.5px; font-weight:600; margin-top:4px;">⚠️ ¡ALERTA! El cliente con este número de documento ya se encuentra registrado.</div>`;
            }
        }
        html += `</div>`;
    });

    fieldsContainer.innerHTML = html;
    document.getElementById('recordModal').classList.add('active');
}

function closeRecordModal() {
    document.getElementById('recordModal').classList.remove('active');
}

async function submitModalForm() {
    const form = document.getElementById('modalForm');
    const formData = new FormData(form);
    const data = {};

    formData.forEach((val, key) => {
        data[key] = val;
    });

    if (currentSheetName === 'Registro Cliente' || currentSheetName === 'Clientes - Consignatarios') {
        let docVal = '';
        Object.keys(data).forEach(k => {
            const colDef = currentColsConfig.find(c => c.key === k);
            if (colDef && colDef.label) {
                const lUpper = colDef.label.toUpperCase();
                if (lUpper.includes('NRO') || lUpper.includes('RUC') || lUpper.includes('DOCUMENTO')) {
                    docVal = data[k];
                }
            }
        });

        if (docVal && findDuplicateDocument(docVal, currentEditRowNum)) {
            const proceed = confirm(`⚠️ ¡ALERTA DE DUPLICADO!\n\nEl cliente con número de documento (${docVal}) YA SE ENCUENTRA REGISTRADO en el sistema.\n\n¿Estás seguro de que deseas guardar este registro de todas formas?`);
            if (!proceed) return;
        }
    }

    // Guardar asignación manual de color persistentemente
    if (data._manual_color && currentEditRowNum) {
        saveManualColor(currentSheetName, currentEditRowNum, data._manual_color);
    }

    try {
        const actionType = currentEditRowNum ? 'updateRow' : 'addRow';
        const payload = {
            action: actionType,
            sp: currentSpId,
            sheet: currentSheetName,
            rowNum: currentEditRowNum,
            data: data
        };

        if (APPS_SCRIPT_API_URL) {
            await fetch(APPS_SCRIPT_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            closeRecordModal();
            loadGridData();
        } else {
            const endpoint = currentEditRowNum ? '/api/update-row' : '/api/add-row';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const res = await response.json();
            if (res.success) {
                closeRecordModal();
                loadGridData();
            } else alert('Error al guardar registro: ' + res.message);
        }
    } catch (err) {
        console.error('Error submitting form:', err);
    }
}

async function fetchDashboardStats() {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;
    try {
        let url = '/api/stats';
        if (APPS_SCRIPT_API_URL) return;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            let html = '';
            const sps = [
                { id: 'registro_servicios', title: 'Registro de Servicios', icon: 'fa-ship', color: 'red' },
                { id: 'base_datos_operativa', title: 'Base Datos Operativa', icon: 'fa-database', color: 'purple' },
                { id: 'registro_importaciones', title: 'Registro Importaciones', icon: 'fa-file-invoice-dollar', color: 'blue' }
            ];

            sps.forEach(sp => {
                const sheetStats = data.stats[sp.id] || {};
                let total = 0;
                Object.values(sheetStats).forEach(c => total += c);

                html += `
                    <div class="stat-card">
                        <div class="stat-icon ${sp.color}">
                            <i class="fa-solid ${sp.icon}"></i>
                        </div>
                        <div class="stat-info">
                            <h4>${sp.title}</h4>
                            <div class="num">${total.toLocaleString()} regs</div>
                            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
                                ${Object.keys(sheetStats).length} hojas en total
                            </div>
                        </div>
                    </div>
                `;
            });

            statsGrid.innerHTML = html;
        }
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
