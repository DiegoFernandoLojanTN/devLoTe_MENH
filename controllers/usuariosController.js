const mongoose = require("mongoose");
const Usuarios = mongoose.model("Usuarios");

exports.formCrearCuenta = (req, res) => {
  res.render("crear-cuenta", {
    nombrePagina: "Crea tu Cuenta en devLoTe",
    tagline: "Comienza a Publicar tus Vacantes Gratis, Solo debes Registrarte",
  });
};

exports.validarRegistro = (req, res, next) => {
  //sanatizando los campos, cambiar los datos
  req.sanitizeBody("nombre").escape();
  req.sanitizeBody("email").escape();
  req.sanitizeBody("password").escape();
  req.sanitizeBody("confirmar").escape();

  req.checkBody("nombre", "El Nombre es Obligatorio").notEmpty();
  req.checkBody("email", "El Correo debe ser Valido").isEmail();
  req.checkBody("password", "La Contraseña no puede ir Vacia").notEmpty();
  req.checkBody("confirmar", "Repetir Contraseña no puede ir Vacio").notEmpty();

  req
    .checkBody("confirmar", "Las contraseñas no Coinciden")
    .equals(req.body.password);

  const errores = req.validationErrors();

  if (errores) {
    //si hay errores
    //console.log(errores);
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );
    res.render("crear-cuenta", {
      nombrePagina: "Crea tu Cuenta en devLoTe",
      tagline:
        "Comienza a Publicar tus Vacantes Gratis, Solo debes Registrarte",
      mensajes: req.flash(),
    });

    return;
  }
  //si todo es correcto
  next();
};

exports.crearUsuario = async (req, res, next) => {
  const usuario = new Usuarios(req.body);
  try {
    await usuario.save();
    res.redirect("/iniciar-sesion");
  } catch (error) {
    req.flash("error", error);
    res.redirect("/crear-cuenta");
  }
};

//formulario para iniciar sesion
exports.formIniciarSesión = (req, res) => {
  res.render("iniciar-sesion", {
    nombrePagina: "Iniciar Sesión devLoTe",
  });
};

// form para editrar el perfiñl del usuario
exports.formEditarPerfil = async (req, res) => {
  const usuario = await Usuarios.findOne({ _id: req.user._id }).lean();

  res.render("editar-perfil", {
    nombrePagina: "Edita tus Datos en devLoTe",
    usuario: usuario,
  });
};

//Guardar cambios en editar perfil
exports.editarPerfil = async (req, res) => {
  const { nombre, email, password } = req.body;
  console.log(req.body);
  // Validar el campo nombre
  if (!nombre || nombre.trim() === "") {
    req.flash("error", "El campo nombre es obligatorio.");
    return res.redirect("/administracion");
  }

  try {
    const usuario = await Usuarios.findById(req.user._id);

    // Actualizar los campos del usuario
    usuario.nombre = nombre;
    usuario.email = email;

    // Si se proporciona una nueva contraseña, actualizarla
    if (password) {
      usuario.password = password;
    }

    // Guardar los cambios en la base de datos
    await usuario.save();

    req.flash("correcto", "Cambios Guardados Correctamente");
    res.redirect("/administracion");
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
    req.flash("error", "Hubo un error al guardar los cambios.");
    res.redirect("/administracion");
  }
};
