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

//Consultas

//- Listar todos los juegos con la plataforma XBOX
rutas.get('/juego-plataforma/:id', async (req, res) =>{
    try {
        console.log(req.params.id);
        const juegosPlataforma = await JuegoModel.find({ plataforma: req.params.id});
        res.json(juegosPlataforma);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
})

//- Ordenar los juegos por precio de forma ascendente

rutas.get('/ordenar-juego', async (req, res) =>{
    try {
        const juegosASC = await JuegoModel.find().sort({ preciobs: 1});
        res.json(juegosASC);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
})

//- Consultar una tarea especifica por Id

rutas.get('/juego/:id', async (req, res) =>{
    try {
        console.log(req.params.id);
        const juego = await JuegoModel.findById(req.params.id);
        res.json(juego);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
})

//- Eliminar todos los juegos por una categoria determinada determinada

rutas.delete('/eliminar-categoria/:categoria', async (req, res) =>{
    try {
        console.log(req.params.categoria);
        const categoria = req.params.categoria
        const eliminarJuegos = await JuegoModel.deleteMany({categoria});
        res.json({mensaje: 'Juegos eliminados correctamente'});
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

//- Consultar el juego mas reciente anadido a la base de datos

rutas.get('/juego-reciente', async (req, res) =>{
    try {
        const tarea = await JuegoModel.findOne().sort({_id: -1});
        res.json(tarea);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

module.exports = rutas;


