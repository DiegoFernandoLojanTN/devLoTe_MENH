const mongoose = require("mongoose");
require("./config/db");
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const flash = require("connect-flash");

require("dotenv").config({ path: "variables.env" });

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// validación de campos
app.use(expressValidator());

// Habilitando Handlebars como motor de plantillas
app.engine(
  "hbs",
  engine({
    defaultLayout: "layout",
    extname: ".hbs",
    layoutsDir: path.join(app.get("views"), "layouts"),
    defaultLayout: "layout",

    helpers: require("./helpers/handlebars"),
  })
);

app.set("view engine", "hbs"); // Configurando Handlebars como el motor de plantillas

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//usando alertas con flash
app.use(flash());

//crear middelware aqui mismito
app.use((req, res, next) => {
  res.locals.mensajes = req.flash();
  next();
});

app.use("/", router());

app.listen(process.env.PUERTO);
