# Tasador automático de mercancía para el videojuego de rol "Puerta de Baldur" 

Consiste en un sistema de gestión de inventarios, que emplea dos archivos JSON relacionados entre sí, a modo de bases de datos modificables desde "database.js". 

El fichero principal, "database", está compuesto de diversos objetos mágicos, y el fichero de "database_paquetes", es capaz de agruparlos entre sí, siendo dependiente del anterior para funcionar, conservando cada objeto dentro de su paquete las propiedades previamente definidas

El desarrollo de este proyecto pone de relieve un uso intensivo del DOM - para manipular e incrustar elementos en el HTML -, proyectando tablas con los cálculos pertinentes de la gestión de inventarios requerida
para el trabajo de comerciante en el videojuego de rol "Puerta de Baldur", y en la gestión efectiva de información mediante JSON. 

- En relación a la manipulación del DOM, destacan las funciones *enContenedor()* para introducir cómodamente unas etiquetas dentro de otras a través del atributo *id*, y la función *crearTabla()* para generar
rápidamente y sin incurrir en verbosidades y redundancias, tablas verticales con título, encabezado, cuerpo, y footer según lo especificado. Utilizada en la función de actualización de pantalla.

- La gestión de la base de datos cuenta con una sección de funciones dedicada.

- Funciones de formato, para dar formato al tiempo y a parámetros como la experiencia, las piezas de oro, unidades de mercancía... 

