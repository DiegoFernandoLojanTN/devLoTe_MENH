const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");

const usuariosSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  nombre: {
    type: String,
    required: "Agrega tu Nombre",
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  token: String,
  expira: Date,
});

//metodo para hashear los passwords
usuariosSchema.pre("save", async function (next) {
  //si ya esta
  if (!this.isModified("password")) {
    return next();
  }

  //si no esta hasheado
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

usuariosSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next("El Correo ya esta Registrado");
  } else {
    //console.error(error);
    next(error);
  }
});

// Autenticar Usuarios
usuariosSchema.methods = {
  compararPassword: function (password) {
    return bcrypt.compareSync(password, this.password);
  },
};

module.exports = mongoose.model("Usuarios", usuariosSchema);
