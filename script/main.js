// Importar bases de datos
import { database, database_paquetes } from "./database.js";

let modorapido = document.getElementById ("cambiarmodo_calculorapido")
/**
 * Incrustación de contenedor a partir de texto, tipo, container y atributos (opcionales) indicados
**/
function enContenedor(texto, tipo, container, atributos = false) {

    // Define el contenedor existente donde se introducirá la etiqueta
    let contenedor = document.getElementById(container);

    // Crea un elemento con la etiqueta definida 
    let nuevaEtiqueta = document.createElement(tipo);

    // Introduce el texto dentro de la etiqueta
    nuevaEtiqueta.textContent = texto;

    // Incrusta la etiqueta en el contenedor previamente definido.
    contenedor.appendChild(nuevaEtiqueta); // Indicando así el contenido

    // Asociar los atributos
    if (atributos) {
        for (let i = 0; i < atributos.length; i++) {
            nuevaEtiqueta.setAttribute(atributos[i][0], atributos[i][1])
        }
    }
}

// Siendo el contenido de la tabla FILA [["columna", "columna"], ["columna", "columna"]] y el primero el thead
/* Ejemplo:
crearTabla ([["A", "B", "C"],
                ["1", "3", "6"],  
                ["2", "4", "7"],  
                ["3", "5", "8"],                               ],
"prueba","nuevatabla")

El título de la tabla 
*/

function crearTabla(contenidoTabla, container, idRef, classRef = "table") {

    // Convertir todos los elementos del contenido de la tabla en Strings
    contenidoTabla = contenidoTabla.map(subArray => {
        return subArray.map(elemento => elemento.toString());
    });

    // Etiquetas <table> 
    enContenedor("", "table", container, [["id", idRef], ["class", classRef]]);
    // Etiquetas <thead> 
    enContenedor("", "thead", idRef, [["id", idRef + "head"]]);

    // Etiqueta <thead>
    enContenedor("", "tr", idRef + "head", [["id", idRef + "trhead"]]);
    // El modificador adaptará a partir de que fila se mostrará el thead 
    let modificador = 0;
    // Si el primer array solo contiene un string...y a su vez este es el tamaño anormal con respecto a otros elementos de la tabla
    if (contenidoTabla[0].length == 1 && contenidoTabla[0].length < contenidoTabla[1].length) {
        modificador = 1;
        // ...Se considerará que este es el título de la tabla, ocupando el thead...
        enContenedor(contenidoTabla[0][0], "th", idRef + "trhead", [["colspan", contenidoTabla[1].length]])
        /// ... siendo el siguiente espacio en el array el thead inferior
        enContenedor("", "tr", idRef + "head", [["id", idRef + "trtrhead"]])
        for (let i = 0; i < contenidoTabla[1].length; i++) {
            enContenedor(contenidoTabla[1][i], "th", idRef + "trtrhead")
        }
    }
    else {
        // De lo contrario, escribir el thead normalmente
        for (let i = 0; i < contenidoTabla[0].length; i++) {
            enContenedor(contenidoTabla[0][i], "th", idRef + "trhead")
        }
    }

    // Etiqueta <tbody> 
    enContenedor("", "tbody", idRef, [["id", idRef + "body"]])

    // Si el ultimo elemento del array empieza con un espacio en blanco, considera que es el footer

    if (String(contenidoTabla[contenidoTabla.length - 1][0].charAt(0)) == " ") {

        // Rellena todos los elementos hasta llegar al footer
        for (let i = 1 + modificador; i < contenidoTabla.length - 1; i++) {
            enContenedor("", "tr", idRef + "body", [["id", idRef + "tr" + i]]);
            for (let j = 0; j < contenidoTabla[i].length; j++) {
                enContenedor(contenidoTabla[i][j], "td", idRef + "tr" + i)
            }
        }

        // Etiqueta <footer>
        enContenedor("", "tfoot", idRef, [["id", idRef + "foot"]]);
        for (let i = 0; i < contenidoTabla[contenidoTabla.length - 1].length; i++) {
            enContenedor(contenidoTabla[contenidoTabla.length - 1][i], "td", idRef + "foot")
        }
        // 
    }
    else {
        // Rellena todos los elementos restantes
        for (let i = 1 + modificador; i < contenidoTabla.length; i++) {
            enContenedor("", "tr", idRef + "body", [["id", idRef + "tr" + i]]);
            for (let j = 0; j < contenidoTabla[i].length; j++) {
                enContenedor(contenidoTabla[i][j], "td", idRef + "tr" + i)
            }
        }
    }
}

