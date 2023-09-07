const mongoose = require("mongoose");
const validator = require("validator");

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  telefone: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  criadoEm: { type: Date, default: Date.now },
  identify: { type: String, required: true, default: "" },
});

const ContatoModel = mongoose.model("Contato", ContatoSchema);

class Contato {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
  }

  async register(id) {
    this.valida(id);
    if (this.errors.length > 0) return;

    if (this.body.nome.length > 10) {
      this.errors.push("O nome deve conte no máximo 10 caracteres");
    }
    if (this.body.sobrenome.length > 15) {
      this.errors.push("O sobrenome deve conte no máximo 15 caracteres");
    }
    if (this.body.telefone.length > 15) {
      this.errors.push("O numero de telefone deve conte no máximo 15 números");
    }
    if (this.body.email.length > 35) {
      this.errors.push("O emai deve conter no máximo 35 caracteres");
    }
    if (this.errors.length > 0) return;

    this.contato = await ContatoModel.create(this.body);
  }

  async edit(id) {
    if (typeof id !== "string") return;
    this.valida();
    if (this.errors.length > 0) return;

    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });
  }

  async buscaPorId(id) {
    if (typeof id !== "string") return;

    const contato = await ContatoModel.findById(id);
    return contato.toObject();
  }

  async buscaContato(identify) {
    const contatos = await ContatoModel.find({ identify: identify }).sort({
      criadoEm: -1,
    });
    return contatos;
  }

  async delete(id) {
    if (typeof id !== "string") return;

    const contatos = await ContatoModel.findByIdAndDelete(id);
  }

  valida(id) {
    this.cleanUp(id);

    if (this.body.email && !validator.isEmail(this.body.email)) {
      this.errors.push("E-mail inválido");
    }
    if (!this.body.nome) this.errors.push("Nome é um campo obrigatório");
    if (!this.body.email && !this.body.telefone)
      this.errors.push(
        "É obrigatório pelo menos um meio de contato ser enviado"
      );
  }

  cleanUp(id) {
    for (let key in this.body) {
      if (typeof this.body[key] !== "string") this.body[key] = "";
    }

    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      telefone: this.body.telefone,
      email: this.body.email,
      identify: id,
    };
  }
}

module.exports = Contato;
