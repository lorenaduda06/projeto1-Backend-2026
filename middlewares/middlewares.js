module.exports = {
    logRegister(req, res, next) {
        console.log(req.url + " - " + req.method + " - " + new Date());
        next();
    },

    sessionControl(req, res, next) {
        // Aluno logado: libera tudo
        if (req.session.login !== undefined) {
            res.locals.login = req.session.login;
            res.locals.tipo = req.session.tipo;
            
            if (req.session.tipo === 1) {
                res.locals.admin = true;
            }

            return next();
        }

        // Aluno não logado - libera apenas rotas públicas
        if ((req.url === "/") && (req.method === "GET")) return next();
        if ((req.url === "/login") && (req.method === "GET")) return next();
        if ((req.url === "/login") && (req.method === "POST")) return next();
        if (req.url.startsWith("/public/")) return next();

        // Por padrão, qualquer rota sem login, redireciona para página de login
        res.redirect("/");
    }
}