// Convierte los minutos a minutos y horas

function formatoTiempoMins(mins) {
    if (mins <= 0) return "Ninguno"
    if (mins / 60 < 1) return `${mins} mins`;

    let horas = mins / 60;
    let minutos = (horas - Math.floor(horas)) * 60;

    return `${Math.floor(horas)}h ${Math.floor(minutos)}mins`
}

// Convierte los numeros sin formato (5999) a  números con formato (5.999) junto 

function formatoNumerico(numero, extra = "") {
    if (numero <= 0) return "Ninguno"
    // Obtener el valor del input
    numero = numero.toString()

    // Si el número tiene al menos 4 dígitos, agregar puntos como separadores de miles
    if (numero.length > 3) {
        numero = numero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Actualizar el valor del input con el número formateado
    return numero + extra;
}



/**
 * Post procesado de las tablas
**/

// Agregamos el atributo de unidades, que el usuario usará para cuantificar tras cada actualización qué productos elije 

function agregarAtributoUds() {
    Object.keys(database).forEach(function (tipoObjeto) {
        database[tipoObjeto].forEach(function (objeto) {
            objeto.uds = 0;
        })
    })

    Object.keys(database).forEach(function (tipoObjeto) {
        database[tipoObjeto].forEach(function (objeto) {
            objeto.udspaquete = 0;
        })
    })

    database_paquetes.map(function (paquete) {
        paquete.uds = 0;
    })
}

agregarAtributoUds() // La base de datos contará con este registro desde el principio

// En la base de datos de objetos, agregar un beneficio unitario por producto

function calcularBeneficioUnitarioObjetos() {
    Object.keys(database).forEach(function (tipoObjeto) {
        database[tipoObjeto].forEach(function (objeto) {
            objeto["beneficioUnitario"] = objeto.precio - objeto.po;
        })
    })
}

calcularBeneficioUnitarioObjetos()

// Calcular los totales: minutos, PO y Experiencia

function calcularTotalesPaquetes() {

    database_paquetes.map(function (paquete) {
        let totalPO = 0;
        let totalMins = 0;
        let totalExp = 0;
        let totalUds = 0;
        // getValorObjeto (nombre, clave)
        paquete.objetos.map(function (objeto) {
            totalUds = totalUds + getValorPaqueteObjeto(paquete.nombre, objeto.nombre, "uds")
            totalPO = totalPO + getValorObjeto(objeto.nombre, "po") * getValorPaqueteObjeto(paquete.nombre, objeto.nombre, "uds")
            totalMins = totalMins + getValorObjeto(objeto.nombre, "mins") * getValorPaqueteObjeto(paquete.nombre, objeto.nombre, "uds")
            totalExp = totalExp + getValorObjeto(objeto.nombre, "exp") * getValorPaqueteObjeto(paquete.nombre, objeto.nombre, "uds")
        })

        paquete["totalUds"] = totalUds;
        paquete["totalPO"] = totalPO;
        paquete["totalMins"] = totalMins;
        paquete["totalExp"] = totalExp;
        paquete["beneficioTotal"] = paquete.precio - totalPO;

    })
}

calcularTotalesPaquetes()

/**
 * Desarrollo del programa
**/

// Actualiza la información en pantalla a medida que el usuario interactúa con ella
function actualizarInformacion() {
    

    // Eliminar toda la información presentada en pantalla
    mostradorPaquetes.innerHTML = "";
    mostradorProductos.innerHTML = "";
    cuenta_resultado.innerHTML = "";

    // MOSTRADOR PAQUETE 

    if (database_paquetes.length) {
        enContenedor("paquetes", "h2", "mostradorPaquetes");
        enContenedor ("", "div", "mostradorPaquetes", [["id", "muestraPaquete"], ["class", "muestraPaquete"]])
    
        // Recorrer todos los paquetes existentes
        database_paquetes.map(function (paquete) {
    
            
            enContenedor("", "div", "muestraPaquete", [["id", paquete.nombre], ["class", "paquete"]]);
    
            // Panel con (+) unidades (-); 
            enContenedor("", "div", paquete.nombre, [["class", "panel_suma_resta"], ["id", "panel_suma_resta" + paquete.nombre]])
            enContenedor("-5", "button", "panel_suma_resta" + paquete.nombre, [["class", "botonrestar"], ["class", "botonpanel"], ["id", "botonrestar5paquete_" + paquete.nombre]])
            enContenedor("-", "button", "panel_suma_resta" + paquete.nombre, [["class", "botonrestar"], ["class", "botonpanel"], ["id", "botonrestarpaquete_" + paquete.nombre]])
            enContenedor("" + paquete.uds, "div", "panel_suma_resta" + paquete.nombre, [["class", "uds"]])
            enContenedor("+", "button", "panel_suma_resta" + paquete.nombre, [["class", "botonsumar"], ["class", "botonpanel"], ["id", "botonsumarpaquete_" + paquete.nombre]])
            enContenedor("+5", "button", "panel_suma_resta" + paquete.nombre, [["class", "botonsumar"], ["class", "botonpanel"], ["id", "botonsumar5paquete_" + paquete.nombre]])
            
            
            // Panel con la información del paquete
    
            enContenedor(paquete.nombre, "div", paquete.nombre, [["class", "nombre-paquete"]])
            enContenedor("Precio en oro: " + formatoNumerico(paquete.precio, " po."), "div", paquete.nombre)
            enContenedor("Coste en oro: " + formatoNumerico(paquete.totalPO, " po."), "div", paquete.nombre)
            enContenedor("Experiencia: " + formatoNumerico(paquete.totalExp, " ptos."), "div", paquete.nombre)
            enContenedor("Tiempo: " + formatoTiempoMins(paquete.totalMins), "div", paquete.nombre)
            enContenedor("Contenido: ", "div", paquete.nombre)
            paquete.objetos.map(function (objeto) {
                enContenedor("- " + objeto.nombre + " (" + objeto.uds + ")", "div", paquete.nombre)
            })
        })
    }
    


    // MOSTRADOR DE PRODUCTROS

    // Recorrer todos los tipos de objetos. 
    Object.keys(database).forEach(function (tipoObjeto) {

        // Para cada tipo de objeto... (varita, pergamino...) un contenedor
        enContenedor(tipoObjeto, "h2", "mostradorProductos");
        enContenedor ("", "div", "mostradorProductos", [["id", "muestraProducto"+tipoObjeto], ["class", "muestraProducto"]])

   

        //Recorrer todos los objetos dentro de los tipos de objetos
        database[tipoObjeto].forEach(function (objeto) {
            enContenedor("", "div", "muestraProducto"+tipoObjeto, [["id", objeto.nombre], ["class","producto"]]);
            // Dentro de cada objeto... 

            // Panel con (+) unidades (-); 
            enContenedor("", "div", objeto.nombre, [["class", "panel_suma_resta"], ["id", "panel_suma_resta" + objeto.nombre]])
            enContenedor("-5", "button", "panel_suma_resta" + objeto.nombre, [["class", "botonrestar"], ["class", "botonpanel"], ["id", "botonrestar5_" + objeto.nombre]])
            enContenedor("-", "button", "panel_suma_resta" + objeto.nombre, [["class", "botonrestar"], ["class", "botonpanel"], ["id", "botonrestar_" + objeto.nombre]])
            enContenedor("" + objeto.uds, "div", "panel_suma_resta" + objeto.nombre, [["class", "uds"]])
            enContenedor("(" + objeto.udspaquete + ")", "div", "panel_suma_resta" + objeto.nombre)  
            enContenedor("+", "button", "panel_suma_resta" + objeto.nombre, [["class", "botonsumar"], ["class", "botonpanel"], ["id", "botonsumar_" + objeto.nombre]])
            enContenedor("+5", "button", "panel_suma_resta" + objeto.nombre, [["class", "botonsumar"], ["class", "botonpanel"], ["id", "botonsumar5_" + objeto.nombre]])

            // Panel con la información del objeto
            enContenedor(objeto.nombre, "div", objeto.nombre, [["class", "nombre_objeto"]]);
            enContenedor("Precio en oro: " + formatoNumerico(objeto.precio, " po."), "div", objeto.nombre, [["class", "atributo_objeto"]]);
            enContenedor("Coste en oro: " + formatoNumerico(objeto.po, " po."), "div", objeto.nombre, [["class", "atributo_objeto"]]);
            enContenedor("Experiencia: " + formatoNumerico(objeto.exp, " ptos."), "div", objeto.nombre, [["class", "atributo_objeto"]]);
            enContenedor("Tiempo: " + formatoTiempoMins(objeto.mins), "div", objeto.nombre, [["class", "atributo_objeto"]]);

        })
    })

    // CUENTA DE RESULTADOS

    let resultado = calcularResultado(); 

    // Indicadores totales

    if (resultado.uds>0) {

        enContenedor("", "div", "cuenta_resultado", [["id", "indicadorestotales"]])
        enContenedor("Indicadores totales:", "h4", "indicadorestotales");
    
        // Balance monetario
        enContenedor("", "div", "indicadorestotales", [["id", "balancemonetario"]])
    
        crearTabla([["Balance monetario"],
        ["Precio en oro", "Coste en oro", "Margen de beneficio"],
        [formatoNumerico(resultado.precio, " po."), formatoNumerico(resultado.po, " po."), formatoNumerico(resultado.beneficio, " po.")]
        ],
            "balancemonetario", "tabla_balance_beneficios"
        );
    
        // Balance tiempo experiencia
        enContenedor("", "div", "indicadorestotales", [["id", "balancetiempoexperiencia"]])
    
        crearTabla([["Experiencia y tiempo"],
        ["Coste en experiencia", "Tiempo de generación"],
        [formatoNumerico(resultado.exp, " ptos."), formatoTiempoMins(resultado.mins)]
        ],
            "balancetiempoexperiencia", "tabla_balance_tiempo_experiencia"
        );
    
        // Índices por unidad
        enContenedor("", "div", "indicadorestotales", [["id", "indicesporunidad"]])
    
        crearTabla([["Índices unitarios"],
        ["Unidad/es a vender", "Media de beneficio por unidad"],
        [formatoNumerico(resultado.uds, " uds."), formatoNumerico(Math.floor(resultado.beneficio / resultado.uds), " po.")]
        ],
            "indicesporunidad", "tabla_unidades"
        );
        
        // Tablas generales de objetos

        
        enContenedor("", "div", "cuenta_resultado", [["id", "resumenporobjeto"]])

        if (hayObjetosIndividuales()) {
            enContenedor ("Facturación por objeto individual", "h4", "resumenporobjeto")
        }

        resultado.resumen_individual.map(function (tipos) {
    
            enContenedor("", "div", "resumenporobjeto", [["id", tipos.tipoObjeto]])
    
            let tabla_resumen_por_objeto = [[tipos.tipoObjeto], ["Nombre", "Unidad/es", "Coste en experiencia", "Tiempo de generación", "Precio en oro", "Coste en oro", "Margen de beneficio"]]
            
            // Footer, que se encontrará debajo. 
    
            let footerObjetos = {
                total_totalUds: 0,
                total_totalExp: 0,
                total_totalMins: 0,
                total_totalPrecio: 0,
                total_totalCoste: 0,
                total_totalBeneficio: 0
            };

            if (tipos.objetos.length>0) {
                tipos.objetos.map(function (objeto) {
                    if (objeto.uds == undefined) console.log ("B")
                    // Introducir la información en el footer
                    footerObjetos["total_totalUds"] = parseInt(footerObjetos["total_totalUds"]) + parseInt(objeto.uds);
                    footerObjetos["total_totalExp"] = footerObjetos["total_totalExp"] + objeto.totalexp;
                    footerObjetos["total_totalMins"] = footerObjetos["total_totalMins"] + objeto.totalmins;
                    footerObjetos["total_totalPrecio"] = footerObjetos["total_totalPrecio"] + objeto.totalprecio;
                    footerObjetos["total_totalCoste"] = footerObjetos["total_totalCoste"] + objeto.totalpo;
                    footerObjetos["total_totalBeneficio"] = footerObjetos["total_totalBeneficio"] + (objeto.totalprecio - objeto.totalpo)
                    
                    tabla_resumen_por_objeto.push([objeto.nombre, formatoNumerico(objeto.uds, " uds."), formatoNumerico(objeto.totalexp, " ptos."), formatoTiempoMins(objeto.totalmins), formatoNumerico(objeto.totalprecio, " po."), formatoNumerico(objeto.totalpo, " po."), formatoNumerico(objeto.totalprecio - objeto.totalpo, " po.")]);
                })
        
                tabla_resumen_por_objeto.push([" Total:", formatoNumerico(parseInt(footerObjetos["total_totalUds"]), " uds."), formatoNumerico(footerObjetos["total_totalExp"], " ptos."), formatoTiempoMins(footerObjetos["total_totalMins"]), formatoNumerico(footerObjetos["total_totalPrecio"], " po."), formatoNumerico(footerObjetos["total_totalCoste"], " po."), formatoNumerico(footerObjetos["total_totalBeneficio"], " po.")])
        
                crearTabla(tabla_resumen_por_objeto, tipos.tipoObjeto, "tabla_resumen_por_objeto" + tipos.tipoObjeto)
            }

        })
        

        
        
            
    }
    
    // Tablas de objetos por paquete 
   
    if (resultado.resumen_paquete.length>0) {
        enContenedor("", "div", "cuenta_resultado", [["id", "resumenporpaquete"]])
        enContenedor("Facturación de paquetes:", "h4", "resumenporpaquete");

        resultado.resumen_paquete.map(function (paquete) {

            let tabla_resumen_paquete = [
                [paquete.nombre],
                ["Unidad/es", "Media de beneficio por unidad en paquete"],
                [formatoNumerico(paquete.unidades, " uds."), formatoNumerico(Math.floor((paquete.precio - getValorPaquete(paquete.nombre, "totalPO")) / getValorPaquete(paquete.nombre, "totalUds")), " po.")]
            ];

            crearTabla(tabla_resumen_paquete, "resumenporpaquete", "tabla_resumenporpaquete" + paquete.nombre)

            let footerPaqueteObjetos = {
                totalUds: 0,
                totalExp: 0,
                totalMins: 0,
                totalPrecioVentaOriginal: 0,
                totalCoste: 0,
            }

            let tabla_resumen_paquete_objetos = [["Resumen de objetos en " + paquete.nombre], ["Nombre", "Unidad/es", "Coste en experencia", "Tiempo de generación", "Precio original", "Coste en oro"]]
            paquete.objetos.map(function (objeto) {
                footerPaqueteObjetos["totalUds"] = parseInt(footerPaqueteObjetos["totalUds"]) + parseInt(objeto.uds);
                footerPaqueteObjetos["totalExp"] = footerPaqueteObjetos["totalExp"] + objeto.exp;
                footerPaqueteObjetos["totalMins"] = footerPaqueteObjetos["totalMins"] + objeto.mins;
                footerPaqueteObjetos["totalPrecioVentaOriginal"] = footerPaqueteObjetos["totalPrecioVentaOriginal"] + objeto.precio_venta_original;
                footerPaqueteObjetos["totalCoste"] = footerPaqueteObjetos["totalCoste"] + objeto.po;
                tabla_resumen_paquete_objetos.push([objeto.nombre, formatoNumerico(objeto.uds, " uds."), formatoNumerico(objeto.exp, " exp."), formatoTiempoMins(objeto.mins), formatoNumerico(objeto.precio_venta_original, " po."), formatoNumerico(objeto.po, " po.")]);
            })
            tabla_resumen_paquete_objetos.push([" Total:", formatoNumerico(footerPaqueteObjetos["totalUds"], ". uds"), formatoNumerico(footerPaqueteObjetos["totalExp"], " exp."), formatoTiempoMins(footerPaqueteObjetos["totalMins"]), formatoNumerico(footerPaqueteObjetos["totalPrecioVentaOriginal"], " po."), formatoNumerico(footerPaqueteObjetos["totalCoste"], " po."), "Ahorro: " + formatoNumerico((footerPaqueteObjetos["totalPrecioVentaOriginal"] - ((paquete.precio - getValorPaquete(paquete.nombre, "totalPO")) * paquete.unidades)), " po.")])
            crearTabla(tabla_resumen_paquete_objetos, "resumenporpaquete", "tabla_resumenporpaqueteobjetos" + paquete.nombre)
        })

    }
    
    // Si el modo es rápido, quitar el display de todos los elementos que no queremos que se vean

    if (modorapido.value=="true") {
        var resumenPorPaquete = document.getElementById("resumenporpaquete");
        if (resumenPorPaquete) {
            // Si existe, cambiar su contenido a "none"
            resumenPorPaquete.style.display = "none";
        }
    
        // Verificar si existe el elemento con la ID "resumenporobjeto"
        var resumenPorObjeto = document.getElementById("resumenporobjeto");
        if (resumenPorObjeto) {
            // Si existe, cambiar su contenido a "none"
            resumenPorObjeto.style.display = "none";
        }
    }
  
    

    // Tras cada actualización, preparamos al navegador para recibir clicks 

    esperarClickBoton() 
}

/**
 * Programar los eventos  de botones 
*/

// Todos los botones de añadir (+) y restar (-) se registran en la pulsación

function esperarClickBoton() {
    let botonesPanel = document.querySelectorAll(".botonpanel");

    botonesPanel.forEach(function (botonpanel) {
        botonpanel.addEventListener("click", function () {
            // Sabemos a qué objeto está vinculado cada botón mediante su id, cuyo separador "_" tiene inmediatamente
            // después el nombre del objeto
            let tipoBoton = (botonpanel.id).split("_")[0]
            let objetoVinculado = (botonpanel.id).split("_")[1]

            switch (tipoBoton) {
                case "botonrestar":
                  restarUdObjeto(objetoVinculado);
                  break;
                case "botonsumar":
                  anadirUdObjeto(objetoVinculado);
                  break;
                case "botonrestarpaquete":
                  restarUdPaquete(objetoVinculado);
                  break;
                case "botonsumarpaquete":
                  anadirUdPaquete(objetoVinculado);
                  break;
                case "botonrestar5paquete":
                  for (let i = 0; i < 5; i++) {
                    let estado = restarUdPaquete(objetoVinculado);
                    if (!estado) break;
                  }
                  break;
                case "botonsumar5paquete":
                  for (let i = 0; i < 5; i++) {
                    anadirUdPaquete(objetoVinculado);
                  }
                  break;
                case "botonsumar5":
                    for (let i=0; i<5; i++) {
                        anadirUdObjeto (objetoVinculado)
                    }
                    break;
                case "botonrestar5": 

                    for (let i = 0; i < 5; i++) {
                        let estado = restarUdObjeto(objetoVinculado);
                        if (!estado) break;
                    }
                    break;    
        
                default:
                  break;
            }
              

            
        })
    })
}

/**
 * Funciones de añadir y eliminar objeto: cambian los atributos de las estructuras HTML de cada objeto 
 * para mantener un registro de cuantas unidades quiere cuantificar la calculadora, y mostrarlas al usuario
 * Para esto son necesarias las funciones de getValorObjeto y setValorObjeto, que buscan en la base de datos
 * y arrojan el valor inicial y permiten modificarlo */

// GESTIÓN DE OBJETOS 

// Retorna el valor de un objeto de la database. 

function getValorObjeto(nombre, clave) {
    let salida = false; // ... el return no funciona dentro de los foreach...
    Object.keys(database).forEach(function (tipoObjeto) {
        database[tipoObjeto].forEach(function (objeto) {
            if (objeto.nombre == nombre) {
                salida = objeto[clave]
            }
        })
    })

    return salida;
}

// Define el valor de un objeto de la database. 

function setValorObjeto(nombre, clave, valor) {
    Object.keys(database).forEach(function (tipoObjeto) {
        database[tipoObjeto].forEach(function (objeto) {
            if (objeto.nombre == nombre) {
                objeto[clave] = valor;
            }
        })
    })

    actualizarInformacion();

}

// Modifica el atributo "unidades" de un objeto de la database añadiendole 1

function anadirUdObjeto(nombreObjeto) {
    let uds = parseInt(getValorObjeto(nombreObjeto, "uds")) + 1;
    setValorObjeto(nombreObjeto, "uds", uds.toString())

}

// Modifica el atributo "unidades" de un objeto de la database restándole 1

function restarUdObjeto(nombreObjeto) {
    let uds = parseInt(getValorObjeto(nombreObjeto, "uds"));
    if (uds <= 0) return false;
    else {
        setValorObjeto(nombreObjeto, "uds", (uds - 1).toString())
        return true;
    }
}

// GESTIÓN DE PAQUETES

// Retorna el valor de un objeto de la database paquetes. 

function getValorPaquete(nombre, clave) {
    let salida = false;
    database_paquetes.map(function (paquete) {
        if (paquete.nombre == nombre) {
            salida = paquete[clave];
        }
    })
    return salida;
}

// Define el valor de un objeto de la database paquetes. 

function setValorPaquete(nombre, clave, valor) {
    database_paquetes.map(function (paquete) {
        if (paquete.nombre == nombre) {
            paquete[clave] = valor;
        }
    })
    actualizarInformacion();
}

// Modifica el atributo "unidades" de un paquete de la database de paquetes y añade un valor de unidad en paquete al objeto

function anadirUdPaquete(nombrePaquete) {
    let uds = parseInt(getValorPaquete(nombrePaquete, "uds")) + 1;
    setValorPaquete(nombrePaquete, "uds", uds.toString())
    // Modificar las unidades de paquete de los objetos comprometidos
    database_paquetes.map(function (paquete) {
        paquete.objetos.map(function (objeto) {
            // Para el paquete concreto que se requiera. 
            if (paquete.nombre == nombrePaquete) {
                let udspaquete = parseInt(getValorObjeto(objeto.nombre, "udspaquete")) + objeto.uds; // Asignar a la database de objetos las cantidades especificas de la base de datos de paquetes
                setValorObjeto(objeto.nombre, "udspaquete", udspaquete.toString())
            }
        })
    })
}

// Modifica el atributo "unidades" de un paquete de la database de paquetes y resta un valor de unidad en paquete al objeto

function restarUdPaquete(nombrePaquete) {
    let uds = parseInt(getValorPaquete(nombrePaquete, "uds"));
    if (uds <= 0) {
        console.log("Error (Modificar esto)") 
        return false;
    }
    else {
        setValorPaquete(nombrePaquete, "uds", (uds - 1).toString())
        // Modificar las unidades de paquete de los objetos comprometidos
        database_paquetes.map(function (paquete) {
            paquete.objetos.map(function (objeto) {
                // Para el paquete concreto que se requiera. 
                if (paquete.nombre == nombrePaquete) {
                    let udspaquete = parseInt(getValorObjeto(objeto.nombre, "udspaquete")) - objeto.uds; // Asignar a la database de objetos las cantidades especificas de la base de datos de paquetes
                    setValorObjeto(objeto.nombre, "udspaquete", udspaquete.toString())
                }
            })
        })
        return true;
    }
}



// Retorna el valor de uno de los objetos contenidos en un paquete

function getValorPaqueteObjeto(nombrePaquete, nombreObjeto, clave) {
    let salida = false;
    database_paquetes.map(function (paquete) {
        paquete.objetos.map(function (objeto) {
            if (paquete.nombre == nombrePaquete && nombreObjeto == objeto.nombre) {
                salida = objeto[clave];
            }
        })
    })
    return salida;
}

/**
 * Computar el resultado accediendo a los valores de la base de datos
**/

function calcularResultado() {

    // El archivo JSON del resultado cuenta con los indicadores totales de unidades, precio, po, beneficio, exp, mins...
    let resultado = {
        uds: 0,
        precio: 0,
        po: 0,
        beneficio: 0,
        exp: 0,
        mins: 0,
        resumen_individual: [],
        resumen_paquete: []
    }

    // Cómputo de precio, exp, po y minutos para paquetes 
    database_paquetes.map(function (paquete) {
        resultado.uds = resultado.uds + (paquete.totalUds * paquete.uds)
        resultado.precio = resultado.precio + (paquete.precio * paquete.uds)
        resultado.po = resultado.po + (paquete.totalPO * paquete.uds)
        resultado.exp = resultado.exp + (paquete.totalExp * paquete.uds)
        resultado.mins = resultado.mins + (paquete.totalMins * paquete.uds)
    })

    // Cómputo de objetos individuales (+paquete para po exp y mins)

    Object.keys(database).forEach(function (tipoObjeto) {
        database[tipoObjeto].forEach(function (objeto) {
            resultado.uds = resultado.uds + parseInt(objeto.uds)
            resultado.precio = resultado.precio + (objeto.uds * objeto.precio);
            resultado.po = resultado.po + (objeto.uds * objeto.po);
            resultado.exp = resultado.exp + (objeto.uds * objeto.exp);
            resultado.mins = resultado.mins + (objeto.uds * objeto.mins);
        })
    })

    // Cómputo de beneficio: 

    resultado.beneficio = resultado.precio - resultado.po;

    // Resumen por paquete

    database_paquetes.map(function (paquete) {

        if (paquete.uds > 0) {

            let comparativa = 0;

            let paqueteResult = {
                nombre: paquete.nombre,
                objetos: [],
                precio: paquete.precio,
                unidades: paquete.uds,
            }

            paquete.objetos.map(function (objeto) {
                let objetoResult = {
                    "nombre": objeto.nombre, // He aqui la cuestion
                    "uds": getValorPaqueteObjeto(paquete.nombre, objeto.nombre, "uds") * getValorPaquete(paquete.nombre, "uds"),
                    "po": getValorObjeto(objeto.nombre, "po") * getValorPaqueteObjeto(paquete.nombre, objeto.nombre, "uds") * getValorPaquete(paquete.nombre, "uds"),
                    "exp": getValorObjeto(objeto.nombre, "exp") * getValorPaqueteObjeto(paquete.nombre, objeto.nombre, "uds") * getValorPaquete(paquete.nombre, "uds"),
                    "mins": getValorObjeto(objeto.nombre, "mins") * getValorPaqueteObjeto(paquete.nombre, objeto.nombre, "uds") * getValorPaquete(paquete.nombre, "uds"),
                    "precio_venta_original": getValorObjeto(objeto.nombre, "precio") * getValorPaqueteObjeto(paquete.nombre, objeto.nombre, "uds") * getValorPaquete(paquete.nombre, "uds"),
                }

                comparativa = comparativa + getValorObjeto(objeto.nombre, "precio") * getValorPaqueteObjeto(paquete.nombre, objeto.nombre, "uds") * getValorPaquete(paquete.nombre, "uds");
                paqueteResult.objetos.push(objetoResult)
            })

            resultado.resumen_paquete.push(paqueteResult);
            resultado["resumen_paquete"]["comparativa"] = comparativa - paquete.precio;
        }

    })

    // Resumen individual

    Object.keys(database).forEach(function (tipoObjeto) {

        var tipoObjetoResult = {
            tipoObjeto: tipoObjeto,
            objetos: []
        };

        database[tipoObjeto].forEach(function (objeto) {
            if (objeto.uds > 0) {
                tipoObjetoResult.objetos.push({
                    "nombre": objeto.nombre,
                    "uds": objeto.uds,
                    "totalprecio": objeto.precio * objeto.uds,
                    "totalpo": objeto.po * objeto.uds,
                    "totalexp": objeto.exp * objeto.uds,
                    "totalmins": objeto.mins * objeto.uds
                });
            }
        });

        resultado.resumen_individual.push(tipoObjetoResult)
    });

    return resultado;
}

function hayObjetosIndividuales () {
    let salida = false;
    calcularResultado().resumen_individual.map(function (tipos) {
        
        if (tipos.objetos.length>0) { // Verifica si hay objetos y si no se ha ejecutado
            
            salida = true; 
        }
    })   

    return salida;
}

/**
 * Main 
**/

actualizarInformacion();

document.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') {
        
        let flecha = document.getElementById ("flecha"); 
        let contenedor_derecho = document.getElementById ("contenedor-derecho"); 

        let cuenta_resultado = document.getElementById ("cuenta_resultado")
        function invertirEstado () {
            if (modorapido.value=="true") {
                modorapido.value ="false" 
                modorapido.innerHTML ="Modo de cálculo rápido: Deshabilitado"
                modorapido.style.backgroundColor =   "#f5e5da"
                modorapido.style.color = "#5e2a23";
                
                cuenta_resultado.style.position="relative"
                flecha.style.visibility = "hidden"
                


            } 
            else if (modorapido.value=="false")  {
                
                modorapido.value ="true" 
                modorapido.innerHTML ="Modo de cálculo rápido: Habilitado"
                modorapido.style.backgroundColor = "#5e2a23"; 
                modorapido.style.color = "#f5e5da"
                cuenta_resultado.style.position="fixed"
                flecha.style.visibility = "visible"
                
            } 
            actualizarInformacion()

        }
        invertirEstado ()
    }
});




