const mongoose = require("mongoose");
const Vacante = mongoose.model("Vacante");

exports.formularioNuevaVacante = (req, res) => {
  res.render("nueva-vacante", {
    nombrePagina: "Nueva Vacante",
    tagline: "Llena el formulario y publica tu vacante",
    cerrarSesion: true,
    nombre: req.user.nombre,
  });
};

//agregar las vacantes a la db
exports.agregarVacante = async (req, res) => {
  const vacante = new Vacante(req.body);

  //agregando quien hizo la vacante
  vacante.autor = req.user._id;

  //crear arreglo de skils
  vacante.skills = req.body.skills.split(",");

  //almacenar en la bd
  const nuevaVacante = await vacante.save();

  res.redirect(`/vacantes/${nuevaVacante.url}`);
};

//mostrando una vacante
exports.mostrarVacante = async (req, res, next) => {
  const vacante = await Vacante.findOne({ url: req.params.url }).lean();
  // si no hay resultados
  if (!vacante) return next();

  res.render("vacante", {
    vacante,
    nombrePagina: vacante.titulo,
    barra: true,
  });
};

//editar vacantes
exports.formEditarVacante = async (req, res, next) => {
  const vacante = await Vacante.findOne({ url: req.params.url }).lean();

  if (!vacante) return next();

  res.render("editar-vacante", {
    vacante,
    nombrePagina: `Editar - ${vacante.titulo}`,
    cerrarSesion: true,
    nombre: req.user.nombre,
  });
};

//mandar consulta a la bd
exports.editarVacante = async (req, res) => {
  const vacanteActualizada = req.body;

  vacanteActualizada.skills = req.body.skills.split(",");

  const vacante = await Vacante.findOneAndUpdate(
    { url: req.params.url },
    vacanteActualizada,
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  res.redirect(`/vacantes/${vacante.url}`);
};

// Validar y Sanitizar los campos de las nuevas vacantes
exports.validarVacante = (req, res, next) => {
  console.log(req.body);
  // sanitizar los campos
  req.sanitizeBody("titulo").escape();
  req.sanitizeBody("empresa").escape();
  req.sanitizeBody("ubicacion").escape();
  req.sanitizeBody("salario").escape();
  req.sanitizeBody("contrato").escape();
  req.sanitizeBody("skills").escape();

  // validar
  req.checkBody("titulo", "Agrega un Titulo a la Vacante").notEmpty();
  req.checkBody("empresa", "Agrega una Empresa").notEmpty();
  req.checkBody("ubicacion", "Agrega una Ubicación").notEmpty();
  req.checkBody("contrato", "Selecciona el Tipo de Contrato").notEmpty();
  req.checkBody("skills", "Agrega al menos una habilidad").notEmpty();

  const errores = req.validationErrors();

  if (errores) {
    // Recargar la vista con los errores
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );

    res.render("nueva-vacante", {
      nombrePagina: "Nueva Vacante",
      tagline: "Llena el formulario y publica tu vacante",
      cerrarSesion: true,
      nombre: req.user.nombre,
      mensajes: req.flash(),
    });
    return;
  }

  next(); // siguiente middleware
};

exports.eliminarVacante = async (req, res) => {
  const { id } = req.params;
  try {
    const vacante = await Vacante.findByIdAndDelete(id);
    if (verificarAutor(vacante, req.user)) {
      res.status(200).send("Vacante Eliminada Correctamente");
    } else {
      res.status(403).send("No estás autorizado para eliminar esta vacante");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const verificarAutor = (vacante = {}, usuario = {}) => {
  if (!vacante.autor.equals(usuario._id)) {
    return false;
  }
  return true;
};
