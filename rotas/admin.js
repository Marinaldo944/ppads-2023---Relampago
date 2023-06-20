const express = require("express")
const rotas = express.Router()
const mongoose = require("mongoose")
require("../models/Aluno")
const Aluno = mongoose.model("alunos")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
require("../models/Turma")
const Turma = mongoose.model("turmas")
require("../models/Registro")
const Registro = mongoose.model("registro")
const {eAdmin} = require("../helpers/eAdmin") 
const bcrypt = require("bcryptjs")

rotas.get("/usuarios", eAdmin, async(req, res, next) => {
        const usu = await Usuario.find({}).sort({nome:'asc'}).lean()
        res.render("admin/listaUsuario", {dados: usu});
})
    

rotas.get("/usuarios/add", eAdmin, (req, res) => {
    res.render("admin/addusuario")
}) 

rotas.post("/usuarios/cadastro", eAdmin, (req, res) => {
        
    const novoUsuario = new Usuario({
        nome: req.body.nome,
        matricula: req.body.matricula,
        email: req.body.email,
        cargo: req.body.cargo,
        status: req.body.status,
        senha: req.body.senha
    })

bcrypt.genSalt(10, (erro, salt) => {
    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
       if(erro){
        req.flash("error_msg", "Houve um erro durante o salvamento do usuário") 
        res.redirect("/")
       }  
        novoUsuario.senha = hash
        try{
            novoUsuario.save()
            req.flash("success_msg", "Usuário cadastrado com sucesso")
            res.redirect("/admin//usuarios")  
        } catch (err){
            req.flash("error_msg", "Erro ao cadastrar usuário")
            res.redirect("/admin/usuarios")  
        } 
    
})
})
})



rotas.get("/turmas", eAdmin, async(req, res, next) => {
    const cat = await Turma.find().lean().populate("professor").sort({titulo: "asc"})
    res.render("admin/turmas", {rel_pos: cat});
})

rotas.get("/turmas/add", eAdmin, async(req, res) => {
    const prof = await Usuario.find({cargo: "Professor"}).lean()
    res.render("admin/addturmas", {dados: prof});
})

rotas.post("/turmas/cadastro", eAdmin, async(req, res) => {
    
        const novaTurma = new Turma ({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            turno: req.body.turno,
            professor: req.body.professor,
            dias: req.body.dias
            })

            novaTurma.save()
            res.redirect("/admin/turmas")
})

rotas.get("/alunos", eAdmin, async(req, res, next) => {
    const aln = await Aluno.find().lean().populate("turma").sort({titulo: "asc"})
    res.render("admin/aluno", {aluno: aln});
})

rotas.get("/alunos/add", eAdmin, async(req, res) => {
    const turma = await Turma.find().lean().sort({titulo: "asc"})
    res.render("admin/addalunos", {dados: turma});
})

rotas.post("/alunos/cadastro", eAdmin, (req, res) => {
        
    const novoAluno = new Aluno({
        nome: req.body.nome,
        dt_nasc: req.body.dt_nasc,
        matricula: req.body.matricula,
        serie: req.body.serie,
        turma: req.body.turma,
        resp1: req.body.resp1,
        email1: req.body.email1,
        resp2: req.body.resp2,
        email2: req.body.email2,
        })

        novoAluno.save()
        res.redirect("/admin/alunos")
})

rotas.get("/alunos/del/:id", eAdmin, async(req, res) => {
    const del = await Aluno.findByIdAndDelete({_id: req.params.id})
    res.redirect("/admin/alunos")
})

rotas.get("/turmas/del/:id", eAdmin, async(req, res) => {
    const del = await Turma.findByIdAndDelete({_id: req.params.id})
    res.redirect("/admin/turmas")
})

rotas.post("/usuario/deletar", eAdmin, async(req, res) => {
    const del = await Usuario.findByIdAndDelete({_id: req.body.id})
    res.redirect("/admin/usuarios")
})



module.exports = rotas;