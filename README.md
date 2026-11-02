# Assignment 8 — Sticky Notes API

This project implements a REST API with Node.js, Express, MongoDB, and Mongoose. It includes user and note operations, validation, and ownership checks.

## Run the API

1. Start MongoDB at `mongodb://127.0.0.1:27017`.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env.development` and set `DB_URI`.
4. Start the server: `npm run start:dev`.

The API listens on `http://localhost:3000` and connects to the database specified by `DB_URI`.

## Other solutions

- `bonus.js` contains the longest common prefix exercise. Run it with `node bonus.js`.
