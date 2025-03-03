const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const admin = require("./rotas/admin")
const prof = require("./rotas/prof")
const path = require("path")
const mongoose  = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
const { waitForDebugger } = require("inspector")
const passport = require("passport")
require("./config/auth")(passport)
const db = require("./config/db")
const {MongoClient} = require('mongodb')
const { error } = require("console")



//configurações
    //Sessão
        app.use(session({
            secret: "sistemachamada",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    //Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            next()
        })

    //body parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set("view engine", "handlebars");
    //mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("Conectado ao mongo")
      }).catch((err) => {
        console.log("Erro ao se conectar: "+error)
      })  
    //public
    app.use(express.static(path.join(__dirname,"public")))

//rotas

app.get("/", function(req, res){
    res.render("admin/index")
});

app.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/entrar",
        failureRedirect: "/",
        failureFlash: true
    })(req, res, next)
})

app.get("/entrar", (req, res) => {
    if(req.isAuthenticated() && req.user.cargo == "Secretaria"){
        res.redirect("/admin/usuarios")
    }else{
        res.redirect("/prof");
    }
})

app.get("/logout", (req, res) => {
    req.logout((err) =>{
        if(err){
            return next(err)
            }else{
            req.flash("success_msg", "Deslogado com sucesso")
            res.redirect("/")
            }
    })
})

app.use("/admin", admin)
app.use("/prof", prof)

//outros
const PORT = process.env.PORT || 8081
app.listen(PORT,() => {
console.log("Servidor rodando na porta")
});