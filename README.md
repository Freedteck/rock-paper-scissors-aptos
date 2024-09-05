# Rock Paper Scissors Game with Aptos Roll

## Overview

This repository contains a Rock Paper Scissors game built on the Aptos blockchain as part of a challenge by Stackup. The original game was provided in the Aptos Roll quest, and I have made several enhancements to improve its functionality and user experience.

## Demo

[Live demo](https://rock-paper-scissors-aptos.vercel.app/)

## Key Features

### Endless Gameplay

- **Restart Game:**

Players can now restart a new game immediately after the current game ends, allowing for continuous play without the need for manual intervention.

### Keeping Score

- **Score Tracking:**

The game keeps track of the number of wins for both the player and the computer, providing a more engaging experience.

### Frontend Interface

- **User-Friendly UI:**

Instead of using the block explorer, a dedicated frontend interface has been built to interact with the deployed smart contract. This interface allows players to play the game directly from their browser, offering a more intuitive and accessible experience.

### Authentication

- **Aptos Keyless Integration:**

The application uses Aptos Keyless for authentication, simplifying the login process and enhancing security.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Freedteck/rock-paper-scissors-aptos.git
   cd rock-paper-scissors-aptos
   ```

2. **Add Environment Variable**

   Create a .env file in the root of the project and add the following environment variables:

   ```bash
   PROJECT_NAME=rock-paper-scissors
   VITE_APP_NETWORK=testnet
   VITE_MODULE_ADDRESS=YOUR_MODULE_ADDRESS_HERE
   ```

   Replace `YOUR_MODULE_ADDRESS_HERE` with the actual module address.

3. **Install Dependencies**

   Install the required dependencies:

   ```bash
   npm install
   ```

4. **Run Scripts**

   ```bash
   npm run move:init
   npm run move:publish # This will generate the `VITE_MODULE ADDRESS` for you
   ```

5. **Start the Development Server**

   ```bash
   npm run dev
   ```

   This will launch the frontend interface. You can interact with the game through your browser.
   Note: You need some APT testnet to start the game

6. **Deploying the Smart Contract**

   To deploy the Smart Contract, run `npm run move:publish`

## Usage

- Open the frontend application in your browser.
- Follow the instructions on the screen to start playing Rock Paper Scissors.
- Click on the `RULES` button to learn how the game works
- The game will keep track of your scores and allow you to play the games multiple times.

## Contributing

If you have suggestions for improvements or would like to contribute, please open an issue or submit a pull request.

## Acknowledgements

- Thanks to Stackup for the challenge and the opportunity to enhance this game.
- Special thanks to the Aptos team for their support and resources.
