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
const nodemailer = require("nodemailer")



rotas.get("/", async(req, res, next) => {
        const tur = await Turma.find().lean().sort({titulo: "asc"})
        res.render("prof/index", {dados: tur});
})

rotas.get("/listaTurma/:id", async(req, res, next) => {
        const tma = await Turma.findOne({_id: req.params.id}).lean()
        const aln = await Aluno.find({turma: req.params.id}).lean().sort({nome: "asc"})
        res.render("prof/listaTurma", {tma: tma, aluno: aln});
})

rotas.post("/regchamada", async(req, res) =>{
               const dados = req.body;
               const chave = Object.keys(dados)[0];
               var aln = await Aluno.findOne({matricula: chave}).populate("turma")
               const chaves = Object.keys(dados)
               const valor = Object.values(dados)
               const novd = []
               for(var i = 0; i < chaves.length; i++) {
               let obj = {};
               obj.mat = chaves[i],
               obj.sit = valor[i]
               novd.push(obj)
               }
               const novoReg = new Registro ({
                        turma: aln.turma,
                        turma_titulo: aln.turma.titulo,
                        reg: novd
                })
                novoReg.save()
                const faltas = []
                for(var i = 0; i < chaves.length; i++) {
                const mati = chaves[i]
                console.log(mati)
                const hist = await Registro.find({reg: { $elemMatch: { mat: mati, sit: "ausente"}}})
                console.log(hist.length)
                console.log(aln.turma.dias)
                const num = aln.turma.dias * 0.3
                console.log(num)
                if(hist.length >= num) {
                        let obj = {}
                        console.log("aluno com mais faltas que o permitido")
                        const falta = await Aluno.find({matricula: chaves[i]}).lean()
                        faltas.push(falta)
                       }
                }
                
                async function main() {

                        // Get Mailer To Go SMTP connection details
                        let mailertogo_host     = process.env.MAILERTOGO_SMTP_HOST;
                        let mailertogo_port     = process.env.MAILERTOGO_SMTP_PORT || 587;
                        let mailertogo_user     = process.env.MAILERTOGO_SMTP_USER;
                        let mailertogo_password = process.env.MAILERTOGO_SMTP_PASSWORD;
                        let mailertogo_domain   = process.env.MAILERTOGO_DOMAIN || "mydomain.com";
                
                let transporter = nodemailer.createTransport({
                        host: mailertogo_host,
                        port: mailertogo_port,
                        requireTLS: true, // Must use STARTTLS
                        auth: {
                                user: mailertogo_user,
                                pass: mailertogo_password,
                        }
                })
                
                let from = `"Sistema-chamada" <noreply@${mailertogo_domain}>`;
                faltas.forEach(aluno => {
                        const mail1 = aluno.email1;
                        const mail2 = aluno.email2;
                        transporter.sendMail({
                        from: from,
                        to: mail1, mail2,
                        subject: "Mensagem automátca do sistema de controle de frequência da escola ABC",
                        text: "Sr(a) responsável pelo aluno"+faltas.nome+", informamos que o referido aluno já atingiu o limite de 30% de ausência para o periodo letivo",
                        })
                        console.log("Message sent: %$", info.messageId);
                        console.log(faltas)
                        res.redirect("/prof")
                        })
                }
        
})
               

     

module.exports = rotas;