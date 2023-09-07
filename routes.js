const express = require("express");
const route = express.Router();
const homeController = require("./src/controllers/homeController");
const longinController = require("./src/controllers/loginController");
const contatoController = require("./src/controllers/contatoController");
const { loginRequired } = require("./src/middlewares/middleware");

// Rotas Home
route.get("/", homeController.index);

// Rotas de login
route.get("/login/index", longinController.index);
route.post("/login/register", longinController.register);
route.post("/login/login", longinController.login);
route.get("/login/logout", longinController.logout);

// Rotas de Contato
route.get("/contato/index", loginRequired, contatoController.index);
// Criação
route.post("/contato/register", loginRequired, contatoController.register);
route.get("/contato/index/:id", loginRequired, contatoController.editIndex);
// Edição
route.post("/contato/edit/:id", loginRequired, contatoController.edit);
// Delete
route.get("/contato/delete/:id", loginRequired, contatoController.delete);

module.exports = route;
