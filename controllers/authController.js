const passport = require("passport");
const mongoose = require("mongoose");
const Vacante = mongoose.model("Vacante");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/administracion",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos Campos son Obligatorios",
});

//revisar si esta autenticado o no
exports.verificarUsuario = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  //redireccionar a la iniciar sesion
  res.redirect("/iniciar-sesion");
};

exports.mostrarPanel = async (req, res) => {
  //consultar el usuario autentucado
  const vacantes = await Vacante.find({ autor: req.user._id }).lean();

  res.render("administracion", {
    nombrePagina: "Panel de Administración",
    tagline: "Crea y Administra tus Vacantes",
    cerrarSesion: true,
    nombre: req.user.nombre,
    vacantes,
  });
};

exports.cerrarSesion = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('correcto', 'Cerraste Sesión Correctamente');
    res.redirect("/iniciar-sesion");
  });
};
