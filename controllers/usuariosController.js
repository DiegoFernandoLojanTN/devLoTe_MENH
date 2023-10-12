const mongoose = require("mongoose");
const Usuarios = mongoose.model("Usuarios");
const multer = require("multer");
const shortid = require("shortid");

exports.subirImagen = (req, res, next) => {
  upload(req, res, function (error) {
    if (error instanceof multer.MulterError) {
      req.flash("error", "Error al subir la imagen");
      return res.redirect("/editar-perfil");
    } else if (error) {
      req.flash("error", "Ocurrió un error al subir la imagen");
      return res.redirect("/editar-perfil");
    }
    // Si no hay errores, continuar con el siguiente middleware o controlador
    next();
  });
};

//Opciones del multer
const configuracionMulter = {
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + "../../public/uploads/perfiles");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  })),
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: { fileSize: 5000000 }, // 5 MB en bytes (5 * 1024 * 1024 bytes)
};

const upload = multer(configuracionMulter).single("imagen");

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
    cerrarSesion: true,
    nombre: req.user.nombre,
  });
};

//Guardar cambios en editar perfil
exports.editarPerfil = async (req, res) => {
  try {
    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if (req.body.password) {
      usuario.password = req.body.password;
    }

    if (req.file) {
      usuario.imagen = req.file.filename;
    }

    await usuario.save();

    req.flash("correcto", "Cambios Guardados Correctamente");
    return res.redirect("/administracion");
  } catch (error) {
    console.error(error);
    req.flash("error", "Ocurrió un error al guardar los cambios.");
    return res.redirect("/editar-perfil");
  }
};

// sanitizar y validar el formulario de editar perfiles
exports.validarPerfil = (req, res, next) => {
  // sanitizar
  req.sanitizeBody("nombre").escape();
  req.sanitizeBody("email").escape();
  if (req.body.password) {
    req.sanitizeBody("password").escape();
  }
  // validar
  req.checkBody("nombre", "El nombre no puede ir vacio").notEmpty();
  req.checkBody("email", "El correo no puede ir vacio").notEmpty();

  const errores = req.validationErrors();

  if (errores) {
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );

    res.render("editar-perfil", {
      nombrePagina: "Edita tu perfil en devJobs",
      usuario: req.user,
      cerrarSesion: true,
      nombre: req.user.nombre,
      mensajes: req.flash(),
    });
    return;
  }
  next(); // todo bien, siguiente middleware!
};
