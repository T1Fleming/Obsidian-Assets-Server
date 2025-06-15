# Obsidian-Assets-Server
Externalize obsidian assets!


## TODO

1. Combine env files to work off one config file
2. I have to start a server and a file watcher. Ideally id want this to be one process
3. Have OS dependent paths and maybe username dependent. This was designed to work on Desktop so whatever makes it easy to access the same vault


## Express Server

This project sets up a simple Express server.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd express-server
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the server, run:
```
npm start
```

The server will be running on `http://localhost:3000`.

## Project Structure

- `src/server.js`: Entry point of the application.
- `src/routes/index.js`: Route definitions for the application.
- `src/controllers/index.js`: Logic for handling requests.
- `src/middleware/index.js`: Middleware functions for the Express app.
- `package.json`: Configuration file for npm.