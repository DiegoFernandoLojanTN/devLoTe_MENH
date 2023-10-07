const mongoose = require("mongoose");
const Usuarios = mongoose.model("Usuarios");

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu Cuenta en devLoTe',
        tagline: 'Comienza a Publicar tus Vacantes Gratis, Solo debes Registrarte'
    })
}

exports.validarRegistro = (req, res, next) =>{
    //sanatizando los campos, cambiar los datos
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape(); 
    req.sanitizeBody('confirmar').escape();

    req.checkBody('nombre', 'El Nombre es Obligatorio').notEmpty();
    req.checkBody('email', 'El Correo debe ser Valido').isEmail();
    req.checkBody('password', 'La Contraseña no puede ir Vacia').notEmpty();
    req.checkBody('confirmar', 'Repetir Contraseña no puede ir Vacio').notEmpty();

    req.checkBody('confirmar', 'Las contraseñas no Coinciden').equals(req.body.password);
    
    const errores = req.validationErrors();

    if(errores){
        //si hay errores
        //console.log(errores);
        req.flash('error', errores.map(error => error.msg));
        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu Cuenta en devLoTe',
            tagline: 'Comienza a Publicar tus Vacantes Gratis, Solo debes Registrarte',
            mensajes: req.flash()
        });

        return;
    }
    //si todo es correcto
    next();
}

exports.crearUsuario = async (req, res, next) => {
    const usuario = new Usuarios(req.body);
    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }   
};

//formulario para iniciar sesion
exports.formIniciarSesión = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión devLoTe'
    })
}
