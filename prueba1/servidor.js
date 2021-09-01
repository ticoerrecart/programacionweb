let express = require('express');

let miApp = express();

//contenido estatico->dentro de la carpeta html
miApp.use(express.static("html"));

//contenido dinamico, usamos el motro EJS->dentro de la carpeta views
miApp.set("view engine", "ejs");

//inicializar servidor
miApp.listen(3000, function(){
    console.log("Servidor inicializado");
});

miApp.get("/pruebaDinamica",function(pedido, respuesta){
    respuesta.render("htmlDinamico",{nombreUsuario: "Juancito Perez"});
})