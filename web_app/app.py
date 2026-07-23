from flask import Flask, render_template, request, jsonify
import sys
import os
import time
from collections import defaultdict

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

from config import SPREADSHEETS, OPERATIVA_SUBCATS
from data_manager import db

app = Flask(__name__, template_folder="templates", static_folder="static")

# Rate Limiting de peticiones por IP
IP_REQUEST_LOG = defaultdict(list)
MAX_REQUESTS_PER_MINUTE = 120

@app.before_request
def check_rate_limit():
    client_ip = request.remote_addr or "127.0.0.1"
    now = time.time()
    timestamps = IP_REQUEST_LOG[client_ip]
    
    # Filtrar peticiones más antiguas a 60 segundos
    IP_REQUEST_LOG[client_ip] = [ts for ts in timestamps if now - ts < 60]
    
    if len(IP_REQUEST_LOG[client_ip]) >= MAX_REQUESTS_PER_MINUTE:
        return jsonify({"success": False, "message": "Límite de frecuencia de peticiones alcanzado (Rate Limit)."}), 429
    
    IP_REQUEST_LOG[client_ip].append(now)

# Cabeceras de Seguridad HTTP (Security Headers)
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Content-Security-Policy'] = (
        "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';"
    )
    return response

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/catalog")
def get_catalog():
    catalog = []

    # 1. Registro de Servicios (Cuadro de Embarque)
    servicios_meta = SPREADSHEETS["registro_servicios"]
    catalog.append({
        "id": servicios_meta["id"],
        "title": servicios_meta["title"],
        "icon": servicios_meta["icon"],
        "type": "flat",
        "sheets": [
            {"name": sname, "label": sname, "icon": smeta.get("icon", "fa-table"), "cols": smeta["columns"]}
            for sname, smeta in servicios_meta["sheets"].items()
        ]
    })

    # 2. Base Datos Operativa (Hierarchical with 4 subcategories)
    operativa_meta = SPREADSHEETS["base_datos_operativa"]
    op_groups = []
    for subcat in OPERATIVA_SUBCATS:
        group_sheets = []
        for sname in subcat["sheets"]:
            if sname in operativa_meta["sheets"]:
                smeta = operativa_meta["sheets"][sname]
                group_sheets.append({"name": sname, "label": sname, "icon": smeta.get("icon", "fa-table"), "cols": smeta["columns"]})
        op_groups.append({
            "key": subcat["key"],
            "label": subcat["label"],
            "sheets": group_sheets
        })
    catalog.append({
        "id": operativa_meta["id"],
        "title": operativa_meta["title"],
        "icon": operativa_meta["icon"],
        "type": "grouped",
        "groups": op_groups
    })

    # 3. Registro Importaciones
    importaciones_meta = SPREADSHEETS["registro_importaciones"]
    catalog.append({
        "id": importaciones_meta["id"],
        "title": importaciones_meta["title"],
        "icon": importaciones_meta["icon"],
        "type": "flat",
        "sheets": [
            {"name": sname, "label": sname, "icon": smeta.get("icon", "fa-table"), "cols": smeta["columns"]}
            for sname, smeta in importaciones_meta["sheets"].items()
        ]
    })

    return jsonify({"success": True, "catalog": catalog})

@app.route("/api/data")
def get_data():
    sp_id = request.args.get("sp", "registro_servicios")
    sheet_name = request.args.get("sheet", "Registro Cliente")
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("pageSize", 25))
    search = request.args.get("search", "")
    sort_by = request.args.get("sortBy", None)
    sort_dir = request.args.get("sortDir", "asc")

    try:
        res = db.get_sheet_data(sp_id, sheet_name, page, page_size, search, sort_by, sort_dir)
        return jsonify(res)
    except Exception as e:
        return jsonify({"rows": [], "totalRows": 0, "error": "Error consultando datos."}), 400

@app.route("/api/update-cell", methods=["POST"])
def update_cell():
    payload = request.json or {}
    sp_id = payload.get("sp")
    sheet_name = payload.get("sheet")
    row_num = payload.get("rowNum")
    col_key = payload.get("colKey")
    new_val = payload.get("newValue")

    if not all([sp_id, sheet_name, row_num, col_key]):
        return jsonify({"success": False, "message": "Faltan parámetros requeridos."}), 400

    try:
        res = db.update_cell(sp_id, sheet_name, int(row_num), col_key, new_val)
        return jsonify(res)
    except Exception as e:
        return jsonify({"success": False, "message": "Error al actualizar la celda."}), 400

@app.route("/api/add-row", methods=["POST"])
def add_row():
    payload = request.json or {}
    sp_id = payload.get("sp")
    sheet_name = payload.get("sheet")
    row_data = payload.get("data", {})

    if not all([sp_id, sheet_name]):
        return jsonify({"success": False, "message": "Parámetros requeridos faltantes."}), 400

    try:
        res = db.add_row(sp_id, sheet_name, row_data)
        return jsonify(res)
    except Exception as e:
        return jsonify({"success": False, "message": "Error al agregar el registro."}), 400

@app.route("/api/delete-row", methods=["POST"])
def delete_row():
    payload = request.json or {}
    sp_id = payload.get("sp")
    sheet_name = payload.get("sheet")
    row_num = payload.get("rowNum")

    if not all([sp_id, sheet_name, row_num]):
        return jsonify({"success": False, "message": "Parámetros requeridos faltantes."}), 400

    try:
        res = db.delete_row(sp_id, sheet_name, int(row_num))
        return jsonify(res)
    except Exception as e:
        return jsonify({"success": False, "message": "Error al eliminar la fila."}), 400

@app.route("/api/stats")
def get_stats():
    try:
        stats = db.get_all_stats()
        return jsonify({"success": True, "stats": stats})
    except Exception as e:
        return jsonify({"success": False, "error": "Error obteniendo estadísticas."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)

