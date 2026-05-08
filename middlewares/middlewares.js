module.exports = {
    // Registra no console todas as requisições feitas ao servidor (para debugging e monitoramento)
    logRegister(req, res, next) {
        console.log(req.url + " - " + req.method + " - " + new Date());
        next();     // next() passa a requisição para o próximo middleware ou rota
    },

    // Verifica se o usuário está logado antes de permitir acesso às rotas
    // Se não estiver logado, redireciona para o login
    sessionControl(req, res, next) {
        // Aluno logado: libera tudo
        if (req.session.login !== undefined) {
            // res.locals disponibiliza variáveis para TODAS as views
            // Qualquer página renderizada saberá quem é o usuário logado
            res.locals.login = req.session.login;
            res.locals.tipo = req.session.tipo;
            
            // Se o tipo for 1 (administrador), a view saberá que pode mostrar botões de admin
            if (req.session.tipo === 1) {
                res.locals.admin = true;
            }

            // Usuário logado pode acessar qualquer rota
            return next();
        }

        // Aluno não logado - libera apenas rotas públicas

        // Rota raiz "/" - acessível (página inicial pública)
        if ((req.url === "/") && (req.method === "GET")) return next();

        // Tela de login (GET) - acessível
        if ((req.url === "/login") && (req.method === "GET")) return next();

        // Envio do formulário de login (POST) - acessível
        if ((req.url === "/login") && (req.method === "POST")) return next();

        // Qualquer rota que comece com "/public/" - acessível (ex: receitas públicas, relatório)
        if (req.url.startsWith("/public/")) return next();

        // Por padrão, qualquer rota sem login, redireciona para página de login
        res.redirect("/");
    }
}