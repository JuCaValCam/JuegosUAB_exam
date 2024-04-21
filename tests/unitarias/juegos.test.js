const express = require('express');
const request = require('supertest');
const juegoRutas = require('../../routes/juegoRutas');
const JuegoModel = require('../../models/Juego');
const mongoose = require ('mongoose');

const app = express();
// configurar express para JSON
app.use(express.json());
app.use('/ruta-juego', juegoRutas);
// describe (name, fn)
describe('Pruebas unitarias para las rutas de tareas',()=>{
    beforeEach(async () => {
        // conectar antes de hacer pruebas
     await mongoose.connect('mongodb://127.0.0.1:27017/dbjuegos')
     //await JuegoModel.deleteMany({});
    });
    afterAll(() => {
        // despues de terminar las pruebas cerrar la bd
        return mongoose.connection.close();
    });
    // 1 Traer todos los juegos
    test('Deberia devolver todas las tareas al hace un GET a /ruta-juego', async () => {

        //crear juegos 
        await JuegoModel.create({ nombre: 'Juego 1', plataforma:'N64', descripcion: 'descripcion juego1', categoria: 'NN', preciobs: '99', almacen: '99'});
        await JuegoModel.create({ nombre: 'Juego 2', plataforma:'N64', descripcion: 'descripcion juego2', categoria: 'FF', preciobs: '88', almacen: '88' });
        const res = await request(app).get('/ruta-juego');
        //validar las respuestas 
        expect(res.statusCode).toEqual(200); ///pasoooo
        expect(res.body).toHaveLength(2)// pasoo
    });

    // 2. Agregar juego
    test('Deberia agregar un nuevo juego', async () => {
        const nuevoJuego ={
            nombre: 'ET',
            plataforma: 'SEGA',
            descripcion: 'Extraterrestre test',
            categoria: 'SYFI',
            preciobs: 77,
            almacen: 11,
        }
        const res = await request(app)
            .post('/ruta-juego/agregar')
            .send(nuevoJuego);
   
        expect(res.statusCode).toEqual(201); ///pasooo
        expect(res.body.nombre).toEqual(nuevoJuego.nombre); ///pasoooo
        expect(res.body.plataforma).toEqual(nuevoJuego.plataforma); ///pasoooo
        expect(res.body.descripcion).toEqual(nuevoJuego.descripcion); ///pasoooo
        expect(res.body.categoria).toEqual(nuevoJuego.categoria); ///pasooo
        expect(res.body.preciobs).toEqual(nuevoJuego.preciobs); ///pasooo
        expect(res.body.almacen).toEqual(nuevoJuego.almacen);///pasoo

    });

    // 3 Editar Juegos
    test('Prueba unitaria para editar Juego ', async () => {

        await JuegoModel.create({ nombre: 'Edit 1', plataforma: 'Segagen', descripcion: 'juego1', categoria: 'Edit', preciobs: 30, almacen: 11 });
        await JuegoModel.create({ nombre: 'Edit 2', plataforma: 'Segagen2', descripcion: 'juego2', categoria: 'Edit', preciobs: 20, almacen: 2 });
        await JuegoModel.create({ nombre: 'Edit 3', plataforma: 'Segagen3', descripcion: 'juego3', categoria: 'Edit', preciobs: 10, almacen: 3 });
 
         const juegoEncontrado = await JuegoModel.exists({ nombre: 'Edit 2' });

         console.log(juegoEncontrado);
            //POSTMAN
        const juegoeditado = {
				nombre: 'Juego nuevo(editado)',
				plataforma: 'SEGAS(editado)', 
				descripcion: 'juego nuevo(editado)',
				categoria: 'SYFI(editado)',
				preciobs: 200,
				almacen: 101, };
        console.log("juego editado",juegoeditado);

         const res = await request(app)
            .put(`/ruta-juego/editar/${juegoEncontrado._id}`)
            .send(juegoeditado);

        expect(res.statusCode).toEqual(201);
		expect(res.body.nombre).toEqual(juegoeditado.nombre); 
        expect(res.body.plataforma).toEqual(juegoeditado.plataforma);
        expect(res.body.descripcion).toEqual(juegoeditado.descripcion);
        expect(res.body.categoria).toEqual(juegoeditado.categoria);
        expect(res.body.preciobs).toEqual(juegoeditado.preciobs);
        expect(res.body.almacen).toEqual(juegoeditado.almacen);

    });


    // 4. Elimnar Juego
    test('Eliminar Juego prueba unitaria', async () => {
        const juegoNuevo = await JuegoModel.create({ 
            nombre: 'Juego 11',
            plataforma: 'SEGAS', 
            descripcion: 'juego 1',
            categoria: 'SYFI',
            preciobs: 200,
            almacen: 101, 
        });

        const res = await request(app)
        .delete(`/ruta-juego/eliminar/${juegoNuevo._id}`);
        expect(res.statusCode).toEqual(200); 
        expect(res.body).toEqual({mensaje: 'juego eliminado correctamente'}); 
    });

    // - Ordenar los juegos por precio de forma ascendente
    test('Devolver los juegos ordenados por precio', async () => {

        await JuegoModel.create({ nombre: 'Juego test1', plataforma: 'Segagen', descripcion: 'desc juego1', categoria: 'Test', preciobs: '30', almacen: 11 });
        await JuegoModel.create({ nombre: 'Juego test2', plataforma: 'Segagen2', descripcion: 'desc juego2', categoria: 'Test', preciobs: '20', almacen: 2 });
        await JuegoModel.create({ nombre: 'Juego test3', plataforma: 'Segagen3', descripcion: 'desc juego3', categoria: 'Test', preciobs: '10', almacen: 3 });
        const res = await request(app).get('/ruta-juego/ordenar-juego');
        expect(res.statusCode).toEqual(200); ///pasooo
        //expect(res.body).toHaveLength(3) // pasoo
        expect(res.body[0].preciobs).toEqual(10) // pasoo
        expect(res.body[1].preciobs).toEqual(20) // pasoo
        expect(res.body[2].preciobs).toEqual(30) // pasoo

    });

});


