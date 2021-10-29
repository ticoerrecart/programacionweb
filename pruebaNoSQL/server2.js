var DB = require('nosql');
var nosql = DB.load('./database/file.nosql');

//nosql.insert({ id: 3500, edad: 42, nombre: 'Peter' });

let builder = nosql.find();
builder.between('edad', 20, 60);
builder.callback(function (err, resultado) {
    console.log('personas entre 20 y 60 años:', resultado);
});


builder = nosql.find();
builder.where('edad', "=", 40);
builder.callback(function (err, resultado) {
    console.log('personas con 40 años:', resultado);
});
   
builder = nosql.one(); //devuelve solo la primera!!
builder.where('edad', "=", 42);
builder.callback(function (err, resultado) {
    console.log('personas con 42 años:', resultado);
});

/*
async function insertar() {
    await nosql.insert({ id: 999, edad: 12, nombre: 'Borrar' }).promise()
    .then(function(resul){
        console.log(resul);
    })
    .catch(err => { console.log(err) });
    
}

insertar();
*/


nosql.insert({ id: 999, edad: 12, nombre: 'Borrar' }).callback(
    function (err) {
        console.log('La persona fue dada de alta');
        builder = nosql.find();
        builder.where('id', "=", 999);
        builder.callback(function (err, resultado) {
            console.log('persona con id 999 (1):', resultado);
        });
    });


builder = nosql.remove();
builder.where('id', "=", 999);
builder.callback(function (err, resultado) {
    console.log('personas borradas id 999 (2):', resultado);
});

builder = nosql.find();
builder.where('id', "=", 999);
builder.callback(function (err, resultado) {
    console.log('persona con id 999 (3):', resultado);
});

builder = nosql.find();
builder.search("nombre", "Luc");
builder.callback(function (err, resultado) {
    console.log('La busqueda dio como resultado', resultado);
});
