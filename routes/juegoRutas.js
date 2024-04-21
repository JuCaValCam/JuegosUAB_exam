const express = require('express');
const rutas = express.Router();
const JuegoModel = require('../models/Juego');
const { connection } = require('mongoose');
const { compareSync } = require('bcrypt');

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
        almacen: req.body.almacen,
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
        res.json({message: 'Juego eliminada correctamente'});
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

//Consultas

//1 - Listar todos los juegos con la plataforma XBOX
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

//2 - Ordenar los juegos por precio de forma ascendente

rutas.get('/ordenar-juego', async (req, res) =>{
    try {
        const juegosASC = await JuegoModel.find().sort({ preciobs: 1});
        res.json(juegosASC);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
})

// 3- Consultar una tarea especifica por Id

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

//4- Eliminar todos los juegos por una categoria determinada determinada

rutas.delete('/eliminar-categoria/:categoria', async (req, res) =>{
    try {
        console.log(req.params.categoria);
        const categoria = req.params.categoria
        const eliminarJuegos = await JuegoModel.deleteMany({categoria});
        res.json({mensaje: 'Juegos eliminados correctamente'});
        
    } 
    catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

//5- Consultar el juego mas reciente anadido a la base de datos

rutas.get('/juego-reciente', async (req, res) =>{
    try {
        const tarea = await JuegoModel.findOne().sort({_id: -1});
        res.json(tarea);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

// 6 Listar los juegos por nombre y plataforma
rutas.get('/nombre-juego', async (req, res) => {
    try {
        console.log(req.params.nombre);
        const nombre = await JuegoModel.find().select({nombre : 1, plataforma: 1 });
        res.json(nombre);
    }
    catch(error){
        res.status(400).json({mensaje: error.message}) 
    } 
});  

// 7 Listar juegos por Categoria y contarlos
rutas.get('/categoriacont-juego', async (req, res) => {
    try {
        const catcon = await JuegoModel.aggregate([
            {$group: { _id: "$categoria", count: {$sum:1}}}]);
        res.json(catcon);

    }
    catch(error){
        res.status(404).json({mensaje: error.message}); 
    } 
});

// 8 Listar juegos entre rango de precios 200 a 500 bs.
rutas.get('/rangop-juego', async (req, res) =>{
    try {
        const rangoprecios = await JuegoModel.find({ preciobs: {$gt: 200, $lte: 500 }});
        res.json(rangoprecios);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

//9 buscar por plataforma y cantidad menor a 100
rutas.get("/plataforma-almacen", async (req, res) =>{
    try {
        const platcan = await JuegoModel.find({ plataforma: 'N64', almacen: {$lt: 100 } });
        res.json(platcan);
    }
    catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

//10 Incrementar precio + 100bs
rutas.get('/increm', async (req, res) =>{
    try {
        const aumn = await JuegoModel.updateMany({ categoria: 'Shoot'}, {$inc: { preciobs: 100} });
        res.json(aumn);
    }
    catch(error){
        response.status(404).json({mensaje: error.message});
    }
});


module.exports = rutas;


