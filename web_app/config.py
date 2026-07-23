import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)

OPERATIVA_SHEETS = {
    "Clientes - Consignatarios": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Informativo",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "SERVICIO",
                "type": "select",
                "editable": True,
                "options": [
                    "ADUANA Y CARGA",
                    "ADUANAS",
                    "CARGA",
                    "CURRIER",
                    "DIRECCIONAMIENTO",
                    "OTROS"
                ]
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RUC",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "RAZON SOCIAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "CONTACTO",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "DIRECCION",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "TELEFONO",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CORREO",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "DIRECCION DE DESCARGA",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    },
    "Comerciales - MSI": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Informativo",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "select",
                "editable": True,
                "options": [
                    "2025-11-04 12:18:21.185000",
                    "2025-11-04 15:03:18.383000",
                    "2025-11-04 17:15:55.628000",
                    "2025-12-11 14:42:01.635000"
                ]
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "select",
                "editable": True,
                "options": [
                    "MSI-001",
                    "MSI-002",
                    "MSI-003",
                    "MSI-004",
                    "MSI-005"
                ]
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "NOMBRES COMPLETOS",
                "type": "select",
                "editable": True,
                "options": [
                    "CESAR AUGUSTO DE LA CRUZ SOLANO",
                    "GIANPIERRE GARCIA YBAÑEZ",
                    "JADE VEGA VEGA",
                    "MARY SOLANO FRANKLIN",
                    "MSI ADUANAS PERU CARGO  SAC"
                ]
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "DNI",
                "type": "select",
                "editable": True,
                "options": [
                    "09888297",
                    "206097999316.0",
                    "70920196.0",
                    "73828099.0",
                    "74972184.0"
                ]
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CELULAR",
                "type": "select",
                "editable": True,
                "options": [
                    "908 889 702",
                    "936 754 446",
                    "936754446.0",
                    "983 450 915",
                    "987824802.0"
                ]
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "select",
                "editable": True,
                "options": [
                    "19173662881048.0",
                    "1919897990094.0",
                    "19202197238031.0"
                ]
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "select",
                "editable": True,
                "options": [
                    "19170184994031.0",
                    "1929950072186.0",
                    "NO TIENE"
                ]
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "DIRECCION",
                "type": "select",
                "editable": True,
                "options": [
                    "JR PIO TRISTAN 404 URB LOS LIBERTADORES-SAN MARTIN DE PORRES",
                    "JR. PIO TRISTAN 404 URB. LOS LIBERTADORES   SAN MARTIN DE PORRES SAN MARTIN DE PORRES - LIMA"
                ]
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CORREO",
                "type": "select",
                "editable": True,
                "options": [
                    "Garciagianpierre706@gmail.com",
                    "comercial@msiaduanasperucargo.pe",
                    "jvega@msiaduanasperucargo.pe",
                    "marysol@mocayasaduanera.com"
                ]
            }
        ]
    },
    "Comerciales Oper. - Logis.": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Informativo",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "select",
                "editable": True,
                "options": [
                    "2025-11-04 15:33:47.151000",
                    "2025-11-04 15:38:05.385000",
                    "2025-11-04 15:40:54.181000",
                    "2025-11-04 15:44:48.084000",
                    "2025-11-04 15:46:41.043000",
                    "2025-11-04 16:08:26.776000",
                    "2025-11-04 16:44:47.545000",
                    "2025-11-04 16:52:34.158000",
                    "2025-11-04 17:11:03.489000",
                    "2025-11-04 17:21:28.029000"
                ]
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "select",
                "editable": True,
                "options": [
                    "COPL-MSI-001",
                    "COPL-MSI-0010",
                    "COPL-MSI-002",
                    "COPL-MSI-003",
                    "COPL-MSI-004",
                    "COPL-MSI-005",
                    "COPL-MSI-006",
                    "COPL-MSI-007",
                    "COPL-MSI-008",
                    "COPL-MSI-009"
                ]
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "NOMBRES COMPLETOS",
                "type": "select",
                "editable": True,
                "options": [
                    "AARON CUEVA",
                    "ALESSANDRA CALLAN",
                    "ALVARO VILCHEZ",
                    "ANDRES VILCHEZ",
                    "GENESIS GONZALES",
                    "GERALDINE ENCINAS",
                    "ITALO CUEVA",
                    "JESUS ARAUJO",
                    "JHONATAN GONZALES",
                    "MIGUEL CABALLERO"
                ]
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "DNI",
                "type": "select",
                "editable": True,
                "options": [
                    "20605271953.0",
                    "20610081887.0"
                ]
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CELULAR",
                "type": "select",
                "editable": True,
                "options": [
                    "917359627.0",
                    "918955232.0",
                    "929589512.0",
                    "953104788.0",
                    "9604456324.0",
                    "961229867.0",
                    "974175340.0",
                    "977895082.0",
                    "980085799.0",
                    "984977474.0"
                ]
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "CORREO",
                "type": "select",
                "editable": True,
                "options": [
                    "acallan@cargaglobalperu.com",
                    "acueva@goldperucargo.com",
                    "avilchez@goldperucargo.com",
                    "gencinas@goldperucargo.com",
                    "ggonzalez@goldperucargo.com",
                    "jaraujo@goldperucargo.com",
                    "jcueva@cargaglobalperu.com",
                    "jgonzales@cargaglobalperu.com",
                    "mcaballero@cargaglobalperu.com",
                    "pricing@goldperucargo.com"
                ]
            }
        ]
    },
    "Agentes Carga": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Carga",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "select",
                "editable": True,
                "options": [
                    "2025-10-30 17:55:08.219000",
                    "2025-10-30 18:18:42.089000",
                    "2025-11-03 12:27:49.394000",
                    "2025-11-03 12:42:16.842000",
                    "2025-11-03 12:54:28.956000",
                    "2025-11-03 13:06:54.165000"
                ]
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "select",
                "editable": True,
                "options": [
                    "AG-MSI-001",
                    "AG-MSI-002",
                    "AG-MSI-003",
                    "AG-MSI-004",
                    "AG-MSI-005",
                    "AG-MSI-006"
                ]
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "select",
                "editable": True,
                "options": [
                    "20510049226.0",
                    "20554893784.0",
                    "20556788716.0",
                    "20601758688.0",
                    "20602567096.0",
                    "20607835951.0"
                ]
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "select",
                "editable": True,
                "options": [
                    "CHARTER LINK LOGISTICS PERU S.A.C",
                    "CRAFT MULTIMODAL PERU S.A.",
                    "Kln Freight Peru S.a.C",
                    "MSL DEL PERU SAC",
                    "SOUTHCARGO PERU S.A.C.",
                    "Transocean Logistics Corporation S.a.C."
                ]
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "Betzabé Ventura E.",
                    "Diana Gutierrez",
                    "Elmer Cruz",
                    "Jimmy De La Cruz",
                    "Paola Ñufflo",
                    "Yessica García"
                ]
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "select",
                "editable": True,
                "options": [
                    "Av. Calle Ugarte y Moscoso Nro. 991 Int. 201 (Oficina 201)",
                    "Av. Circunvalacion del Club Golf Los Inkas Nro 154 int. 1901 Santiago de Surco",
                    "Av. Miroquesada Nro. 425 Int. 905",
                    "Av. del Pinar Nro. 180 Int. 406 Santiago de Surco",
                    "CAL. AMADOR MERINO 465 DPTO. 501 LIMA LIMA SAN ISIDRO",
                    "PQ. MANUEL GONZALES PRADA 379 LIMA LIMA MAGDALENA DEL MAR"
                ]
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "914 100 791",
                    "965 408 632",
                    "981 116 402",
                    "987 573 415",
                    "987 832 111",
                    "999 265 461"
                ]
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "betzabe.ventura@ctl-latam.com",
                    "diana.gutierrez@craftmulti.com",
                    "ecruz@mslcorporate.com.pe",
                    "jimmy.delacruz@southcargo.com",
                    "pns@tpsac.com.pe",
                    "yessica.garcia@kln.com"
                ]
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "select",
                "editable": True,
                "options": [
                    "011-350-000100030911-60",
                    "193-1472395-0-75",
                    "193-2166754-0-02",
                    "193-2411126-0-07",
                    "193-9404393-0-67",
                    "194-9353709-0-96"
                ]
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "select",
                "editable": True,
                "options": [
                    "192-2165906-1-46",
                    "193-1475693-1-98",
                    "193-1935464-1-50",
                    "193-2393490-1-75",
                    "193-9296453-1-73",
                    "194-9744677-1-88"
                ]
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "CONTACTO OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "Jose Hidalgo",
                    "Maria Alejandra Nieto Riojas",
                    "Patricio.Veratudela@kln.com",
                    "desglose.endosefwd@mslcorporate.com.pe",
                    "judith.calderon@southcargo.com",
                    "rzo@tpsac.com.pe"
                ]
            },
            {
                "col": 12,
                "key": "col_12",
                "label": "CELULAR OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "-",
                    "941 683 470",
                    "957 054 589",
                    "964 212 432",
                    "974 286 638",
                    "983 396 841"
                ]
            },
            {
                "col": 13,
                "key": "col_13",
                "label": "CONTACTO CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    "Margaret.Rodriguez@kln.com",
                    "VARIOS",
                    "cpm@tpsac.com.pe",
                    "varios"
                ]
            },
            {
                "col": 14,
                "key": "col_14",
                "label": "CELULAR CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    "944 101 721",
                    "981 078 696",
                    "VARIOS"
                ]
            },
            {
                "col": 15,
                "key": "col_15",
                "label": "CONTACTO FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    "-",
                    "ATENCIÓN VIRTUAL",
                    "Brigith Carbonell C.",
                    "Karol.Marengo@kln.com",
                    "jme@tpsac.com.pe",
                    "vbmaritimo@mslcorporate.com.pe"
                ]
            },
            {
                "col": 16,
                "key": "col_16",
                "label": "CELULAR FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    "-",
                    "915 368 889",
                    "983 137 409"
                ]
            },
            {
                "col": 17,
                "key": "col_17",
                "label": "OTRO CONTACTO",
                "type": "select",
                "editable": True,
                "options": [
                    "-",
                    "atencionvirtual.peru@craftmulti.com",
                    "tm.caja.callao@tpsac.com.pe"
                ]
            }
        ]
    },
    "Operador Logístico": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Carga",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "select",
                "editable": True,
                "options": [
                    "OPL-MSI-001",
                    "OPL-MSI-002"
                ]
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "select",
                "editable": True,
                "options": [
                    "20605271953.0",
                    "20610081887.0"
                ]
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "select",
                "editable": True,
                "options": [
                    "CARGA GLOBAL PERU SAC",
                    "GOLD PERU CARGO SAC"
                ]
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "ALVARO VILCHEZ",
                    "Jhonatan Gonzales"
                ]
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "select",
                "editable": True,
                "options": [
                    "Av. Proceres de la independencia 3437 - SJL",
                    "Mza. D1 Lote. 10 a.H. Juan Pablo - SJL"
                ]
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "917 359 627",
                    "984 977 474"
                ]
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "avilchez@goldperucargo.com",
                    "jgonzales@cargaglobalperu.com"
                ]
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "select",
                "editable": True,
                "options": [
                    "191-7209876-0-28",
                    "191-9396952-0-04"
                ]
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "select",
                "editable": True,
                "options": [
                    "191-7209885-1-29",
                    "191-8143025-1-86"
                ]
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "CONTACTO OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "Marco Dueñas",
                    "Rosa Lizana"
                ]
            },
            {
                "col": 12,
                "key": "col_12",
                "label": "CELULAR OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "910655668.0",
                    "918 604 314"
                ]
            },
            {
                "col": 13,
                "key": "col_13",
                "label": "CONTACTO CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    "Marilyn Ascona",
                    "Susan Mamani"
                ]
            },
            {
                "col": 14,
                "key": "col_14",
                "label": "CELULAR CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    "944251709.0",
                    "949 337 605"
                ]
            },
            {
                "col": 15,
                "key": "col_15",
                "label": "CONTACTO FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    "Paul Flores",
                    "Poldark Gonzales"
                ]
            },
            {
                "col": 16,
                "key": "col_16",
                "label": "CELULAR FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    "929657228.0",
                    "993 852 405"
                ]
            },
            {
                "col": 17,
                "key": "col_17",
                "label": "OTRO CONTACTO",
                "type": "select",
                "editable": True,
                "options": [
                    "940 239 11",
                    "Ninguno"
                ]
            }
        ]
    },
    "Seguro Carga": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Carga",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "CONTACTO OPERATIVO",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 12,
                "key": "col_12",
                "label": "CELULAR OPERATIVO",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 13,
                "key": "col_13",
                "label": "CONTACTO CUSTOMER",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 14,
                "key": "col_14",
                "label": "CELULAR CUSTOMER",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 15,
                "key": "col_15",
                "label": "CONTACTO FINANZAS - FACTURACIÓN",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 16,
                "key": "col_16",
                "label": "CELULAR FINANZAS - FACTURACIÓN",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 17,
                "key": "col_17",
                "label": "OTRO CONTACTO",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    },
    "Agencia de Aduana": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Operaciones",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "CONTACTO OPERATIVO",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 12,
                "key": "col_12",
                "label": "CELULAR OPERATIVO",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 13,
                "key": "col_13",
                "label": "CONTACTO CUSTOMER",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 14,
                "key": "col_14",
                "label": "CELULAR CUSTOMER",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 15,
                "key": "col_15",
                "label": "CONTACTO FINANZAS - FACTURACIÓN",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 16,
                "key": "col_16",
                "label": "CELULAR FINANZAS - FACTURACIÓN",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 17,
                "key": "col_17",
                "label": "OTRO CONTACTO",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    },
    "Emp. Transporte Local": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Operaciones",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "select",
                "editable": True,
                "options": [
                    "2025-11-03 17:09:09.516000",
                    "2025-11-03 17:12:57.625000"
                ]
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "select",
                "editable": True,
                "options": [
                    "ETL-MSI-001",
                    "ETL-MSI-002"
                ]
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "select",
                "editable": True,
                "options": [
                    "10095211165.0",
                    "20601941717.0"
                ]
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "select",
                "editable": True,
                "options": [
                    "OPERADOR LOGISTICO PAUL S.A.C",
                    "TRANSPORTES LEON CARLITOS"
                ]
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "Henry Sauñe",
                    "LEON DE LA CRUZ MARCIAL"
                ]
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "select",
                "editable": True,
                "options": [
                    "CAL. 06 URB. LAS FLORES DE SANTA ROSA MZA. V LOTE. 14 SAN MARTIN DE PORRES - LIMA - LIMA",
                    "I ETAPA URB. ALBINO HERRERA MZA. E LOTE. 25 AV. PACASMAYO CDRA8 CEN SOR ANA DE LOS A"
                ]
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "981 120 547",
                    "998 319 593"
                ]
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "atencion@operadorlogisticopaul.com",
                    "transleoncarlitos@gmail.com"
                ]
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "select",
                "editable": True,
                "options": [
                    "192-12960970-0-87",
                    "192-2409856-0-78"
                ]
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "select",
                "editable": True,
                "options": [
                    "NO TIENE",
                    "no tiene"
                ]
            }
        ]
    },
    "Deposito Aduanero": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Operaciones",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "CONTACTO OPERATIVO",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 12,
                "key": "col_12",
                "label": "CELULAR OPERATIVO",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 13,
                "key": "col_13",
                "label": "CONTACTO CUSTOMER",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 14,
                "key": "col_14",
                "label": "CELULAR CUSTOMER",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 15,
                "key": "col_15",
                "label": "CONTACTO FINANZAS - FACTURACIÓN",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 16,
                "key": "col_16",
                "label": "CELULAR FINANZAS - FACTURACIÓN",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 17,
                "key": "col_17",
                "label": "OTRO CONTACTO",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    },
    "Almacén Temporal": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Operaciones",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "select",
                "editable": True,
                "options": [
                    "2025-10-31 12:14:33.266000",
                    "2025-11-03 14:29:15.303000",
                    "2025-11-03 15:01:19.509000",
                    "2025-11-03 15:48:21.884000",
                    "2025-11-03 16:21:06.269000",
                    "2025-11-04 11:45:56.225000",
                    "2025-11-04 11:50:33.960000",
                    "2025-11-04 12:47:51.474000",
                    "2025-11-04 12:53:36.036000",
                    "2025-11-04 14:36:48.968000",
                    "2025-11-04 15:59:04.665000",
                    "2025-11-21 15:48:05.386000"
                ]
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "select",
                "editable": True,
                "options": [
                    "AT-MSI-001",
                    "AT-MSI-0010",
                    "AT-MSI-0011",
                    "AT-MSI-0012",
                    "AT-MSI-002",
                    "AT-MSI-003",
                    "AT-MSI-004",
                    "AT-MSI-005",
                    "AT-MSI-006",
                    "AT-MSI-007",
                    "AT-MSI-008",
                    "AT-MSI-009"
                ]
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "select",
                "editable": True,
                "options": [
                    "20100010217.0",
                    "20100039207.0",
                    "20101520898.0",
                    "20259171891.0",
                    "20347646891.0",
                    "20392952455.0",
                    "20427919111.0",
                    "20508782013.0",
                    "20513462388.0",
                    "20535972894.0",
                    "20605786937.0",
                    "20606777257.0"
                ]
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "select",
                "editable": True,
                "options": [
                    "ALMACENES FORWARDER S.A.C.",
                    "CONTRANS S.A.C.",
                    "DINET S.A.",
                    "DP WORLD CALLAO S.R.L.",
                    "DP WORLD LOGISTICS S.R.L.",
                    "FARGOLINE SOCIEDAD ANONIMA - FARGOLINE S.A.",
                    "INVERS.MARITIMAS UNIVERSALES PERU S.A",
                    "MEDLOG PERU S.A.",
                    "NEUTRALOGISTICS PERU S.A.C.",
                    "NEW AGE CENTRO LOGISTICO S.A.C.",
                    "RANSA COMERCIAL S.A.C",
                    "VILLAS OQUENDO S.A."
                ]
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "+51 962 664 716",
                    "947 298 394",
                    "955287176.0",
                    "957957092.0",
                    "962 385 452",
                    "994037752.0",
                    "PE001-Importaciones@medlog.com",
                    "atencionalcliente@alfosac.pe",
                    "atencionalcliente@logistix.net",
                    "comercial@logisticaoquendo.com",
                    "serviciosycitas@ransa.net",
                    "supervisionoperaciones@fargoline.com.pe"
                ]
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "select",
                "editable": True,
                "options": [
                    "Av. 28 de Julio Nro. 753 Int. 301",
                    "Av. Argentina Nro. 2085",
                    "Av. Argentina Nro. 2833 Z.I. Industrial",
                    "Av. Coronel Nestor Gambetta Nro. 4783 Km. 47 Hac. Hacienda San Agustin",
                    "Av. Javier Prado Este Nro. 6210 Int. 403",
                    "Av. Manco Capac Nro. 113",
                    "Av. Nestor Gambeta Nro. 358 (Alt.Ovalo Centenario)",
                    "Av. Nestor Gambeta Nro. 5502 Ex Fundo Taboada (Carretera Ventanilla Km 19 Comienzo)",
                    "Av. a Nro. 204 Fnd. Ex Fundo Oquendo (Alt. Km 8.5 Av Nestor Gambetta Antes Avd)",
                    "Avenida Néstor Gambetta Km. 10",
                    "Jr. Domenico Morelli Nro. 110 Int. 601 (Piso 6 - Cc la Rambla - Torre 1)",
                    "Lote. S/n Fnd. Marquez Valle de Carabayl (Frente a Logisminsa)"
                ]
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "(01) 311-4100",
                    "+51 (1) 313.6000",
                    "206-6500 (Opción 1, sub Opción 1)",
                    "933 148 257",
                    "936825329.0",
                    "941 552 226",
                    "942656653.0",
                    "960264907.0",
                    "974 583 859",
                    "981 354 198",
                    "982005209.0"
                ]
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "Callao.citasyservicios@dpworld.com",
                    "PE001-Importaciones@medlog.com",
                    "atencionalcliente2@alfosac.pe",
                    "atencionalcliente@contrans.com.pe",
                    "clientes@fargoline.com.pe",
                    "comercial@logisticaoquendo.com",
                    "customertal.peru@agunsa.com",
                    "dpwc.servicioalclienteimpo@dpworld.com",
                    "facturacion@newagelogistico.com",
                    "servicios@dtdinet.com.pe",
                    "servicios@logistix.net",
                    "serviciosycitas@ransa.net"
                ]
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "select",
                "editable": True,
                "options": [
                    ".",
                    "0011-0130-0105035249",
                    "0011-0350-69-0100010678",
                    "191-9291422-0-45",
                    "194-4713411-0-11"
                ]
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "select",
                "editable": True,
                "options": [
                    ".",
                    "0011-0350-66-0100010651",
                    "011-102-0100015921",
                    "0586-52-01000126 66",
                    "1191--8757997-1-23",
                    "191-0668128-1-7",
                    "191-9876961-1-90",
                    "193-1192445-1-07",
                    "194-4713417-1-81"
                ]
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "CONTACTO OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "945 841 513",
                    "970 451 295",
                    "Callao.ServicioalCliente@dpworld.com",
                    "MCarrilloBO@ransa.net",
                    "almacenlcl@logisticaoquendo.com",
                    "atencionalcliente@logistix.net",
                    "carlos.collas@dtdinet.com.pe",
                    "diana.feria@alfosac.pe",
                    "dpwl.clientesfwd@dpworld.com",
                    "operaciones@newagelogistico.com",
                    "raquel.lavarces@fargoline.com.pe",
                    "socorro.zavaleta@medlog.com"
                ]
            },
            {
                "col": 12,
                "key": "col_12",
                "label": "CELULAR OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "51 1 299 7870",
                    "924985506.0",
                    "936825329.0",
                    "943 849 595",
                    "943646982.0",
                    "949091907.0",
                    "957957092.0",
                    "962664716.0",
                    "970807455.0",
                    "980 408 619",
                    "981 354 198"
                ]
            },
            {
                "col": 13,
                "key": "col_13",
                "label": "CONTACTO CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    "977207240.0",
                    "Callao.ServicioalCliente@dpworld.com",
                    "MCarrilloBO@ransa.net",
                    "alvaro.espinoza@medlog.com",
                    "atencionalcliente@contrans.com.pe",
                    "comercial@logisticaoquendo.com",
                    "comercial@newagelogistico.com",
                    "darwin.castillo@dinet.com.pe",
                    "eva.uscata@alfosac.pe",
                    "luz.lecaro@fargoline.com.pe",
                    "mmedrano@logistix.net"
                ]
            },
            {
                "col": 14,
                "key": "col_14",
                "label": "CELULAR CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    "51 (1) 207 8830",
                    "905 454 558",
                    "932 257 874",
                    "947 298 394",
                    "957 599 066",
                    "957957092.0",
                    "962664716.0",
                    "971 875 660",
                    "974 583 859",
                    "981 354 198",
                    "982005209.0",
                    "994206592.0"
                ]
            },
            {
                "col": 15,
                "key": "col_15",
                "label": "CONTACTO FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    "955 424 148",
                    "991 805 298",
                    "Callao.facturaciondeposito@dpworld.com",
                    "PE001-Facturacion@medlog.com",
                    "VFernandezZ@ransa.net",
                    "dpwl.facturacionforwarder@dpworld.com",
                    "facturacion.pe@logistix.net",
                    "facturacion@dtdinet.com.pe",
                    "facturacion@newagelogistico.com",
                    "leydi.diaz@contrans.com.pe",
                    "validacionescobranzas@logisticaoquendo.com"
                ]
            },
            {
                "col": 16,
                "key": "col_16",
                "label": "CELULAR FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    "947 298 394",
                    "951 632 486",
                    "962664530.0",
                    "972 146 432",
                    "974 583 859",
                    "979 529 046",
                    "981354564.0",
                    "994648738.0",
                    "PE001-Facturacion@medlog.com",
                    "dpwl.facturacionforwarder@dpworld.com",
                    "facturacion@alfosac.pe"
                ]
            },
            {
                "col": 17,
                "key": "col_17",
                "label": "OTRO CONTACTO",
                "type": "select",
                "editable": True,
                "options": [
                    "905 454 558",
                    "950496826.0",
                    "957957092.0",
                    "994 037 752",
                    "DPWC.Identificaciones@dpworld.com",
                    "almacenlcl@logisticaoquendo.com",
                    "citasacv@ransa.net",
                    "clientes@fargoline.com.pe",
                    "direccionamientos@logistix.net",
                    "finco@alfosac.pe",
                    "l.lazarte@medlog.com",
                    "supervisor@newagelogistico.com"
                ]
            }
        ]
    },
    "Servicio de Montacarga": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Operaciones",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    },
    "Almacén Trasegado": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Operaciones",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    },
    "Tramite de Mercancia Restringid": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Operaciones",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    },
    "Servicio Marketing": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Proveedores",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    },
    "Soporte Tecnico": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Proveedores",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    },
    "Empresa Transporte para Envio P": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Proveedores",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    },
    "Agente Maritimo - VB": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Proveedores",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "select",
                "editable": True,
                "options": [
                    "2025-10-30 17:35:06.275000",
                    "2025-10-31 10:53:08.674000",
                    "2025-10-31 11:36:36.972000",
                    "2025-10-31 11:59:47.323000"
                ]
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "select",
                "editable": True,
                "options": [
                    "AGM-MSI-001",
                    "AGM-MSI-002",
                    "AGM-MSI-003",
                    "AGM-MSI-004"
                ]
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "select",
                "editable": True,
                "options": [
                    "20345286081.0",
                    "20451770099.0",
                    "20543244300.0",
                    "20602540376.0"
                ]
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "select",
                "editable": True,
                "options": [
                    "Cosco Shipping Ports Chancay Peru S.A",
                    "IAN TAYLOR PERU S.A.C.",
                    "Maersk Line Perú SAC",
                    "OCEAN NETWORK EXPRESS (PERU) S.A.C."
                ]
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "PE.VISTOSCMA-CGM@IANTAYLOR.COM",
                    "customer.service@cspterminals.pe",
                    "pe.import@maersk.com",
                    "servicedesk@mercator.pe"
                ]
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "select",
                "editable": True,
                "options": [
                    "Av. Nestor Gambetta Km. 14.5 (Carretera a Ventanilla)",
                    "Av. Oscar R. Benavides Nro. 3866 Otr. Tercer Piso Oficinas Admi",
                    "Av. republica de Colombia Nº 717 piso 8 - San Isidro - Lima - Peru 15073",
                    "COSCO SHIPPING PORTS CHANCAY PERU S.A."
                ]
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "+116155000",
                    "5103410.0",
                    "908 912 173",
                    "947611300.0"
                ]
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "comercial@cspterminals.pe",
                    "contact@iantaylor.pe",
                    "pe.import@maersk.com",
                    "servicedesk@mercator.pe"
                ]
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "select",
                "editable": True,
                "options": [
                    ".",
                    "00100301150000126"
                ]
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "select",
                "editable": True,
                "options": [
                    ".",
                    "00100301249998666",
                    "193-2038339-1-91"
                ]
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "CONTACTO OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "+51 7304732",
                    "01 6155000",
                    "948 533 896",
                    "cobros@cspterminals.pe"
                ]
            },
            {
                "col": 12,
                "key": "col_12",
                "label": "CELULAR OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "51 946405059",
                    "933 148 257",
                    "940 485 855",
                    "947 611 300"
                ]
            },
            {
                "col": 13,
                "key": "col_13",
                "label": "CONTACTO CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    "+51 (01) 6155010",
                    ".",
                    "947611300.0",
                    "vacios@contrans.com.pe"
                ]
            },
            {
                "col": 14,
                "key": "col_14",
                "label": "CELULAR CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    ".",
                    "946405059.0",
                    "947611300.0",
                    "951 632 486"
                ]
            },
            {
                "col": 15,
                "key": "col_15",
                "label": "CONTACTO FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    "NormalizacionFinOps@maersk.com",
                    "cobros@cspterminals.pe",
                    "pe.collections@maersk.com",
                    "silvia.lozada@iantaylor.com"
                ]
            },
            {
                "col": 16,
                "key": "col_16",
                "label": "CELULAR FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    ".",
                    "945 841 513",
                    "947 373 207"
                ]
            },
            {
                "col": 17,
                "key": "col_17",
                "label": "OTRO CONTACTO",
                "type": "select",
                "editable": True,
                "options": [
                    "943 849 595",
                    "948 533 896",
                    "autoreply@maersk.com",
                    "johana.vela@iantaylor.com"
                ]
            }
        ]
    },
    "Gate IN": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Proveedores",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "select",
                "editable": True,
                "options": [
                    "2025-10-30 15:33:16.886000",
                    "2025-10-30 15:54:16.587000",
                    "2025-10-30 17:14:21.545000",
                    "2025-10-30 17:23:01.146000",
                    "2025-11-04 16:37:01.540000",
                    "2025-11-04 16:47:57.998000",
                    "2025-11-04 16:58:30.534000"
                ]
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "select",
                "editable": True,
                "options": [
                    "GI-MSI-001",
                    "GI-MSI-002",
                    "GI-MSI-003",
                    "GI-MSI-004",
                    "GI-MSI-005",
                    "GI-MSI-006",
                    "GI-MSI-007"
                ]
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "select",
                "editable": True,
                "options": [
                    "20100010217.0",
                    "20107012011.0",
                    "20259171891.0",
                    "20347646891.0",
                    "20392952455.0",
                    "20451770099.0",
                    "20507646051.0"
                ]
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "select",
                "editable": True,
                "options": [
                    "CONTRANS S.A.C.",
                    "DP WORLD LOGISTICS S.R.L.",
                    "INVERS.MARITIMAS UNIVERSALES PERU S.A",
                    "MAERSK LOGISTICS & SERVICES PERU S.A.",
                    "MEDLOG PERU S.A.",
                    "Maersk Line Perú SAC",
                    "TERMINALES PORTUARIOS PERUANOS SAC"
                ]
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "962230603.0",
                    "Callao.citasyservicios@dpworld.com",
                    "PE001-Vacios@medlog.com",
                    "atencionvirtual@tpp.com.pe",
                    "diana.godos@agunsa.com",
                    "pe.import@maersk.com",
                    "vacios@contrans.com.pe"
                ]
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "select",
                "editable": True,
                "options": [
                    "Av. Antonio Miro Quesada Nro. 425 Int. 1210 (421 423 427-a 429 431 Prisma Tower)",
                    "Av. Argentina Nro. 2085",
                    "Av. Nestor Gambeta Nro. 358 (Alt.Ovalo Centenario)",
                    "Av. Nestor Gambeta Nro. 5502 Ex Fundo Taboada (Carretera Ventanilla Km 19 Comienzo)",
                    "Av. Nestor Gambetta Km. 14.5 (Carretera a Ventanilla)",
                    "Av. a Nro. 204 Fnd. Ex Fundo Oquendo (Alt. Km 8.5 Av Nestor Gambetta Antes Avd)"
                ]
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "5103410.0",
                    "924 590 341",
                    "936 825 329",
                    "951 632 486",
                    "962 664 716",
                    "962230603.0",
                    "986634962.0"
                ]
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "Callao.citasyservicios@dpworld.com",
                    "PE001-Vacios@medlog.com",
                    "Servicios.Vacios@lns.maersk.com",
                    "c-factura@tpp.com.pe",
                    "diana.godos@agunsa.com",
                    "pe.import@maersk.com",
                    "vacios@contrans.com.pe"
                ]
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "select",
                "editable": True,
                "options": [
                    ".",
                    "191-1186496-0-06",
                    "193-1188563-0-85",
                    "194-1977756-0-31",
                    "ES CON TICKET EL PAGO.",
                    "SOLO CUENTA DOLARES."
                ]
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "select",
                "editable": True,
                "options": [
                    ".",
                    "191-1178033-1-32",
                    "193-1192445-1-07",
                    "193-1697747-1-67",
                    "193-2038339-1-91",
                    "194-1970884-1-27",
                    "ES CON TICKET EL PAGO."
                ]
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "CONTACTO OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "+51 7304732",
                    "948 522 728",
                    "962232411.0",
                    "980 026 105",
                    "994 037 752",
                    "994361416.0",
                    "atencionvirtual@tpp.com.pe"
                ]
            },
            {
                "col": 12,
                "key": "col_12",
                "label": "CELULAR OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "924985506.0",
                    "940 485 855",
                    "943 849 595",
                    "946174484.0",
                    "962230603.0",
                    "981 299 205"
                ]
            },
            {
                "col": 13,
                "key": "col_13",
                "label": "CONTACTO CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    ".",
                    "944 591 534",
                    "954500644.0",
                    "atencionalcliente@contrans.com.pe",
                    "atencionvirtual@tpp.com.pe",
                    "customertal.peru@agunsa.com",
                    "jennifer.santa.cruz.merino@lns.maersk.com"
                ]
            },
            {
                "col": 14,
                "key": "col_14",
                "label": "CELULAR CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    ".",
                    "942656653.0",
                    "944 591 534",
                    "947329933.0",
                    "951 632 486",
                    "962232411.0"
                ]
            },
            {
                "col": 15,
                "key": "col_15",
                "label": "CONTACTO FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    "955 320 996",
                    "Callao.facturaciondeposito@dpworld.com",
                    "PE001-Facturacion@medlog.com",
                    "facturacionvacios@tpp.com.pe",
                    "normalizacionfinOps@maersk.com",
                    "pe.collections@maersk.com",
                    "vacios@contrans.com.pe"
                ]
            },
            {
                "col": 16,
                "key": "col_16",
                "label": "CELULAR FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    "+51 (1) 207 8830",
                    ".",
                    "511-626-8282",
                    "941 763 661",
                    "948 522 728",
                    "962230603.0",
                    "981022972.0"
                ]
            },
            {
                "col": 17,
                "key": "col_17",
                "label": "OTRO CONTACTO",
                "type": "select",
                "editable": True,
                "options": [
                    "936 825 329",
                    "941 763 661",
                    "Callao.ServicioalCliente@dpworld.com",
                    "autoreply@maersk.com",
                    "juan.g.sanchez@lns.maersk.com",
                    "patricia.pezo@one-line.com",
                    "vistobueno@tpp.com.pe"
                ]
            }
        ]
    },
    "Línea Naviera - AVLL": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Proveedores",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "select",
                "editable": True,
                "options": [
                    "2025-10-30 14:13:23.708000",
                    "2025-10-30 14:38:51.602000",
                    "2025-11-04 17:15:10.404000",
                    "2025-11-14 11:47:02.367000",
                    "2025-11-14 11:53:33.790000",
                    "2025-11-14 11:59:05.405000",
                    "2025-11-14 12:05:22.773000"
                ]
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "select",
                "editable": True,
                "options": [
                    "LN-MSI-001",
                    "LN-MSI-002",
                    "LN-MSI-003",
                    "LN-MSI-004",
                    "LN-MSI-005",
                    "LN-MSI-006",
                    "LN-MSI-007"
                ]
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "select",
                "editable": True,
                "options": [
                    "20259814210.0",
                    "20510927754.0",
                    "20600374339.0",
                    "20602245901.0",
                    "20602540376.0",
                    "20603425091.0",
                    "20612272159.0"
                ]
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "select",
                "editable": True,
                "options": [
                    "CMA CGM PERU S.A.C.",
                    "CORPORACION LOGISTICA HMM S.A.C.",
                    "EVERGREEN SHIPPING AGENCY (PERU) S.A.C.",
                    "MEDITERRANEAN SHIPPING COMPANY DEL PERU SAC",
                    "OCEAN NETWORK EXPRESS (PERU) S.A.C.",
                    "PACIFIC INTERNATIONAL LINES PERU S.A.C.",
                    "WAN HAI LINES PERU S.A.C."
                ]
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "CONTACTO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "51 1 6113400",
                    "PER-invoicing@mcs.com",
                    "acobba@kenrick.com.pe",
                    "alldept@evergreen-shipping.com.pe",
                    "office@per.pilship.com",
                    "recruit@wanhai.com",
                    "servicedesk@mercator.pe"
                ]
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "DIRECCION",
                "type": "select",
                "editable": True,
                "options": [
                    "AV. JAVIER PRADO ESTE NO. 492, INT. 502 , SAN ISIDRO , LIMA , 150131",
                    "Av. Alvarez Calderon No. 185 - Of. 501 PE - 0 LIMA",
                    "Av. Canaval y Moreyra # 340, 10th Floor, San Isidro, L - 027, Peru",
                    "Av. Circunvalacion Nro. 208 Res. Golf los Incas 208 Torre (Oficina 602 B)",
                    "Av. los Conquistadores Nro. 1118 (Oficina 401)",
                    "Avenida Camino Real 1281, Piso 3, San Isidro, Lima 27, Peru",
                    "Calle Bolognesi N° 180, Of 604 – Miraflores, Lima, Perú"
                ]
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "TELEFONO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "(+51 1) 512-4900",
                    "+51 1 219 3839",
                    "+51 1 613 7200",
                    "51 1 6289599",
                    "51 17009877",
                    "51-1-6168000",
                    "886-2-25677961"
                ]
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "CORREO PRINCIPAL",
                "type": "select",
                "editable": True,
                "options": [
                    "PER-invoicing@mcs.com",
                    "acobba@kenrick.com.pe",
                    "alldept@evergreen-shipping.com.pe",
                    "office@per.pilship.com",
                    "pe.comm@one-line.com",
                    "per.service@cma-cgm.com",
                    "recruit@wanhai.com"
                ]
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "select",
                "editable": True,
                "options": [
                    "0011-0350-01000158-82",
                    "011-586-000100045297-57",
                    "1932370475100 CCI: 00219300237047510019",
                    "CUENTA CORRIENTE BCP DÓLARES: 193-1348281-1-09"
                ]
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "CONTACTO OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "+51 1 611 3400",
                    "+51 994 207 188",
                    "948 533 896",
                    "fyovera@kenrick.com.pe",
                    "khuaman@evergreen-shipping.com.pe",
                    "lgutti@per.pilship.com",
                    "recruit@wanhai.com"
                ]
            },
            {
                "col": 12,
                "key": "col_12",
                "label": "CELULAR OPERATIVO",
                "type": "select",
                "editable": True,
                "options": [
                    "+51 1 2193839 (4606)",
                    "+51 1 6113492",
                    "+51 981 247 275",
                    "51-1-2059960",
                    "905 447 094",
                    "947 373 207",
                    "994207188.0"
                ]
            },
            {
                "col": 13,
                "key": "col_13",
                "label": "CONTACTO CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    "947611300.0",
                    "998326460.0",
                    "jnoriega@per.pilship.com",
                    "khuaman@evergreen-shipping.com.pe",
                    "lmm.csimpo@cma-cgm.com",
                    "pehmmscom@kenrick.com.pe"
                ]
            },
            {
                "col": 14,
                "key": "col_14",
                "label": "CELULAR CUSTOMER",
                "type": "select",
                "editable": True,
                "options": [
                    "+51 1 2193839 (4112)",
                    "+51 1 611 3400",
                    "+51 997 431 853",
                    "905 447 094",
                    "997752319.0",
                    "998326460.0"
                ]
            },
            {
                "col": 15,
                "key": "col_15",
                "label": "CONTACTO FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    "PER-invoicing@msc.com",
                    "docimpo@transtotalperu.com",
                    "facturacion@evergreen-shipping.com.pe",
                    "her.perupagoscash@cma-cgm.com",
                    "jlujan@per.pilship.com",
                    "pe.cmrelease@one-line.com"
                ]
            },
            {
                "col": 16,
                "key": "col_16",
                "label": "CELULAR FINANZAS - FACTURACIÓN",
                "type": "select",
                "editable": True,
                "options": [
                    "+51 1 2193839 (3504)",
                    "+51 1 6113493",
                    "+51 973 004 135",
                    "51-1-6168000",
                    "51997752319.0",
                    "998326460.0"
                ]
            },
            {
                "col": 17,
                "key": "col_17",
                "label": "OTRO CONTACTO",
                "type": "select",
                "editable": True,
                "options": [
                    "+51 986 636 286",
                    "947611300.0",
                    "PER-import.documentation@msc.com",
                    "finfns@evergreen-shipping.com.pe",
                    "her.perupagoscash@cma-cgm.com",
                    "jlostaunau@per.pilship.com"
                ]
            }
        ]
    },
    "Direccionamiento": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": "Proveedores",
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "ID",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "RUC",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "RAZON SOCIAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "ALMACÉN TEMPORAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "CONTACTO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "DIRECCION",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "TELEFONO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "CORREO PRINCIPAL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "CUENTA CORRIENTE SOLES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "CUENTA CORRIENTE DOLARES",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 12,
                "key": "col_12",
                "label": "CONTACTO OPERATIVO",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 13,
                "key": "col_13",
                "label": "CELULAR OPERATIVO",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 14,
                "key": "col_14",
                "label": "CONTACTO CUSTOMER",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 15,
                "key": "col_15",
                "label": "CELULAR CUSTOMER",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 16,
                "key": "col_16",
                "label": "CONTACTO FINANZAS - FACTURACIÓN",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 17,
                "key": "col_17",
                "label": "CELULAR FINANZAS - FACTURACIÓN",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 18,
                "key": "col_18",
                "label": "OTRO CONTACTO",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    }
}

