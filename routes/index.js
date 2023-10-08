const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const vacantesController = require("../controllers/vacantesController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");

module.exports = () => {
  router.get("/", homeController.mostrarTrabajos);

  //crear vacantes
  router.get("/vacantes/nueva", authController.verificarUsuario, vacantesController.formularioNuevaVacante);
  router.post("/vacantes/nueva", authController.verificarUsuario, vacantesController.agregarVacante);

  //mostrar vacantes
  router.get("/vacantes/:url", vacantesController.mostrarVacante);

  // Editar Vacante
  router.get("/vacantes/editar/:url", authController.verificarUsuario, vacantesController.formEditarVacante);
  router.post("/vacantes/editar/:url", authController.verificarUsuario, vacantesController.editarVacante);

  //Crear cuentas
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.validarRegistro ,usuariosController.crearUsuario);

  //Autenticar usuarios
  router.get('/iniciar-sesion', usuariosController.formIniciarSesión);
  router.post('/iniciar-sesion', authController.autenticarUsuario);

  //Panel de administracino
  router.get('/administracion', authController.verificarUsuario, authController.mostrarPanel);

  return router;
};
