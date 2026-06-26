# Intelligent Property Address Search Backend

## Overview

The Intelligent Property Address Search Backend is a NestJS-based REST API that enables fast and intelligent searching of property addresses stored in PostgreSQL.

The application supports exact address matching, fuzzy searching, intelligent ranking, and "Did You Mean" suggestions for misspelled or incomplete user queries. PostgreSQL's `pg_trgm` extension is used to improve search accuracy and performance.

---

## Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- PostgreSQL pg_trgm
- Swagger (OpenAPI)
- Class Validator
- Class Transformer

---

## Features

- Intelligent Address Parsing
- Address Normalization
- Exact Address Search
- PostgreSQL Trigram (pg_trgm) Fuzzy Search
- Intelligent Search Result Ranking
- "Did You Mean" Suggestions
- Health Check Endpoint
- Swagger API Documentation
- CSV Data Import (Batch Seeder)
- PostgreSQL Query Optimization
- GIN Indexes for Fast Search

---

## Project Structure

```
src
├── common
│   ├── filters
│   └── logger
├── config
├── database
│   ├── migrations
│   └── seed
├── health
├── properties
│   ├── entities
│   └── repositories
├── search
│   ├── controller
│   ├── dto
│   ├── normalizer
│   ├── parser
│   └── service
└── main.ts
```

---

## Search Flow

```
User Input
      │
      ▼
Address Parser
      │
      ▼
Address Normalizer
      │
      ▼
Exact Search
      │
      ├── Match Found
      │       │
      │       ▼
      │   Return Property
      │
      ▼
Fuzzy Search (pg_trgm)
      │
      ▼
Ranking Engine
      │
      ▼
Best Matching Property
      │
      ▼
Did You Mean Suggestions
```

---

## Address Normalization

The application standardizes user input before searching.

Examples:

| User Input | Normalized |
| ---------- | ---------- |
| Avenue     | Ave        |
| Street     | St         |
| Road       | Rd         |
| Boulevard  | Blvd       |

Searches are case-insensitive.

---

## Intelligent Search Features

The application supports:

- Exact Address Search
- Misspelled Street Names
- Incorrect House Numbers
- Partial Address Search
- Missing Address Components
- Case-Insensitive Search

Example:

Stored Address

```
5515 Washington Avenue, Bethlehem, NY 12010
```

User Searches

```
5515 Washington Avenue
5515 Washington Ave
5515 Wasington Avenue
515 Washington Ave
Washington Avenue, Bethlehem
```

The system returns the closest matching property along with additional suggestions when an exact match is unavailable.

---

## Intelligent Ranking

Search results are ranked using weighted scoring.

| Component       | Weight                                   |
| --------------- | ---------------------------------------- |
| Street Name     | 40                                       |
| House Number    | 30                                       |
| Street Suffix   | 10                                       |
| City Similarity | Used during PostgreSQL similarity search |

The highest-ranked property is returned as the best match.

---

## PostgreSQL Optimizations

The project uses PostgreSQL query optimization techniques including:

- pg_trgm Extension
- GIN Indexes
- Trigram Similarity
- Optimized Search Queries

---

## Installation

Clone the project

```
git clone https://github.com/NiveshhRaj/Intelligent-property-search.git
```

Install dependencies

```
npm install
```

---

## Environment Variables

Create a `.env` file.

Example

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=property_search

PORT=3000
API_PREFIX=api/v1
```

---

## Database Setup

Enable PostgreSQL pg_trgm extension

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

Run database migrations

```
npm run migration:run
```

Import CSV data

```
npm run seed
```

---

## Running the Application

Development

```
npm run start:dev
```

Production

```
npm run build

npm run start:prod
```

---

## Swagger Documentation

Open

```
http://localhost:3000/api/v1/docs
```

Swagger provides interactive API testing.

---

## API Endpoints

### Health Check

```
GET /api/v1/health
```

---

### Property Search

```
GET /api/v1/search
```

Query Parameters

| Parameter | Required | Description               |
| --------- | -------- | ------------------------- |
| address   | Yes      | Property Address          |
| limit     | No       | Maximum number of results |

Example

```
GET /api/v1/search?address=5515 Washington Avenue&limit=5
```

---

## Example Responses

### Exact Match

```json
{
  "success": true,
  "exactMatch": true,
  "count": 1,
  "data": [
    {
      "fullAddress": "5515 Washington Avenue, Bethlehem, NY 12010"
    }
  ]
}
```

---

### Fuzzy Match

```json
{
  "success": true,
  "exactMatch": false,
  "message": "No exact match found. Showing the closest matching property.",
  "count": 1,
  "data": [
    {
      "fullAddress": "5515 Washington Avenue, Bethlehem, NY 12010"
    }
  ],
  "suggestions": ["5515 Washington Avenue, Bethlehem, NY 12010"]
}
```

---

## Testing

The following scenarios were verified:

- Exact Search
- Case-Insensitive Search
- Address Normalization
- Misspelled Addresses
- Wrong House Numbers
- Partial Address Search
- Intelligent Ranking
- Did You Mean Suggestions
- Health Endpoint
- Swagger API

---

## Assignment Requirements Covered

- NestJS
- PostgreSQL
- TypeORM
- pg_trgm Extension
- Address Normalization
- Exact Search
- Fuzzy Search
- Intelligent Ranking
- Did You Mean Suggestions
- Query Optimization
- Swagger Documentation

---

## Future Improvements

- Redis Caching
- Pagination
- Advanced Ranking Model
- Search Analytics
- Elasticsearch Integration
- Machine Learning-based Address Matching

---

## Author

**Niveshhraj**

M.Tech – Computer Science & Engineering

Sri Ramakrishna Engineering College

Coimbatore, Tamil Nadu
