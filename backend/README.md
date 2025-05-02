# Gestão Pro - Backend

Backend da aplicação Gestão Pro, desenvolvido com NestJS, Prisma e PostgreSQL.

## Requisitos

- Node.js 18+
- Docker e Docker Compose
- PostgreSQL (via Docker)

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o banco de dados PostgreSQL e pgAdmin:
```bash
docker-compose up -d
```

5. Execute as migrações do Prisma:
```bash
npm run prisma:generate
npm run prisma:migrate
```

## Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento:
```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/api`.

## Estrutura do Projeto

```
src/
├── auth/           # Autenticação e autorização
├── clientes/       # Gerenciamento de clientes
├── compras/        # Gerenciamento de compras
├── pagamentos/     # Gerenciamento de pagamentos
├── produtos/       # Gerenciamento de produtos
├── prisma/         # Configuração do Prisma
└── usuarios/       # Gerenciamento de usuários
```

## Testes

Para executar os testes:
```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## Produção

Para build da aplicação:
```bash
npm run build
```

Para iniciar em produção:
```bash
npm run start:prod
```

## Tecnologias Utilizadas

- NestJS - Framework Node.js
- Prisma - ORM
- PostgreSQL - Banco de dados
- Docker - Containerização
- JWT - Autenticação
- Swagger - Documentação da API
- Jest - Testes
- TypeScript - Linguagem 