IMPORTACIONES_SHEETS_META = {
    "Despacho Aduanas": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": None,
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "Nro",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "Consignatario",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "Ro",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "Comercial",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "ETA",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "Orden Mocayas",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "Dam",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "BL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "Canal",
                "type": "select",
                "editable": True,
                "options": [
                    "Diferido",
                    "Naranja",
                    "Rojo",
                    "Verde"
                ]
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "Regularización",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 12,
                "key": "col_12",
                "label": "Manifiesto",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 13,
                "key": "col_13",
                "label": "Almacén",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 14,
                "key": "col_14",
                "label": "LCL-FCL",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 15,
                "key": "col_15",
                "label": "VB",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 16,
                "key": "col_16",
                "label": "Ingreso al Almacén",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 17,
                "key": "col_17",
                "label": "Factura de almacenaje en carpeta",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 18,
                "key": "col_18",
                "label": "Carpeta de Liquidación",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 19,
                "key": "col_19",
                "label": "Devolución",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 20,
                "key": "col_20",
                "label": "Sobrestadía",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 21,
                "key": "col_21",
                "label": "Fecha de Retiro",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 22,
                "key": "col_22",
                "label": "Guía de Remisión",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 23,
                "key": "col_23",
                "label": "Costo de Transporte",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 24,
                "key": "col_24",
                "label": "Empresa de Transporte",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 25,
                "key": "col_25",
                "label": "Estado Actual",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 26,
                "key": "col_26",
                "label": "Carpeta",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 27,
                "key": "col_27",
                "label": "Archivo",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 28,
                "key": "col_28",
                "label": "Recojo de BL",
                "type": "select",
                "editable": True,
                "options": [
                    "No",
                    "Si"
                ]
            },
            {
                "col": 29,
                "key": "col_29",
                "label": "Cobro de Recojo",
                "type": "select",
                "editable": True,
                "options": [
                    "No",
                    "Si"
                ]
            }
        ]
    },
    "Registro Ordenes MSI": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": None,
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "Nro",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "Orden",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "Consignatario",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "ETA",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "Orden de Mocayas",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 7,
                "key": "col_7",
                "label": "LCL-FCL",
                "type": "select",
                "editable": True,
                "options": [
                    "AEREO- BRAZIL",
                    "AEREO-MIAMI",
                    "AIR",
                    "AÉREO",
                    "ENVIADO PARA NUMERACION",
                    "FCL",
                    "FCL 2X40",
                    "FCL X20",
                    "FCL X40",
                    "LCL",
                    "LCL - FCL",
                    "LCL AEREO",
                    "Otros",
                    "PENDIENTE DE NUMERACION"
                ]
            },
            {
                "col": 8,
                "key": "col_8",
                "label": "Dua",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 9,
                "key": "col_9",
                "label": "Canal",
                "type": "select",
                "editable": True,
                "options": [
                    "NARANJA",
                    "PENDIENTE",
                    "ROJO",
                    "VERDE"
                ]
            },
            {
                "col": 10,
                "key": "col_10",
                "label": "Almacén",
                "type": "select",
                "editable": True,
                "options": [
                    "ALFOSAC",
                    "APM PUERTO",
                    "AQP EXPRESS",
                    "COSCO SHIPPING PORTS CHANCAY PERU S.A.",
                    "DHL EXPRESS PERÚ S.A.C.",
                    "DP WORLD LOGISTICS S.R.L.",
                    "IMUPESA",
                    "PENDIENTE",
                    "SCHARFF",
                    "SHOHIN",
                    "SISMAR",
                    "TALMA",
                    "VILLAS OQUENDO"
                ]
            },
            {
                "col": 11,
                "key": "col_11",
                "label": "RO:",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    },
    "Ordenes Mocayas": {
        "header_row": 4,
        "data_start_row": 5,
        "subcat": None,
        "icon": "fa-table",
        "columns": [
            {
                "col": 1,
                "key": "col_1",
                "label": "Marca temporal",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 2,
                "key": "col_2",
                "label": "Orden Mocaya",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 3,
                "key": "col_3",
                "label": "Consignatario",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 4,
                "key": "col_4",
                "label": "Dam",
                "type": "text",
                "editable": True,
                "options": []
            },
            {
                "col": 5,
                "key": "col_5",
                "label": "Fecha",
                "type": "select",
                "editable": True,
                "options": [
                    "2024-01-02 00:00:00",
                    "2024-01-08 00:00:00",
                    "2024-01-22 00:00:00",
                    "2024-01-29 00:00:00"
                ]
            },
            {
                "col": 6,
                "key": "col_6",
                "label": "Liquidadores",
                "type": "text",
                "editable": True,
                "options": []
            }
        ]
    }
}

