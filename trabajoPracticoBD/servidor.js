const { response } = require('express');
let express = require('express');
var DB = require('nosql');
var nosql = DB.load('./database/miBase.nosql');

let miApp = express();
//indica en que carpeta esta el contenido estatico html
miApp.use(express.static("html"));

//indica en que carpeta esta el contenido dinamico (.ejs)
miApp.set("view engine", "ejs");

//para poder parsear lo que enviamos con un form desde html
miApp.use(express.json());
miApp.use(express.urlencoded({ extended: true }));

//----------------------------------------------
//configuracion de session
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const oneDay = 1000 * 60 * 60 * 24;
miApp.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
// cookie parser middleware
miApp.use(cookieParser());

//---------------------------------------------- 
function listarPersonas(respuesta, miSesion){
    let builder = nosql.find();

    builder.callback(
        function (err, resultado) {
            //console.log(resultado);
            let datos = {};
            datos.personas = resultado;
            datos.session = miSesion;
            //console.log(datos);
            respuesta.render("personasAcordion", datos);
        }
    );
    
}

function listarPersonasHome(respuesta, miSesion){
    let builder = nosql.find();

    builder.callback(
        function (err, resultado) {
            //console.log(resultado);
            let datos = {};
            datos.personas = resultado;
            datos.session = miSesion;
            //console.log(datos);
            respuesta.render("home", datos);
        }
    );
    
}

function altaPersona(persona, respuesta){
    let builder = nosql.insert(persona);
    
    builder.callback(
        function (err) {
            //console.log('La persona fue dada de alta');
            listarPersonas(respuesta);
        });
}

function borrarPersona(dni, respuesta){
    let builder = nosql.remove();

    builder.where('dni', "=", dni);
    
    
    builder.callback(
        function (err, resultado) {
            listarPersonas(respuesta);
        }
    );
}

function buscarPersona(params, respuesta){
    
    builder = nosql.find();
    
    
    builder.and()
    builder.search("nombre", params.nombre);
    builder.search("apellido", params.apellido);
    builder.search("dni", params.dni);
    builder.end();

    builder.callback(function (err, resultado) {
        //console.log('La busqueda dio como resultado', resultado);
        let datos = {};
        datos.personas = resultado;
        //console.log(datos);
        respuesta.render("personasAcordion", datos);
    });
}


function verificarLogin(usuario, pedido, respuesta){
    builder = nosql.find();
    
    builder.and()
    builder.search("nombre", usuario.nombre);
    builder.search("password", usuario.password);
    builder.end();

    builder.callback(function (err, resultado) {
        //console.log('La busqueda dio como resultado', resultado);
        //let datos = {};
        let personas = resultado;
        console.log(resultado);
        if(personas.length>0){
            //el usuario existe
            //guardo en la sesion el usuario!!!!!!!!!
            let miSesion = pedido.session;
            miSesion.usuarioLogueado = usuario.nombre;
            console.log(miSesion);
            respuesta.redirect('/');
        }else{
            let datos ={};
            datos.error = "El nombre de Usuario no existe o la password es incorrecta";
            respuesta.render("login", datos);
        }
        
    });
}
//---------------------------------------------- 
miApp.listen(3000, function () {
    console.log("servidor levantado!!");
});

miApp.get("/", function (pedido,respuesta){
    let miSesion = pedido.session;
    console.log(miSesion);
    listarPersonasHome(respuesta, miSesion);
});

miApp.get("/personas", function (pedido, respuesta){
    let miSesion = pedido.session;
    //console.log(pedido.session);
    console.log(miSesion);
    listarPersonas(respuesta, miSesion);
});

miApp.post("/altaPersona", function (pedido, respuesta){
    //console.log(pedido.body);
    //recuperamos los datos que mandamos con el formulario
    let persona = pedido.body;
    altaPersona(persona, respuesta);

});

miApp.get("/borrarPersona/:dni", function (pedido, respuesta) {
    let dni = pedido.params.dni;
    borrarPersona(dni, respuesta);
});

miApp.post("/buscarPersona", function (pedido, respuesta) {
    let params = pedido.body;
    console.log(params); 
    buscarPersona(params, respuesta);

});

miApp.get("/mostrarDetallePersona/:nombre", function (pedido, respuesta){
    respuesta.send("<H1>Detalle de la Persona " + pedido.params.nombre + "</H1>");
});


//login--------------------------------------------
miApp.get("/login", function (pedido, respuesta){
    respuesta.render("login");
});


miApp.post("/ingresar", function (pedido, respuesta) {
    let params = pedido.body;
    verificarLogin(params, pedido,respuesta);
});

miApp.get('/logout',function(pedido,respuesta) {
    pedido.session.destroy();
    respuesta.redirect('/');
});
