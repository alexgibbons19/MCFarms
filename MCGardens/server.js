import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { askGpt } from './backend/HowToPlantCrop.js';
import { askOptimalCrops } from './backend/OptimalCrop.js'; // Corrected import syntax

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

// API endpoint to handle requests for optimal crops based on location
app.post('/get-optimal-crops', async (req, res) => {
  try {
    const location = req.body.location;
    const response = await askOptimalCrops(location);
    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to fetch data' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
