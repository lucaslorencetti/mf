# REST Kafka API

A simple REST API application that consumes events from Apache Kafka and exposes the data via RESTful endpoints.

## Features

- Consumes order messages from Kafka
- Stores order and product data in SQLite database
- Provides REST endpoints to access the data
- Built with TypeScript, Express, KafkaJS, and Prisma

## Prerequisites

- Node.js (v16+)
- Docker and Docker Compose (for Kafka)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd rest-kafka-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Kafka using Docker Compose

```bash
docker-compose up -d
```

This will start Kafka and Zookeeper services as defined in the `docker-compose.yml` file.

### 4. Set up the database

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 5. Start the application

```bash
npm run dev
```

The application will start on port 3000 by default.

## API Endpoints

### Orders

- `GET /orders` - Get the last 50 orders
- `GET /orders/:id` - Get a specific order by ID

### Products

- `GET /products` - Get all products
- `GET /products/:id` - Get a specific product by ID

## Kafka Message Format

The application consumes messages from the `orders` topic with the following format:

```json
{
  "order_id": "12345",
  "customer_id": "cust123",
  "products": [
    {
      "id": "prod1",
      "quantity": 2
    }
  ],
  "total_amount": 35.50,
  "created_at": "2025-03-27T12:00:00Z"
}
```

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

### Running in Production

```bash
npm start
```

## Project Structure

```
rest-kafka-api/
├── prisma/                  # Prisma ORM configuration and schema
├── src/
│   ├── config/              # Application configuration
│   ├── controllers/         # API controllers
│   ├── kafka/               # Kafka consumer implementation
│   ├── routes/              # API route definitions
│   ├── __tests__/           # Unit tests
│   └── index.ts             # Application entry point
├── docker-compose.yml       # Docker configuration for Kafka
├── package.json             # Project dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## License

MIT
