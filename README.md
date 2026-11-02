# Assignment 8 — Sticky Notes API

This project implements a REST API with Node.js, Express, MongoDB, and Mongoose. It includes user and note operations, validation, ownership checks, and a Postman collection.

## Run the API

1. Start MongoDB at `mongodb://127.0.0.1:27017`.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env.development` and set `DB_URI`.
4. Start the server: `npm run start:dev`.

The API listens on `http://localhost:3000` and uses the `sticky_notes` database by default.

## Other solutions

- `postman/Assignment8.postman_collection.json` contains API request examples.
- `bonus.js` contains the longest common prefix exercise. Run it with `node bonus.js`.
