const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
//importar rutas
const juegosRutas = require('./routes/juegoRutas');
//configuraciones
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URL;
// configurar express para JSON
app.use(express.json());
//conexion a la bd
mongoose.connect(MONGODB_URI)
    .then(() => {
                console.log('conexion con MONGODB exitsa');
                app.listen(PORT, () => { console.log(`Servidor en funcionando en puerto: ${PORT}`) });
            })
    .catch( error => console.log("Error de conexión MongoDB", error))

app.use('/ruta-juego',juegosRutas)

