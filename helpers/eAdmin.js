module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.cargo == "Secretaria"){
            return next();
        }else{
        req.flash("error_msg", "Você precisa ter o perfil de secretaria")
        res.redirect("/")
    }
}
}