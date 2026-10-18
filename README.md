# Tally

A notepad calculator Progressive Web App (PWA) with instant calculations as you type.

## Features

- Evaluates mathematical expressions using the Math.js expression parser
- Unit conversions and calculations
- Currency conversions, including crypto, using up-to-date exchange rates
- Define variables and use them throughout your document
- Make notes and comments alongside your calculations
- Code editor with auto-suggestions and syntax highlighting

## Installation

To run locally, follow these steps:

1. Clone this repository.
2. Install [Bun](https://bun.sh) and Node 20 (e.g. `nvm install 20 && nvm use 20`). Bun is the package manager; Vite and Vitest still run on Node.
3. Install the dependencies by running `bun install` in the project directory.
4. Create a `.env` file in the root directory and add your CurrencyFreaks API key:
   ```
   VITE_CURRENCY_API_KEY=your_api_key_here
   ```
   You can copy the `.env.example` file and replace `your_api_key_here` with your actual API key.
5. Start the development server by running `bun run start`.
6. Open your browser and navigate to `http://localhost:3000` to access the app.

## Testing

Run the test suite with `bun run test` (or `bun run test:coverage`). Use `bun run test`, not `bun test`: the suite runs on Vitest, not Bun's test runner.

Check types with `bun run typecheck`.

## Technology Stack

- TypeScript
- Vite
- React
- MUI Joy UI components
- CodeMirror 6
- Math.js

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
