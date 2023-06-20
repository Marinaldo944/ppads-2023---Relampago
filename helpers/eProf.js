module.exports = {
    eProf: function(req, res, next){
        if(req.isAuthenticated() && req.user.cargo == "Professor"){
            return next();
        }else{
        req.flash("error_msg", "Você precisa ter o perfil de professor")
        res.redirect("/")
    }
}
}