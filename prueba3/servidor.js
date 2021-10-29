let express = require('express');

let miApp = express();
//indicar en que carpeta esta el contenido estatico html
miApp.use(express.static("html"));

//indicar en que carpeta esta el contenido dinamico (.ejs)
miApp.set("view engine", "ejs");

miApp.listen(3000, function () {
    console.log("servidor levantado!!");
});


miApp.get("/", function (pedido,respuesta){
    respuesta.send("Hola Mundo!!");
});



miApp.get("/pruebaDinamica", function (pedido,respuesta){
    let datos = {};
    datos.titulo= "Bienvenido a la pagina dinamica!!!";
    datos.parrafo = "bla bla bla bla bla bla bla bla bla bla ";

    datos.equipos = ["Boca", "River", "Racing", "Estudiantes", "Banfield"];
    respuesta.render("prueba", datos);
});

miApp.get("/pruebaDinamica2", function (pedido,respuesta){
    let datos = {};
    datos.titulo= "Bienvenido a la pagina dinamica 2!!!";
    datos.parrafo = "parrafo ";

    respuesta.render("prueba2", datos);
});

miApp.get("/datosPersona", function (pedido,respuesta){
    let datos = { id: 3499, edad: 40, nombre: 'Peter' };
    
    respuesta.render("datosPersona", datos);
});

miApp.get("/prueba3", function (pedido,respuesta){
    let datos = { };
    datos.parrafo="Este parrafo es dinamico";
    
    respuesta.render("prueba3", datos);
});