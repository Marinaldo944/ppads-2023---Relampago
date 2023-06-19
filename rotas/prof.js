const express = require("express")
const rotas = express.Router()
const mongoose = require("mongoose")
require("../models/Aluno")
const Aluno = mongoose.model("alunos")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
require("../models/Turma")
const Turma = mongoose.model("turmas")
const {eAdmin} = require("../helpers/eAdmin") 


rotas.get("/", async(req, res, next) => {
        const tur = await Turma.find().lean().sort({titulo: "asc"})
        res.render("prof/index", {dados: tur});
})

rotas.get("/listaTurma/:id", async(req, res, next) => {
        const tma = await Turma.findOne({_id: req.params.id}).lean()
        const aln = await Aluno.find({turma: req.params.id}).lean().sort({nome: "asc"})
        res.render("prof/listaTurma", {tma: tma, aluno: aln});
    })

module.exports = rotas;