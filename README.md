# Projeto 02 NodeJS - RocketSeat

Projeto desenvolvido a partir da aula 02 da formação de NodeJSS da RocketSeat. O intuito era criar uma aplicação onde o usuário possa fazer o login, criar, editar, consultar e remover uma refeição e analisar métricas de dados.

Tomei a liberdade para incrementar a segurança dos dados através de bibliotecas de autenticação e criptografia, permitindo que a senha do usuário permaneça segura, além de as rotas serem acessadas apenas pelo usuário logado.

## Framkework

- Fastify

## Bibliotecas

- TypeScript
- KnexJS
- Zod
- Argon2
- Fastify JWT

## Regras da aplicação

- [X] Deve ser possível criar um usuário
- [X] Deve ser possível identificar o usuário entre as requisições
- [X] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    
    *As refeições devem ser relacionadas a um usuário.*
    
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- [X] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [X] Deve ser possível apagar uma refeição
- [X] Deve ser possível listar todas as refeições de um usuário
- [X] Deve ser possível visualizar uma única refeição
- [X] Deve ser possível recuperar as métricas de um usuário
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência de refeições dentro da dieta
- [X] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou