var DB = require('nosql');
var nosql = DB.load('./database/file.nosql');

nosql.insert({ id: 3499, edad: 40, nombre: 'Peter' }).callback(
    function (err) {
        console.log('La persona fue dada de alta');
        buscar();
    });

function buscar() {
    nosql.find().make(
        function (builder) {
            builder.between('edad', 20, 60);
            builder.callback(function (err, resultado) {
                console.log('personas entre 20 y 60 años:', resultado);
                actualizarEdad();
            });
        });
}

function actualizarEdad() {
    nosql.modify({ edad: 58 }).make(
        function (builder) {
            // builder.first(); --> modifies only the one document
            builder.where('id', 3499);
            builder.callback(function (err, count) {
                console.log('modified documents:', count);
                actualizarUno();
            });
        });

}

function actualizarUno() {
    nosql.update({ id: 3499, edad: 60, nombre: 'Lucia' }).make(function (builder) {
        // builder.first(); --> updates only the one document
        builder.where('id', 3499);
        builder.callback(function (err, count) {
            console.log('updated documents:', count);
        });
    });
}