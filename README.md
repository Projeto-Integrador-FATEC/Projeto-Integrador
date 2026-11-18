# Study Lovers – Plataforma de Educação Equitativa

## 📚 Sobre o Projeto

O **Study Lovers** é uma plataforma web desenvolvida com o objetivo de democratizar o acesso à educação para jovens e adultos em situação de vulnerabilidade socioeconômica no Brasil.

A plataforma funciona como um intermediário entre estudantes e instituições que oferecem cursos gratuitos, reunindo oportunidades educacionais em um único ambiente e facilitando o acesso ao conhecimento e à qualificação profissional.

### 🎯 Objetivo

Nosso principal objetivo é promover a igualdade de oportunidades educacionais por meio de uma plataforma digital que:

- Reúna cursos gratuitos de diferentes instituições e provedores.
- Facilite a busca por oportunidades de aprendizagem.
- Organize cursos por categorias, níveis e carga horária.
- Permita avaliações e comentários sobre os cursos.
- Disponibilize recursos de apoio à escolha de cursos.
- Incentive a colaboração por meio de doações.
- Ofereça uma experiência acessível e inclusiva.

## ✨ Funcionalidades

### Para estudantes
- Cadastro e autenticação de usuários.
- Verificação de endereço de e-mail.
- Consulta ao catálogo de cursos.
- Pesquisa e navegação por categorias.
- Visualização dos detalhes dos cursos.
- Avaliação e publicação de comentários.
- Solicitação de acesso ao perfil de administrador.
- Assistente virtual para auxiliar na busca e escolha de cursos.
- Área de doações.

### Para administradores
- Cadastro de novos cursos.
- Edição e exclusão de cursos.
- Gerenciamento dos cursos pelos respectivos responsáveis.
- Associação de administradores aos cursos.
- Acompanhamento das solicitações de novos administradores.

### Gerenciamento administrativo
O sistema possui controle de permissões entre estudantes e administradores.

Os usuários com perfil de estudante podem solicitar acesso administrativo por meio de uma justificativa. Os administradores iniciais (`seedAdmin`) possuem permissão especial para analisar, aprovar ou recusar essas solicitações.

## 🛠️ Tecnologias Utilizadas

