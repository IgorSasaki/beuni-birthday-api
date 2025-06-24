# BeUni Birthday API

Sistema de gerenciamento de aniversariantes e brindes corporativos

## ✨ Sobre o Projeto

API RESTful desenvolvida em **Node.js** com **TypeScript**, utilizando **Express**, **TypeORM** e **SQLite** como banco de dados. A API permite o cadastro de funcionários, listagem por filtros, requisição e atualização de status de brindes, além de controle de autenticação JWT e dashboard personalizado.

## ⛏ Tecnologias e Ferramentas

- **Node.js 20.18.0**
- **Express 5.x**
- **SQLite** (via TypeORM)
- **TypeORM** para ORM
- **Zod** para validações
- **JWT** para autenticação
- **dotenv** para variáveis de ambiente
- **ts-node-dev** para ambiente de dev
- **Husky + Lint-staged** para padronização
- **Commitizen** para mensagens semânticas

## 🔨 Instalação

### Usando npm

```bash
npm install
npm run dev
```

### Usando pnpm

```bash
pnpm install
pnpm run dev
```

## ⚙ Scripts

```bash
npm run dev     # Dev server com ts-node-dev
npm run build   # Build para produção (tsc + tsc-alias)
npm run start   # Inicia a aplicação compilada
npm run lint    # ESLint + Prettier
npm run commit  # Commit semântico
```

## 📂 Estrutura de Pastas

```
src/
 ├── controllers/         # Lógica das rotas
 ├── entities/            # Entidades do TypeORM
 ├── middlewares/         # Autenticação e erros
 ├── services/            # Regras de negócio
 ├── validators/          # Zod schemas
 ├── config/              # Banco e inicialização
 └── routes.ts            # Rotas da aplicação
```

## ✨ Endpoints da API

### Auth

| Método | Rota     | Descrição           |
| ------ | -------- | ------------------- |
| POST   | `/users` | Registro de usuário |
| POST   | `/auth`  | Login e gera token  |

### Employees

| Método | Rota             | Descrição                               |
| ------ | ---------------- | --------------------------------------- |
| GET    | `/employees`     | Lista todos os funcionários com filtros |
| GET    | `/employees/:id` | Busca um funcionário por ID             |
| POST   | `/employees`     | Cria um novo funcionário                |

**Filtros disponíveis:**

- `searchText`: Nome, cargo ou departamento
- `department`: Valor do departamento
- `month`: Mês de aniversário (1 a 12)
- `status`: Status do brinde (`PENDING`, `DELIVERED`, etc.)

### Gifts

| Método | Rota             | Descrição                    |
| ------ | ---------------- | ---------------------------- |
| POST   | `/gifts`         | Cria requisição de brinde    |
| PUT    | `/gifts/:giftId` | Atualiza status de um brinde |
| GET    | `/gifts`         | Lista todos os brindes       |

### Dashboard

| Método | Rota         | Descrição                                          |
| ------ | ------------ | -------------------------------------------------- |
| GET    | `/dashboard` | Retorna aniversariantes do mês e brindes pendentes |

- **Variáveis de Ambiente**:

```env
PORT=3333
JWT_SECRET=seu_segredo
```

- **Endpoints da API**: Tabelas por módulo
- **Fluxo de autenticação**:

  - POST /auth gera um token JWT
  - Esse token é usado via Bearer Token nas demais rotas protegidas

- **Filtros disponíveis** nas rotas GET /employees
- **Status dos brindes**: `PENDING`, `SENT`, `DELIVERED`, `NOT_REQUESTED`
