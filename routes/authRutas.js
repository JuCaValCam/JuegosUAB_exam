const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');



// registrar usuarios 
rutas.post('/registro', async (req, res) =>{
    try {
        const {nombreusuario, correo, contrasena} = req.body;
        const usuario = new Usuario ({nombreusuario, correo, contrasena});
        await usuario.save();
        res.status(201).json({mensaje: 'Usuario registrado exitosamente'});
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
// iniciar sesion
rutas.post('/login', async (req, res) =>{
    try {
        const {correo, contrasena} = req.body;
        const usuario = await Usuario.findOne({ correo });
        //encontrar al usuario
        if (!usuario){
            res.status(401).json({mensaje: 'Usuario no encotrado. Credencial incorrecto'});
        }
        //Comparar contrasena 
        const validarContrasena = await usuario.comparePassword(contrasena);
        if (!validarContrasena){
            res.status(401).json({mensaje: 'Credencial incorrecto. Vuelva a intentarlo'});
        }
        const token = jwt.sign( { userId: usuario._id }, 'clave_secreta_servidor',{expiresIn: '2h'});
        res.json(token);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
// xerrar sesion
rutas.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization.split('')[1]; // Obtener token
        const decoded = jwt.verify(token, 'clave_secreta_servidor'); //Verificar token
        const tokendebaja = jwt.sign({ userId: decoded.userId }, 'clave_secreta_servidor', { expiresIn: '0s' });  //Obtiene id de usuario token

        res.json({ mensaje: ' Sesion cerrada ok'});
    } catch (error) {

            res.status(500).json({ mensaje: 'error al cierre', error: error.message });
        
    }
});

// cerrar sesion
rutas.post('/byebye', (req, res) => {
    const sessionID = req.session.id;
    req.sessionStore.destroy(sessionID, (err) => {
        if (err) {
            res.json({error: err})
        }
        res.json({message: "Sesion cerrada ok"})
    })
});







module.exports = rutas;