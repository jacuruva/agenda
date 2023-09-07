const Contato = require("../models/ContatoModel");

exports.index = async (req, res) => {
  res.render("contato.ejs", { contato: "" });
};

exports.register = async (req, res) => {
  const contato = new Contato(req.body);

  try {
    await contato.register(req.session.user);

    if (contato.errors.length > 0) {
      req.flash("errors", contato.errors);
      req.session.save(function () {
        return res.redirect("/contato/index");
      });
      return;
    }

    req.flash("success", "Seu contato foi criado com sucesso");
    req.session.save(function () {
      return res.redirect(`/`);
    });
  } catch (e) {
    console.log(e);
    res.render("404.ejs");
  }
};

exports.editIndex = async (req, res) => {
  const contato = new Contato();
  try {
    if (!req.params.id) return res.render("404.ejs");

    const dados = await contato.buscaPorId(req.params.id);

    if (!dados) return res.render("404.ejs");

    res.render("contato.ejs", { contato: dados });
  } catch (e) {
    console.log(e);
  }
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404.ejs");
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if (contato.errors.length > 0) {
      req.flash("errors", contato.errors);
      req.session.save(function () {
        return res.redirect("/contato/index");
      });
      return;
    }

    req.flash("success", "Seu contato foi editado com sucesso");
    req.session.save(function () {
      return res.redirect(`/contato/index/${contato.contato._id}`);
    });
  } catch (e) {
    console.log(e);
    res.render("404.ejs");
  }
};

exports.delete = async (req, res) => {
  const contato = new Contato();
  try {
    if (!req.params.id) return res.render("404.ejs");

    const contatos = await contato.delete(req.params.id);

    req.flash("success", "Seu contato foi deletado com sucesso");
    req.session.save(function () {
      return res.redirect(`/`);
    });
  } catch (e) {
    console.log(e);
  }
};