### Frontend
- [Next.js 15](https://nextjs.org/) – Framework React para desenvolvimento web.
- [React 18](https://react.dev/) – Biblioteca para construção de interfaces.
- [TypeScript](https://www.typescriptlang.org/) – Tipagem estática.
- [Tailwind CSS 4](https://tailwindcss.com/) – Estilização da aplicação.
- [Shadcn/ui](https://ui.shadcn.com/) – Componentes de interface.
- [Radix UI](https://www.radix-ui.com/) – Componentes acessíveis.
- [Lucide React](https://lucide.dev/) – Biblioteca de ícones.

### Backend e autenticação
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) – Implementação dos endpoints da aplicação.
- [Better Auth](https://www.better-auth.com/) – Gerenciamento de autenticação e sessões.
- [Zod](https://zod.dev/) – Validação de dados.
- [Prisma ORM](https://www.prisma.io/) – Comunicação e gerenciamento do banco de dados.

### Banco de dados e serviços externos
- [PostgreSQL](https://www.postgresql.org/) – Banco de dados relacional.
- [Supabase](https://supabase.com/) – Infraestrutura de banco de dados e armazenamento de imagens.
- [Resend](https://resend.com/) – Serviço de envio de e-mails para verificação de contas.
- [Google Gemini API](https://ai.google.dev/) – Integração com inteligência artificial para o assistente de cursos.

### Testes e infraestrutura
- [Vitest](https://vitest.dev/) – Execução de testes automatizados.
- [Docker](https://www.docker.com/) – Containerização da aplicação.
- [GitHub Actions](https://github.com/features/actions) – Automação do processo de integração e deploy.
- [Amazon EC2](https://aws.amazon.com/ec2/) – Hospedagem da aplicação.
- [GitHub Container Registry](https://github.com/features/packages) – Armazenamento de imagens Docker.

## 🏗️ Arquitetura do Projeto

O projeto utiliza uma arquitetura organizada em camadas, separando as responsabilidades e facilitando a manutenção e evolução do sistema.

A estrutura principal está organizada da seguinte maneira:

```text
src/
├── app/
│   ├── (with-header)/
│   ├── api/
│   ├── DTOs/
│   └── ...
├── components/
├── hooks/
├── lib/
├── models/
├── repositories/
│   └── interfaces/
└── services/
    └── interfaces/

prisma/
├── migrations/
├── seed/
├── schema.prisma
└── seed.ts

tests/
├── unit/
├── integration/
└── bdd/
```

### Organização das camadas

- **App:** páginas da aplicação e endpoints da API.
- **Components:** componentes reutilizáveis da interface.
- **DTOs:** validação e estruturação dos dados recebidos.
- **Hooks:** hooks personalizados do React.
- **Lib:** configurações e recursos compartilhados.
- **Models:** modelos e estruturas de dados.
- **Repositories:** acesso e comunicação com o banco de dados.
- **Services:** implementação das regras de negócio.
- **Tests:** testes unitários, de integração e de aceitação.

## 🚀 Como Iniciar o Projeto

### Pré-requisitos

Antes de iniciar, é necessário possuir:

- Node.js 22 ou superior.
- npm.
- Git.
- Uma instância PostgreSQL, como a disponibilizada pelo Supabase.
- Contas e credenciais dos serviços externos utilizados pela aplicação.

### 1. Clone o repositório

```bash
git clone https://github.com/Projeto-Integrador-FATEC/Projeto-Integrador.git
```

### 2. Acesse a pasta do projeto

```bash
cd Projeto-Integrador
```

Caso necessário, altere para a branch de desenvolvimento:

```bash
git checkout version-4sem
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como referência.

```env
# Autenticação
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Banco de dados PostgreSQL
DATABASE_URL=
DIRECT_URL=

# Supabase
SUPABASE_URL=
SUPABASE_SECRET_KEY=
SUPABASE_STORAGE_BUCKET=cursos

# Resend
RESEND_API_KEY=
EMAIL_FROM="Study Lovers <onboarding@resend.dev>"

# Google Gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.5-flash
```

**Descrição das variáveis:**

| Variável | Finalidade |
|---|---|
| `BETTER_AUTH_SECRET` | Chave secreta para autenticação. |
| `BETTER_AUTH_URL` | Endereço base da aplicação. |
| `DATABASE_URL` | Conexão PostgreSQL utilizada pela aplicação. |
| `DIRECT_URL` | Conexão direta utilizada pelo Prisma CLI. |
| `SUPABASE_URL` | Endereço do projeto Supabase. |
| `SUPABASE_SECRET_KEY` | Chave de acesso ao Supabase. |
| `SUPABASE_STORAGE_BUCKET` | Bucket utilizado para armazenar imagens dos cursos. |
| `RESEND_API_KEY` | Chave de acesso ao serviço Resend. |
| `EMAIL_FROM` | Remetente dos e-mails enviados. |
| `GEMINI_API_KEY` | Chave de acesso à API do Google Gemini. |
| `GEMINI_MODEL` | Modelo de inteligência artificial utilizado. |

As credenciais devem ser obtidas nos respectivos serviços. Nunca compartilhe o arquivo `.env` ou publique suas chaves de acesso no repositório.

### 5. Configure o banco de dados

Após configurar as variáveis de conexão, execute as migrations:

```bash
npm run db:migrate
```

Esse comando aplica as migrations existentes e prepara a estrutura do banco de dados.

Para gerar e popular dados iniciais, o projeto também disponibiliza:

```bash
npm run db:seed
```

**Atenção:** o arquivo `prisma/seed.ts` contém contas e credenciais predefinidas para dados de demonstração. Revise e substitua essas credenciais antes de executar o seed em qualquer ambiente compartilhado ou de produção.

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

### 7. Acesse a aplicação

Abra o endereço abaixo no navegador:

[http://localhost:3000](http://localhost:3000)

## 🧪 Testes Automatizados

O projeto utiliza Vitest para executar testes automatizados, divididos em três categorias:

- **Testes unitários:** verificam individualmente os serviços e componentes da lógica de negócio.
- **Testes de integração:** verificam a comunicação e o funcionamento integrado das partes da aplicação.
- **Testes de aceitação (BDD):** verificam cenários de utilização e comportamentos esperados do sistema.

Para executar todos os testes:

```bash
npm test
```

Para executar os testes com relatório de cobertura:

```bash
npm run test:coverage
```

## 🐳 Docker

O projeto possui configuração para execução utilizando Docker.

Para construir a imagem:

```bash
docker build -t study-lovers .
```

Para iniciar a aplicação:

```bash
docker compose up -d --build
```

Para interromper os containers:

```bash
docker compose down
```

A configuração utiliza o arquivo `compose.yaml` e as variáveis definidas no `.env`.

## ☁️ Deploy e Integração Contínua

O projeto utiliza GitHub Actions para automatizar o processo de publicação e implantação.

O fluxo configurado realiza:

1. Identificação da versão do código.
2. Construção da imagem Docker.
3. Publicação da imagem no GitHub Container Registry.
4. Conexão com a instância Amazon EC2.
5. Atualização dos containers da aplicação.
6. Aplicação automática das migrations durante a inicialização do container.

O processo é configurado no arquivo:

```text
.github/workflows/deploy.yml
```

A implantação depende da configuração dos secrets necessários no GitHub e do ambiente de hospedagem.

## 👥 Equipe do Projeto

| Nome | Função | GitHub |
|---|---|---|
| Alexandre Munhoz de Oliveira  | Dev Team | - |
| Daniel Vigano da Silva | Scrum Master | [@DanielV17](https://github.com/DanielV17) |
| Felipe Domingues Nunes | Dev Team | - |
| Gustavo Santos Rocha | Dev Team | [@GustaHxH](https://github.com/GustaHxH)  |
| Ruan Silva Meira | Dev Team | - |
| Vinícius Silva Dornelas | Dev Team | - |

## 📬 Contato

Se você tiver alguma dúvida, sugestão ou encontrar algum problema, abra uma issue no repositório:

[Projeto-Integrador-FATEC/Projeto-Integrador](https://github.com/Projeto-Integrador-FATEC/Projeto-Integrador)

---

Desenvolvido com ❤️ para promover uma educação mais acessível, inclusiva e equitativa no Brasil.
