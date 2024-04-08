const mongoose = require('mongoose');

const juegoSchema = new mongoose.Schema({
    nombre : String,
    plataforma : String,
    descripcion : String,
    categoria : String,
    preciobs : Number,
})

const JuegoModel = mongoose.model('Juego',juegoSchema,'juego');
module.exports = JuegoModel;

