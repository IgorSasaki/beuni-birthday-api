# 📚 Documentação da API – BeUni Birthday API

## 🌐 Visão Geral

A BeUni Birthday API é o backend da plataforma responsável pela **gestão de colaboradores aniversariantes**. Ela permite que empresas gerenciem aniversários de funcionários e simulem o envio de brindes personalizados conforme o mês de nascimento.

A arquitetura do projeto segue os princípios de **Clean Architecture** e **SOLID**, utilizando o ecossistema **Node.js + Express + TypeORM + Zod**, com autenticação via **JWT** e banco de dados **SQLite**.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** v20.18.0
- **Express.js** v5.1.0
- **SQLite3** v5.1.7
- **TypeORM** v0.3.25
- **JWT** para autenticação
- **Zod** para validação de dados
- **ts-node-dev** para ambiente de desenvolvimento
- **Docker + Dockerfile** para build containerizado
- **ESLint + Prettier + Husky + Commitizen** para padronização e qualidade

---

## 📁 Estrutura de Pastas

```
src/
├── config/            # Configurações (Data Source, env)
├── controllers/       # Controllers (ponto de entrada das rotas)
├── entities/          # Entidades do TypeORM
├── middlewares/       # Middlewares (auth)
├── routes/            # Arquivo central de rotas
├── services/          # Regras de negócio (Use Cases)
├── validators/        # Schemas de validação com Zod
├── utils/             # Funções utilitárias
└── server.ts          # Arquivo principal da aplicação
```

---

## 🔐 Autenticação

Todas as rotas protegidas requerem o header:

```http
Authorization: Bearer <token>
```

O token JWT é gerado no login e contém o `userId` que é injetado em `request.user` pelo middleware `authenticate`.

---

## 📘 Endpoints da API

### 📌 **Usuários**

#### `POST /users`

Criação de usuário

```json
Request Body:
{
  "name": "Igor Sasaki",
  "email": "igor@email.com",
  "password": "senha"
}
```

Status: `201 Created`

#### `POST /auth`

Login do usuário

```json
Request Body:
{
  "email": "igor@email.com",
  "password": "senha"
}
```

Response:

```json
{
  "token": "<jwt_token>",
  "user": { "userId": "...", "name": "Igor", "email": "..." }
}
```

---

### 📊 **Dashboard**

#### `GET /dashboard`

Resumo de dados (requer token)

Response:

```json
{
  "totalEmployees": 20,
  "birthdaysThisMonth": [...],
  "requestGiftsThisMonth": [...]
}
```

---

### 👥 **Funcionários (Employees)**

#### `POST /employees`

Criação de um funcionário

```json
Request Body:
{
  "fullName": "João Silva",
  "birthDate": "1995-06-15",
  "cep": "14801-100",
  "street": "Rua Teste",
  "number": "123",
  "complement": "",
  "neighborhood": "Centro",
  "city": "Araraquara",
  "state": "SP",
  "giftSize": "M",
  "position": "frontend-developer",
  "department": "ti"
}
```

Status: `201 Created`

#### `GET /employees`

Listagem com filtros

Query params suportados:

- `searchTerm`: busca por nome, cargo ou depto
- `department`: filtro por departamento
- `month`: número do mês (1–12)
- `status`: `PENDING`, `SENT`, `DELIVERED`

Response:

```json
[
  {
    "employeeId": "uuid",
    "fullName": "...",
    "position": "frontend-developer",
    "department": "ti",
    "birthDate": "1995-06-15",
    "status": "PENDING"
  }
]
```

#### `GET /employees/:employeeId`

Detalhe do funcionário

---

### 🎁 **Brindes (Gifts)**

#### `POST /gifts`

Criação de requisição de brinde

```json
Request Body:
{
  "employeeId": "uuid"
}
```

#### `GET /gifts`

Listagem de todos os brindes do usuário autenticado

#### `PUT /gifts/:giftId`

Atualiza o status do brinde

```json
Request Body:
{
  "status": "DELIVERED" | "SENT"
}
```

---

## ✅ Códigos de Status

- `200 OK`: Sucesso
- `201 Created`: Recurso criado
- `400 Bad Request`: Validação incorreta
- `401 Unauthorized`: Sem token válido
- `404 Not Found`: Não encontrado
- `409 Conflict`: Já existe
- `500 Internal Server Error`: Falha inesperada

---

## 🧪 Testes e Qualidade

- ESLint + Prettier com Husky
- Commitlint com padrão semântico
- Dockerfile otimizado multi-stage
- Scripts de lint, build e start

---

## 📄 Observações

- Todos os campos são validados via Zod com mensagens em inglês
- Utilização de `tsconfig-paths` para aliases internos
- O backend não expõe senhas em nenhuma resposta
- As entidades respeitam relacionamento e segurança via DTOs

---

## ✉️ Contato

Igor Sasaki – Desenvolvedor Full Stack | [github.com/IgorSasaki](https://github.com/IgorSasaki)

Se precisar de ajuda para montar a apresentação ou gravar o pitch técnico, posso gerar isso pra você também.
