# Mercafacil - REST Kafka API

Uma API REST que consome eventos do Apache Kafka, processa pedidos e gerencia produtos com atualização automática.

## Funcionalidades

- Consome mensagens de pedidos do Kafka e atualiza o estoque automaticamente
- Armazena dados de pedidos e produtos em banco de dados SQLite
- Atualiza produtos periodicamente a partir de arquivo JSON (a cada 30 minutos)
- Fornece endpoints REST para acessar e gerenciar os dados
- Inclui rota para simulação de envio de pedidos para testes (para facilitar o script de simulação de envio de pedidos, toda a estrutura dele está isolada no arquivo `src/routes/mock/produce.ts`)

## Tecnologias

- Node.js com TypeScript e ES Modules
- Express para API REST
- KafkaJS para integração com Kafka
- Prisma ORM para acesso ao banco de dados
- node-cron para agendamento de tarefas
- Jest para testes unitários

## Pré-requisitos

- Node.js (v16+)
- Docker e Docker Compose (para Kafka)

## Começando

### 1. Clone o repositório

```bash
git clone https://github.com/lucaslorencetti/mf.git
cd mf
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e ajuste as configurações conforme necessário.

```bash
cp .env.example .env
```

### 4. Inicie o Kafka com Docker Compose

```bash
docker-compose up -d
```

Isso iniciará os serviços Kafka, Zookeeper e Kafka UI conforme definido no arquivo `docker-compose.yml`.

### 5. Configure o banco de dados

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 6. Inicie a aplicação

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm run build
npm start
```

## Endpoints da API

- `GET /health` - Verifica o status da API
- `GET /products` - Lista todos os produtos
- `GET /products/:id` - Obtém um produto pelo ID
- `POST /products/update-from-file` - Atualiza produtos a partir do arquivo JSON (esta rota faz o mesmo procedimento do job de 30 minutos)
- `GET /orders` - Lista todos os pedidos
- `GET /orders/:id` - Obtém um pedido pelo ID
- `POST /db/reset` - Limpa o banco de dados (útil para testes)
- `POST /mock/produce` - Envia pedidos de exemplo para o Kafka (para facilitar o script de simulação de envio de pedidos, toda a estrutura dele está isolada no arquivo `src/routes/mock/produce.ts`)

## Testes

Execute os testes unitários:

```bash
npm test
```

## Interface Kafka

Acesse a interface Kafka UI em `http://localhost:8080` para visualizar tópicos e mensagens.

## Insomnia

O projeto inclui um arquivo `insomnia.json` na raiz que pode ser importado no Insomnia para testar facilmente todas as rotas da API. O arquivo contém:

- Todas as rotas organizadas em pastas (Products, Orders, Database)
- Ambientes configurados para desenvolvimento e produção
- Exemplos de requisições para cada endpoint

Para usar:
1. Abra o Insomnia
2. Vá em "Application" > "Preferences" > "Data" > "Import Data" > "From File"
3. Selecione o arquivo `insomnia.json` do projeto
4. Todas as rotas estarão disponíveis para teste

## Estrutura do Projeto

```
rest-kafka-api/
├── prisma/                  # Configuração e schema do Prisma ORM
├── src/
│   ├── __tests__/           # Testes unitários e de integração
│   ├── controllers/         # Controladores da API
│   ├── data/                # Arquivos de dados (ex: products.json)
│   ├── db/                  # Configuração do banco de dados
│   ├── jobs/                # Tarefas agendadas (cron jobs)
│   ├── kafka/               # Configuração e consumidores Kafka
│   │   └── consumers/       # Implementação dos consumidores por tópico
│   ├── routes/              # Definições de rotas da API
│   ├── scripts/             # Scripts utilitários (ex: mockProducer)
│   ├── services/            # Lógica de negócios
│   ├── types/               # Definições de tipos TypeScript
│   ├── utils/               # Funções utilitárias
│   └── index.ts             # Ponto de entrada da aplicação
├── docker-compose.yml       # Configuração Docker para Kafka e Zookeeper
├── .env                     # Variáveis de ambiente
├── package.json             # Dependências e scripts do projeto
└── tsconfig.json            # Configuração TypeScript
```

## Licença

MIT
