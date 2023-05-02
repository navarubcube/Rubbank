# Rubcamp - MVC Boiterplate

Para rodar o projeto, siga os passos:

1. No terminal, rode os comandos abaixo na sequência:
2. `make up-build`
3. `yarn prisma migrate dev`
4. `yarn dev`

Para Instalar o Make:

1. `sudo apt install make`

A estrutura do projeto está organizado da seguinte maneira:

```
rubcamp
│   README.md
│   .env - Iremos guardar as variáveis de ambiente aqui
│   .dockerignore - Arquivos que serão ignorados pelo Docker
│   .gitignore - Arquivos ignorados pelo Git
│   docker-compose.yml - Arquivo de configuração do Docker Compose
│   Dockerfile - Configurações da Imagem Docker
│   Makefile - Arquivo pra simplificar os comandos digitados
│   package.json - Arquivo de configuração de dependências do projeto
│   tsconfig.json - Arquivo de configuração do Typescript
│   yarn.lock - Arquivo de configuração das dependências (gerado automaticamente)
│
└───src
│   │   index.ts - Configurações do servidor (Express)
│   │
│   └───prisma
│       │   schema.prisma - Esquema do Prisma
│   │
│   └───controllers
│       │   UserController.ts - Exemplo de Controle do Usuário
│   │
│   └───models
│       │   UserModel.ts - Exemplo de Modelo do Usuário
│   │
│   └───routes
│       │   UserRoute.ts - Exemplo de Visão do Usuário
```
