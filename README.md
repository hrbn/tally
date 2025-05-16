# Tally

A notepad calculator PWA with instant calculations as you type.

## Features

- Offers an exstensive  basic arithmeticEvaluates mathematical expressions using the Math.js expression parser, providing an extensive set 
- Unit conversions: Convert between units of measurement and perform calulations on items with different units
- Currency conversions: Convert between currencies, including crypto, using up-to-date exchange rates
- Variables: Define variables and use them throughout your document
- Notepad: Make notes and comments alongside your calculations
- Code editor with auto-suggestions and syntax highlighting

## Installation

To run locally, follow these steps:

1. Clone this repository to your local machine.
2. Set up node environment with `nvm install 20.3.0 && nvm use 20.3.0`. Other versions of node may work but are untested.
3. Install the dependencies by running `yarn install` or `npm install` in the project directory.
4. Create a `.env` file in the root directory and add your CurrencyFreaks API key:
   ```
   VITE_CURRENCY_API_KEY=your_api_key_here
   ```
   You can copy the `.env.example` file and replace `your_api_key_here` with your actual API key.
5. Start the development server by running `yarn start` or `npm run start`.
5. Open your browser and navigate to `http://localhost:3000` to access the app.

## Technology Stack

- TypeScript
- Vite
- React
- MUI Joy UI components
- CodeMirror 6
- Math.js

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
