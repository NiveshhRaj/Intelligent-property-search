# Intelligent Property Search API

A high-performance backend service built with **NestJS**, **PostgreSQL**, and **TypeORM** that provides intelligent property address searching using exact matching, fuzzy matching, and ranked search suggestions.

---

## Project Overview

The Intelligent Property Search API enables users to search property records efficiently even when the input address contains spelling mistakes, abbreviations, or partial information.

The application combines address parsing, normalization, PostgreSQL trigram search (`pg_trgm`), and a custom ranking algorithm to provide accurate search results and "Did You Mean" suggestions.

---

## Features

* Exact Address Search
* Intelligent Fuzzy Search using PostgreSQL `pg_trgm`
* Address Parsing
* Address Normalization
* Ranked Search Results
* "Did You Mean" Suggestions
* CSV Data Import
* PostgreSQL Database
* TypeORM Migrations
* Swagger API Documentation
* Health Check Endpoint
* Global Exception Handling
* Request Validation
* Modular NestJS Architecture

---

## Technology Stack

### Backend

* NestJS
* TypeScript
* Node.js

### Database

* PostgreSQL
* TypeORM

### Search

* PostgreSQL pg_trgm Extension
* GIN Indexes
* Trigram Similarity Search

### Documentation

* Swagger / OpenAPI

---

## Project Structure

```text
src/
│
├── common/
│   ├── filters/
│   ├── logger/
│
├── config/
│
├── database/
│   ├── migrations/
│   ├── seed/
│
├── health/
│
├── properties/
│   ├── entities/
│   ├── repositories/
│
├── search/
│   ├── controller/
│   ├── dto/
│   ├── normalizer/
│   ├── parser/
│   ├── service/
│
├── app.module.ts
└── main.ts
```

---

## Search Flow

```text
User Input
      │
      ▼
Search Controller
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
      ├──────────────► Match Found
      │                    │
      │                    ▼
      │              Return Result
      │
      ▼
Fuzzy Search (pg_trgm)
      │
      ▼
Ranking Algorithm
      │
      ▼
Did You Mean Suggestions
```

---

## Ranking Algorithm

Each fuzzy search result is assigned a score based on address similarity.

| Component     | Score |
| ------------- | ----: |
| House Number  |    30 |
| Street Name   |    40 |
| Street Suffix |    10 |

Maximum Score = **80**

Results are sorted in descending order to return the most relevant suggestions.

---

## Database Features

* PostgreSQL
* UUID Primary Keys
* GIN Indexes
* Trigram Search (`pg_trgm`)
* Batch CSV Import
* TypeORM Migrations

---

## Installation

Clone the repository:

```bash
git clone https://github.com/NiveshhRaj/intelligent-property-search.git
cd intelligent-property-search
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=intelligent_property_search
```

---

## Running the Application

Development mode:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

---

## Database Migration

Run the database migrations:

```bash
npm run migration:run
```

---

## Seed the Database

Import property records from the CSV file:

```bash
npm run seed
```

---

## API Documentation

Swagger UI:

```text
http://localhost:3000/api/v1/docs
```

---

## API Endpoints

### Health Check

```http
GET /api/v1/health
```

---

### Property Search

```http
GET /api/v1/search?address=5515 Washington Avenue
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

### Did You Mean

```json
{
  "success": true,
  "exactMatch": false,
  "message": "No exact match found. Did you mean one of these?",
  "count": 3,
  "suggestions": [
    "5515 Washington Avenue, Bethlehem, NY 12010",
    "5510 Washington Avenue, Bethlehem, NY 12010",
    "5518 Washington Avenue, Bethlehem, NY 12010"
  ]
}
```

---

## Performance Optimizations

* PostgreSQL GIN Indexes
* pg_trgm Similarity Search
* Batch Database Inserts
* Address Normalization
* Custom Ranking Algorithm
* Duplicate Prevention During Import

---

## Error Handling

The application includes:

* Global Exception Filter
* Request Validation
* Input Sanitization
* Structured Error Responses

---

## Future Improvements

* Pagination Support
* Search Result Caching using Redis
* Search Analytics
* Geospatial Search
* Elasticsearch Integration
* Authentication & Authorization
* Advanced Ranking using Similarity Scores

---

## Author

Developed as part of the **Intelligent Property Search Backend Assignment** using NestJS, PostgreSQL, and TypeORM.
