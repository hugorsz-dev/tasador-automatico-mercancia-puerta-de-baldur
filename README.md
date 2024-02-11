# Tasador automático de mercancía para el videojuego de rol "Puerta de Baldur" 

Consiste en un sistema de gestión de inventarios, que emplea dos archivos JSON relacionados entre sí, a modo de bases de datos modificables desde "database.js". 

El fichero principal, "database", está compuesto por diferentes objetos mágicos, y el fichero de "database_paquetes", agrupa varios objetos y es dependiente del anterior para funcionar, conservando cada objeto 
dentro de su paquete las propiedades definidas en el anterior. 

El desarrollo de este proyecto pone de relieve un uso intensivo del DOM - para manipular e incrustar elementos en el HTML -, proyectando tablas con los cálculos pertinentes de la gestión de inventarios requerida
para el trabajo de comerciante en el videojuego de rol "Puerta de Baldur", y en la gestión efectiva de información mediante JSON. 
