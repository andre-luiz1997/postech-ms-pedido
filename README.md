<p align="center">
<img loading="lazy" src="./public/POSTECH.gif"/>
</p>

<p align="center">
  <img src="https://img.shields.io/static/v1?label=TypeScript&message=framework&color=blue&style=for-the-badge&logo=typescript"/>
  <img src="https://img.shields.io/static/v1?label=AWS&message=deploy&color=green&style=for-the-badge&logo=aws"/>
  <img src="https://img.shields.io/static/v1?label=Docker&message=container&color=blue&style=for-the-badge&logo=docker"/>
  <img src="https://img.shields.io/static/v1?label=Kubernetes&message=orquestração&color=blue&style=for-the-badge&logo=kubernetes"/>
  <img src="https://img.shields.io/static/v1?label=express&message=4.18.2&color=red&style=for-the-badge&logo=express"/>
  <img src="https://img.shields.io/static/v1?label=mongodb&message=5.6.0&color=green&style=for-the-badge&logo=mongodb"/>
</p>

> :construction: FASE 2 - GERENCIAMENTO DE KUBERNETES :construction:

### Tópicos

* [Descrição do projeto](#descrição-do-projeto)

* [Funcionalidades](#funcionalidades)

* [Como rodar a aplicação](#como-rodar-a-aplicação-arrow_forward)

* [Pré-requisitos(Docker)](#pré-requisitos-com-docker)

* [Pré-requisitos(Kubernetes)](#pré-requisitos-kubernetes)

* [Pré-requisitos(Node)](#pré-requisitos-com-node)

* [Swagger](#swagger)

* [Estrutura](#estrutura)

* [Membros](#membros)

## Descrição do projeto

> Este projeto foi desenvolvido no curso de Pós Graduação de Arquitetura de Software da [Fiap](fiap.com.br). Nele é utilizado a arquitetura hexagonal e é escrito em TypeScript, os dados são salvos em um banco NoSQL, o Mongo, é utilizado containers com o Docker e a orquestração dos containers é feita com Kubernetes.

## Funcionalidades

:heavy_check_mark: Gerenciar clientes  

:heavy_check_mark: Gerenciar produtos/itens e categorias

:heavy_check_mark: Realizar pedidos

## Como rodar a aplicação :arrow_forward:

## Pré requisitos com Docker

:warning: [Docker](https://www.docker.com/)

Para iniciar o projeto utilizando a configuração deixada no Dockerfile
Já com o Docker instalado na máquina, abra um terminal e insira o seguinte comando:

```shell
docker-compose -f .\docker-compose.yaml up
```

ou apenas:

```shell
docker-compose up -d
```

## Pré requisitos Kubernetes

Para rodar o kubernetes, dentro do diretorio digite:

O servidor estará escutando na porta 80;
O banco de dados estará escutando na porta 27000

```shell
kubectl apply -f .\opaque.yaml      
kubectl apply -f .\svc-db.yaml     
kubectl apply -f .\svc-api.yaml     
kubectl apply -f .\pod-db.yaml
kubectl apply -f .\pod-api.yaml
kubectl apply -f .\metrics.yaml
kubectl apply -f .\hpa.yaml
```

## Pré requisitos com Node

:warning: [Node.js](https://nodejs.org/en/download) | [NPM](https://www.npmjs.com/)

### Instalação

1. Clone este repositório em sua máquina:

   ```shell
   git clone https://github.com/andre-luiz1997/tech-challenge-post-tech-fiap.git
    cd tech-challenge-post-tech-fiap
    npm install
   ```

### Scripts Disponíveis

* test: Executa os testes unitários utilizando Jest.
* start: Inicia o repositório em memória utilizando o arquivo src/index.ts.
* dev: Inicia um servidor Express na porta configurada no arquivo .env, utilizando o arquivo src/infra/drivers/server.ts.

Certifique-se de ter as dependências instaladas antes de executar os scripts.

#### Uso

Para executar o projeto, utilize um dos seguintes comandos:

Para iniciar o repositório em memória:

```shell
npm start
```

Para iniciar o servidor Express:

```shell
npm run dev
```

## Swagger

Para abrir o swagger vá para o navegador e abra o link [http://localhost/](http://localhost/)

## Estrutura

```bash
├── api
├── src
|  ├── @types
|  ├── domain
|  |  ├── cliente
|  |  |  ├── controllers
|  |  |  ├── data
|  |  |  ├── dtos
|  |  |  ├── entities
|  |  |  └── usecases
|  |  ├── item
|  |  |  ├── controllers
|  |  |  ├── data
|  |  |  ├── dtos
|  |  |  ├── entities
|  |  |  └── usecases
|  |  ├── pedido
|  |  |  ├── controllers
|  |  |  ├── entities
|  |  |  └── usecases
|  ├── infra
|  |  ├── database
|  |  |  ├── memory
|  |  |  └── mongodb
|  |  └── drivers
|  |     ├── api
|  |     ├── dtos
|  |     └── routes
|  └── shared
|     ├── adapters
|     ├── config
|     ├── exceptions
|     ├── ports
|     └── types
└── swagger
```

# Membros

| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/31369320?v=4" width=115><br><sub>André Luiz Silveira Lucas</sub>](https://github.com/andre-luiz1997) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/23386215?v=4" width=115><br><sub>Bruno Vinicius</sub>](https://github.com/bviniciusilva) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/6961415?v=4" width=115><br><sub>Rafael Gonçalves Pena</sub>](https://github.com/rafaelswitek) |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------: |
