const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const usuarioEsquema = new mongoose.Schema({
    nombreusuario: { type: String, require: true, unique: true},
    correo: { type: String, require: true, unique: true},
    contrasena : { type: String, require: true, unique: true},
})
//middleware para hashear la contraseña
usuarioEsquema.pre('save', async function(next) {
    if (this.isModified('contrasena')){
        this.contrasena = await bcrypt.hash(this.contrasena, 10);
    }
    next();
});

// comparara contraseñas
usuarioEsquema.methods.comparePassword = async function (contrasenaEsperada){
    return await bcrypt.compare(contrasenaEsperada, this.contrasena);
};

const UsuarioModel= mongoose.model('Usuario',usuarioEsquema,'usuario');
module.exports = UsuarioModel;
