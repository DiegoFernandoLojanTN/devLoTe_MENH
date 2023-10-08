const mongoose = require("mongoose");
const Vacante = mongoose.model("Vacante");

exports.mostrarTrabajos = async (req, res, next) => {
  const vacantes = await Vacante.find().lean();
  //console.log(vacantes); // Verifica las vacantes en la consola
  if (!vacantes) return next();

  res.render("home", {
    nombrePagina: "devLoTe",
    tagline:
      "Donde las Empresas Encuentran Talento y los Programadores su Próximo Desafío",
    barra: true,
    boton: true,
    vacantes,
  });
  
};
