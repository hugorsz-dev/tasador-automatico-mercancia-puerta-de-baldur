/* 
#############################################################################
#                                                                           #
# DATOS MODIFICABLES EN ARCHIVO .JSON                                       #                          
#                                                                           #
# ADVERTENCIA:                                                              #
# 1- NO DEBE MODIFICARSE LA ESTRUCTURA DEL ARCHIVO JSON, SOLO AÑADIRSE      #
#    NUEVAS ENTRADAS EN BASE A LAS YA EXISTENTES                            #
# 3- PUEDEN CREARSE NUEVAS CATEGORÍAS SIMILARES A "varitas" o "pergaminos"  #
#    SOLO SI MANTIENEN LA MISMA ESTRUCTURA                                  #
# 2- LA "database_paquetes" NO PUEDE CONTENER OBJETOS QUE NO SE ENCUENTREN  #
#    REGISTRADOS EN LA "database"                                           #
#                                                                           #
#############################################################################
*/ 

export const database = 
{
    "pergaminos": [
    { "nombre": "Arma mágica mayor", "precio": 4000, "po": 180, "exp": 45, "mins": 9 },
    { "nombre": "Teleportar", "precio": 5000, "po": 540, "exp": 75, "mins": 15 },
    { "nombre": "Revivir", "precio": 15000, "po": 540, "exp": 75, "mins": 15 },
    { "nombre": "Tromba mayor de proyectiles de Isaac", "precio": 10000, "po": 1080, "exp": 90, "mins": 18 },
    { "nombre": "Heroísmo mayor", "precio": 6000, "po": 0, "exp": 0, "mins": 0 },
    
    ],
    "varitas": [
    { "nombre": "Veneno de araña", "precio": 20000, "po": 1800, "exp": 250, "mins": 33 },
    { "nombre": "Heroísmo", "precio": 15000, "po": 1080, "exp": 50, "mins": 20 },
    { "nombre": "Piel pétrea", "precio": 25000, "po": 5000, "exp": 100, "mins": 40 },
    { "nombre": "Invisibilidad mejorada", "precio": 15000, "po": 5000, "exp": 100, "mins": 40 },
    { "nombre": "Puerta dimensional", "precio": 25000, "po": 5000, "exp": 400, "mins": 133 },
    { "nombre": "Tromba menor de proyectiles de Isaac", "precio": 35000, "po": 9300, "exp": 100, "mins": 40 },
    { "nombre": "Transposición benigna", "precio": 10000, "po": 1080, "exp": 50, "mins": 20 },
    { "nombre": "Transposición funesta", "precio": 10000, "po": 0, "exp": 0, "mins": 0 },
    { "nombre": "Armadura de muerte", "precio": 15000, "po": 2700, "exp": 250, "mins": 100 },
    { "nombre": "Ultravisión en grupo", "precio": 15000, "po": 900, "exp": 25, "mins": 10 },
    { "nombre": "Volar", "precio": 10000, "po": 5400, "exp": 75, "mins": 30 },
    { "nombre": "Afiladura", "precio": 30000, "po": 0, "exp": 0, "mins": 0 },
    { "nombre": "Escudo", "precio": 10000, "po": 0, "exp": 0, "mins": 0 },
    { "nombre": "Disipar magia", "precio": 20000, "po": 0, "exp": 0, "mins": 0 },
    ]
}


// Pueden deshabilitarse los paquetes igualandolos a [].

export const database_paquetes = 
[
    {"nombre": "Pack fortalecedor",
    "objetos": [
        {"nombre": "Heroísmo mayor", "uds": 1},
        {"nombre": "Arma mágica mayor", "uds": 15}
    ], 
    "precio": 120000
},
{"nombre": "Pack inventado",
    "objetos": [
        {"nombre": "Heroísmo mayor", "uds": 1},
        {"nombre": "Arma mágica mayor", "uds": 15}
    ], 
    "precio": 120000
},
{"nombre": "Pack inventado2",
    "objetos": [
        {"nombre": "Heroísmo mayor", "uds": 1},
        {"nombre": "Arma mágica mayor", "uds": 15}
    ], 
    "precio": 120000
},

]

