const Login = require("../models/LoginModel.js");

exports.index = (req, res) => {
  if (req.session.user) {
    res.render("login-logado.ejs");
  }
  res.render("login.ejs");
};

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);

    await login.register();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        return res.redirect("/login/index");
      });
      return;
    }

    req.flash("success", "Seu e-mail foi criado");
    req.session.save(function () {
      return res.redirect("/login/index");
    });
  } catch (e) {
    res.render("404.ejs");
    console.log(e);
  }
};

exports.login = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.login();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        return res.redirect("/login/index");
      });
      return;
    }

    req.flash("success", "Você logou com sucesso");
    req.session.user = login.user;
    req.session.save(function () {
      return res.redirect("/login/index");
    });
  } catch (e) {
    console.log(e);
    res.render("404.ejs");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
