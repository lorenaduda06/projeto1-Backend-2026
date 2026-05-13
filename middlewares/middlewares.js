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

            // Rotas exclusivas do admin — bloqueia aluno comum
            const rotasAdmin = [
                "/alunoCreate", "/alunoList", "/alunoUpdate", "/alunoDelete",
                "/categoriaCreate", "/categoriaUpdate", "/categoriaDelete",
                "/habilidadeCreate", "/habilidadeUpdate", "/habilidadeDelete"
            ];

            const ehRotaAdmin = rotasAdmin.some(rota => req.url.startsWith(rota));

            if (ehRotaAdmin && req.session.tipo !== 1) {
                return res.redirect("/home");
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

        // Relatório público
        if (req.url === "/public/relatorioHabilidades" && req.method === "GET") return next();

        // Página pública de receitas
        if (req.url === "/receitas" && req.method === "GET") return next();

        // Qualquer rota que comece com "/public/" - acessível (ex: receitas públicas, relatório)
        if (req.url.startsWith("/public/categoria/")) return next();

        // Por padrão, qualquer rota sem login, redireciona para página de login
        res.redirect("/");
    }
}