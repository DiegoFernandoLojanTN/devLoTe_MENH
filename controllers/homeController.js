exports.mostrarTrabajos = (req, res) => {
    res.render('home', {
        nombrePagina: 'devLoTe',
        tagline: 'Donde las Empresas Encuentran Talento y los Programadores su Próximo Desafío',
        barra: true,
        boton: true
    })
}