SPREADSHEETS = {
    "registro_servicios": {
        "id": "registro_servicios",
        "title": "Registro de Servicios",
        "category": "Cuadro de Embarque",
        "icon": "fa-ship",
        "path": os.path.join(PROJECT_DIR, "Registro de Servicios.xlsx"),
        "google_sheet_id": "",
        "sheets": {
            "Registro Cliente": {
                "header_row": 4,
                "data_start_row": 5,
                "subcat": None,
                "icon": "fa-user-tie",
                "columns": [
                    {"col": 1, "key": "col_1", "label": "Marca temporal", "type": "datetime", "auto": True, "editable": False},
                    {"col": 2, "key": "col_2", "label": "Código Cliente", "type": "text", "editable": True},
                    {"col": 3, "key": "col_3", "label": "Servicio", "type": "select", "editable": True, "options": ["ADUANA", "CARGA", "CARGA Y ADUANA", "COMISIONISTA", "CURRIER", "DIRECCIONAMIENTO", "IMPORTACION CARGA Y ADUANA"]},
                    {"col": 4, "key": "col_4", "label": "Razón Social", "type": "text", "editable": True},
                    {"col": 5, "key": "col_5", "label": "Tipo Documento", "type": "select", "editable": True, "options": ["RUC", "DNI", "CE", "PASAPORTE"]},
                    {"col": 6, "key": "col_6", "label": "Nro Documento", "type": "text", "editable": True},
                    {"col": 7, "key": "col_7", "label": "Dirección", "type": "text", "editable": True},
                    {"col": 8, "key": "col_8", "label": "Teléfono", "type": "text", "editable": True},
                    {"col": 9, "key": "col_9", "label": "Correo", "type": "text", "editable": True},
                    {"col": 10, "key": "col_10", "label": "Contacto", "type": "text", "editable": True}
                ]
            },
            "Registro Carga": {
                "header_row": 4,
                "data_start_row": 5,
                "subcat": None,
                "icon": "fa-box-open",
                "columns": [
                    {"col": 1, "key": "col_1", "label": "Marca temporal", "type": "datetime", "auto": True, "editable": False},
                    {"col": 4, "key": "col_4", "label": "RO", "type": "text", "editable": True},
                    {"col": 5, "key": "col_5", "label": "Consignatario", "type": "text", "editable": True},
                    {"col": 6, "key": "col_6", "label": "Ro del Proveedor", "type": "text", "editable": True},
                    {"col": 7, "key": "col_7", "label": "Proveedor (Agencia de Carga)", "type": "select", "editable": True, "options": ["CHARTER LINK LOGISTICS", "CRAFT MULTIMODAL", "GOLD PERU", "GOLDEN SHIPPING", "GROUP TITANS SAC", "KERRY LOGISTICS", "MSL", "PLUS CARGO", "SOUTH CARGO", "TRANSMARES", "TRANSMARES GROUP", "TRANSOCEAN", "WOLRDPASS"]},
                    {"col": 8, "key": "col_8", "label": "CUT OFF", "type": "date", "editable": True},
                    {"col": 9, "key": "col_9", "label": "Fecha Embarque", "type": "date", "editable": True},
                    {"col": 10, "key": "col_10", "label": "Fecha Llegada", "type": "date", "editable": True},
                    {"col": 11, "key": "col_11", "label": "Linea Naviera", "type": "select", "editable": True, "options": ["AIR MAX", "ATLAS", "AVIANCA", "CMA CGM", "COSCO", "DELTA", "EMC", "EVERGREEN", "HAPAH LLOYD", "HMM", "LATAM", "MAERKS", "MAERSK", "MSC", "ONE"]},
                    {"col": 12, "key": "col_12", "label": "Bill Of Lading", "type": "text", "editable": True},
                    {"col": 13, "key": "col_13", "label": "Nave", "type": "text", "editable": True},
                    {"col": 14, "key": "col_14", "label": "Carga LCL o FCL", "type": "select", "editable": True, "options": ["LCL", "FCL", "20ST / FCL", "FCL 1X20", "FCL 1X40", "FCL 2X40", "FCL 40 HC", "AEREO"]},
                    {"col": 15, "key": "col_15", "label": "Incoterm", "type": "select", "editable": True, "options": ["FOB", "CIF", "EXW", "FCA", "CFR", "DDP", "DAP"]},
                    {"col": 16, "key": "col_16", "label": "Telex Release", "type": "text", "editable": True},
                    {"col": 17, "key": "col_17", "label": "Nro de RUC de importación", "type": "text", "editable": True},
                    {"col": 18, "key": "col_18", "label": "Se notificó a Operaciones?", "type": "select", "editable": True, "options": ["Si", "No"]},
                    {"col": 19, "key": "col_19", "label": "Estado Actual", "type": "select", "editable": True, "options": ["SE RETIRO DEL ALMACEN", "EN TRAMITE", "CONFIRMACION DE ZARPE", "CONCLUIDO", "CANCELADO"]},
                    {"col": 20, "key": "col_20", "label": "Se envió venta a consolidador?", "type": "select", "editable": True, "options": ["SI", "NO"]},
                    {"col": 21, "key": "col_21", "label": "CONTENEDOR / BOOKING / TRACKING", "type": "text", "editable": True}
                ]
            },
            "Registro Courrier": {
                "header_row": 4,
                "data_start_row": 5,
                "subcat": None,
                "icon": "fa-plane-departure",
                "columns": [
                    {"col": 1, "key": "col_1", "label": "Marca temporal", "type": "datetime", "auto": True, "editable": False},
                    {"col": 2, "key": "col_2", "label": "RO", "type": "text", "editable": True},
                    {"col": 3, "key": "col_3", "label": "Consignatario", "type": "text", "editable": True},
                    {"col": 4, "key": "col_4", "label": "Ro del Proveedor", "type": "text", "editable": True},
                    {"col": 5, "key": "col_5", "label": "Courrier Internacional", "type": "select", "editable": True, "options": ["DHL", "FEDEX", "UPS", "TNT", "OTRO"]},
                    {"col": 6, "key": "col_6", "label": "Fecha Embarque", "type": "date", "editable": True},
                    {"col": 7, "key": "col_7", "label": "Fecha Llegada", "type": "date", "editable": True},
                    {"col": 8, "key": "col_8", "label": "Guía Aérea", "type": "text", "editable": True},
                    {"col": 9, "key": "col_9", "label": "Incoterm", "type": "select", "editable": True, "options": ["FOB", "CIF", "EXW", "FCA", "CFR", "DDP", "DAP"]},
                    {"col": 10, "key": "col_10", "label": "Almacén", "type": "select", "editable": True, "options": ["SCHARFF", "AQP EXPRESS", "DHL", "FEDEX", "UPS"]},
                    {"col": 11, "key": "col_11", "label": "Aerolínea", "type": "text", "editable": True},
                    {"col": 12, "key": "col_12", "label": "Observaciones", "type": "text", "editable": True}
                ]
            },
            "Seguro de carga internacional": {
                "header_row": 1,
                "data_start_row": 2,
                "subcat": None,
                "icon": "fa-shield-halved",
                "columns": [
                    {"col": 1, "key": "col_1", "label": "RO", "type": "text", "editable": True},
                    {"col": 2, "key": "col_2", "label": "CONSIGNEE", "type": "text", "editable": True},
                    {"col": 3, "key": "col_3", "label": "HBL", "type": "text", "editable": True},
                    {"col": 4, "key": "col_4", "label": "MONTO DEL SEGURO", "type": "text", "editable": True},
                    {"col": 5, "key": "col_5", "label": "CERT. SEGURO Nº", "type": "text", "editable": True}
                ]
            }
        }
    },
    "base_datos_operativa": {
        "id": "base_datos_operativa",
        "title": "Base Datos Operativa",
        "category": "Base Datos Operativa",
        "icon": "fa-database",
        "path": os.path.join(PROJECT_DIR, "Base Datos Operativa.xlsx"),
        "google_sheet_id": "",
        "sheets": OPERATIVA_SHEETS
    },
    "registro_importaciones": {
        "id": "registro_importaciones",
        "title": "Registro Importaciones",
        "category": "Registro Importaciones",
        "icon": "fa-file-invoice-dollar",
        "path": os.path.join(PROJECT_DIR, "Registro Importaciones.xlsx"),
        "google_sheet_id": "",
        "sheets": IMPORTACIONES_SHEETS_META
    }
}

OPERATIVA_SUBCATS = [
    {"key": "Informativo", "label": "📌 Informativo", "sheets": ["Clientes - Consignatarios", "Comerciales - MSI", "Comerciales Oper. - Logis."]},
    {"key": "Carga", "label": "📦 Carga", "sheets": ["Agentes Carga", "Operador Logístico", "Seguro Carga"]},
    {"key": "Operaciones", "label": "⚙️ Operaciones", "sheets": ["Agencia de Aduana", "Emp. Transporte Local", "Deposito Aduanero", "Almacén Temporal", "Servicio de Montacarga", "Almacén Trasegado", "Tramite de Mercancia Restringid"]},
    {"key": "Proveedores", "label": "🏢 Proveedores", "sheets": ["Servicio Marketing", "Soporte Tecnico", "Empresa Transporte para Envio P", "Agente Maritimo - VB", "Gate IN", "Línea Naviera - AVLL", "Direccionamiento"]}
]
