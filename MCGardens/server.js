import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { askGpt } from './backend/HowToPlantCrop.js';  // Adjust the path as necessary, ensure ES module export

const app = express();
const port = 3000;

// Enabling CORS for all requests
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Serve the static HTML file for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'index.html'));
});

// API endpoint to handle requests to askGpt
app.post('/ask-gpt', async (req, res) => {
  try {
    const content = await askGpt(req.body.plantInput);
    res.json({ success: true, content });
  } catch (error) {
    console.error("Failed to process request:", error);
    res.status(500).json({ success: false, message: error.toString() });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
