const express = require('express');
const rutas = express.Router();
const JuegoModel = require('../models/Juego');

rutas.get('/', async (req, res) =>{
    try {
        const juegos = await JuegoModel.find();
        console.log(juegos);
        res.json(juegos);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

rutas.post('/agregar', async (req, res) =>{
    // console.log(req.body);
    const nuevoJuego = new JuegoModel({
        nombre: req.body.nombre,
        plataforma: req.body.plataforma,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        preciobs: req.body.preciobs,
    });
    try {
        const guardarJuego = await nuevoJuego.save();
        res.status(201).json(guardarJuego);
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

rutas.put('/editar/:id', async (req, res) =>{
    try {
        const actualizarJuego = await JuegoModel.findByIdAndUpdate(req.params.id, req.body, { new: true});
        res.status(201).json(actualizarJuego);
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

rutas.delete('/eliminar/:id', async (req, res) =>{
    try {
        const eliminarJuego = await JuegoModel.findByIdAndDelete(req.params.id);
        res.json({mensaje: 'Juego eliminada correctamente'});
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

module.exports = rutas;