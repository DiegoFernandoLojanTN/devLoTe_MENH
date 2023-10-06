const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');


exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante'
    })
}

//agregar las vacantes a la db
exports.agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body);

    //crear arreglo de skils
    vacante.skills = req.body.skills.split(',');

    //almacenar en la bd
    const nuevaVacante = await vacante.save()

    res.redirect(`/vacantes/${nuevaVacante.url}`);
}