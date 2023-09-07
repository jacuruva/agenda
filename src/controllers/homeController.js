const HomeModel = require("../models/HomeModel");
const Contato = require("../models/ContatoModel");

exports.index = async (req, res) => {
  const contato = new Contato();
  const contatos = await contato.buscaContato(req.session.user);

  res.render("index.ejs", { contatos });

  return;
};
