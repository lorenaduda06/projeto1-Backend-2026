# 🍳 Sistema de Portfólio de Receitas Culinárias

## 👥 Equipe de Desenvolvimento

| Nome | RA |
|------|-----|
| Caelayne Aparecida Ribeiro Soares | 2766957 |
| Giovanna Furlan Fernandes | 2706385 |
| Lorena Eduarda Barros Martinelli | 2767104 |

## 📋 Sobre o Projeto

Sistema web desenvolvido como projeto da disciplina **Programação Web Back-End** (UTFPR - Campus Cornélio Procópio). Permite o gerenciamento de receitas culinárias, categorias, habilidades e usuários, seguindo o padrão arquitetural **MVC**.

### 👥 Tipos de Usuário

| Tipo | Descrição |
|------|-----------|
| **Aluno** | Pode cadastrar/editar/excluir receitas, gerenciar habilidades e vincular-se a receitas |
| **Administrador** | Controle total sobre alunos, categorias e habilidades |
| **Externo** | Acesso público para visualização de receitas e relatórios |

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Finalidade |
|------------|------------|
| **Node.js** | Runtime JavaScript |
| **Express** | Framework web |
| **Sequelize** | ORM para PostgreSQL |
| **PostgreSQL** | Banco de dados relacional |
| **Express-Handlebars** | Template engine |
| **Express-Session** | Gerenciamento de sessão |
| **Multer** | Upload de imagens |

---

## 📁 Estrutura do Projeto
```
projeto-receitas/
├── 📄 app.js # Configuração principal do servidor
├── 📄 package.json # Dependências do projeto
│
├── 📁 config/
│ └── 📄 db.js # Configuração do banco e relacionamentos
│
├── 📁 controllers/
│ ├── 📄 controllerAluno.js
│ ├── 📄 controllerCategoria.js
│ ├── 📄 controllerHabilidade.js
│ └── 📄 controllerReceita.js
│
├── 📁 models/
│ └── 📁 relational/
│ ├── 📄 aluno.js
│ ├── 📄 alunoHabilidade.js
│ ├── 📄 categoria.js
│ ├── 📄 habilidade.js
│ └── 📄 receita.js
│
├── 📁 routes/
│ └── 📄 route.js # Definição de todas as rotas
│
├── 📁 views/
│ ├── 📁 layouts/
│ ├── 📄 home.handlebars
│ ├── 📄 login.handlebars
│ ├── 📄 main.handlebars
│ └── 📄 noMenu.handlebars
│
│ ├── 📁 aluno/
│ ├── 📄 alunoCreate.handlebars
│ ├── 📄 alunoUpdate.handlebars
│ ├── 📄 alunoList.handlebars
│ └── 📄 alunoHabilidades.handlebars
│
│ ├── 📁 categoria/
│ ├── 📄 categoriaCreate.handlebars
│ ├── 📄 categoriaUpdate.handlebars
│ └── 📄 categoriaList.handlebars
│
│ ├── 📁 habilidade/
│ ├── 📄 habilidadeCreate.handlebars
│ ├── 📄 habilidadeUpdate.handlebars
│ └── 📄 habilidadeList.handlebars
│
│ ├── 📁 receita/
│ ├── 📄 receitaCreate.handlebars
│ ├── 📄 receitaUpdate.handlebars
│ └── 📄 receitaList.handlebars
│
│ └── 📁 publico/
│ ├── 📄 receitasPublico.handlebars
│ └── 📄 relatorioHabilidades.handlebars
│
├── 📁 middlewares/
│ └── 📄 middlewares.js
│
└── 📁 node_modules/
```

---

## 🗄️ Modelo de Banco de Dados

### Tabelas e Relacionamentos

| Tabela | Descrição | Relacionamentos |
|--------|-----------|-----------------|
| `alunos` | Usuários do sistema | N:N com Receitas, N:N com Habilidades |
| `receitas` | Receitas culinárias | N:N com Categorias, N:N com Alunos |
| `categorias` | Categorias das receitas | N:N com Receitas |
| `habilidades` | Habilidades culinárias | N:N com Alunos |

### Tabelas Pivô

| Tabela | Campos | Finalidade |
|--------|--------|------------|
| `receita_categorias` | receita_id, categoria_id | Relacionamento Receita-Categoria |
| `receita_alunos` | receita_id, aluno_id | Relacionamento Receita-Aluno |
| `aluno_habilidades` | aluno_id, habilidade_id, nivel (0-10) | Habilidade do aluno + nível |

---

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js (v22+)
- PostgreSQL (v17+)
- pgAdmin (opcional)

### Passo a Passo

```bash
# 1. Clone o repositório
git clone seu-repositorio.git
cd projeto-receitas

# 2. Instale as dependências
npm install

# 3. Crie o banco de dados no PostgreSQL
# Via pgAdmin ou terminal:
CREATE DATABASE receitasweb_db;

# 4. Configure as credenciais no arquivo config/db.js
const sequelize = new Sequelize("receitasweb_db", "postgres", "sua_senha", {
    host: "localhost",
    dialect: "postgres"
});

# 5. Crie as tabelas no banco
## Em route.js mantenha decomentado apenas o trecho:
db.sequelize.sync({ force: true }).then(() => {
    console.log("Tabelas criadas com sucesso!");
});

## E execute o servidor
node app.js

# 6. Depois, pare a execução do servidor (ctrl + C) para criar o admin (primeiro cadastro do sistema)
## Em route.js mantenha descomentado apenas o trecho:
db.Aluno.create({ nome: "Administrador", email: "admin@gmail.com", senha: "1234", tipo: 1 });

## E execute novamente o servidor
node app.js