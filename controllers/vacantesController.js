const mongoose = require("mongoose");
const Vacante = mongoose.model("Vacante");

exports.formularioNuevaVacante = (req, res) => {
  res.render("nueva-vacante", {
    nombrePagina: "Nueva Vacante",
    tagline: "Llena el formulario y publica tu vacante",
  });
};

//agregar las vacantes a la db
exports.agregarVacante = async (req, res) => {
  const vacante = new Vacante(req.body);

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
