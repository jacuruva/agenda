require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.CONNECTION)
  .then(() => {
    console.log("Conectei a base de dados");
    app.emit("iniciado");
  }) // alterar no futuro
  .catch((e) => console.log(e));

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const routes = require("./routes");
const path = require("path");
const helmet = require("helmet");
const csrf = require("csurf");
const {
  middlewareGlobal,
  csrfError,
  csrfMiddleware,
} = require("./src/middlewares/middleware");

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
  secret: "sad%^&*dywuW&^5re8^&%d8&",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTION }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash());

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("views engine", "ejs");

app.use(csrf());
app.use(csrfError);
app.use(csrfMiddleware);
app.use(middlewareGlobal);
app.use(routes);

app.on("iniciado", () => {
  app.listen(3000, () => {
    console.log("Iniciando servidor");
    console.log("Servidor foi aberto na porta 3000: http://localhost:3000");
  });
});
