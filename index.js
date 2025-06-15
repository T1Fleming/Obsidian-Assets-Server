require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8088;

// Get base path from environment variables
const BASE_PATH = process.env.BASE_PATH;

// Validate BASE_PATH is set
if (!BASE_PATH) {
  console.error('BASE_PATH environment variable is not set');
  process.exit(1);
}

// Built-in middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Modified root route to serve images
app.get('/', (req, res) => {
  const { mm, yyyy, id, fileExt } = req.query;
  
  // Validate parameters
  if (!mm || !yyyy || !id || !fileExt) {
    return res.status(400).json({ 
      error: 'Missing required parameters. Please provide mm, yyyy, id, and fileExt.', 
    });
  }

  // Construct the file path
  const imagePath = path.join(BASE_PATH, yyyy, mm, `${id}.${fileExt}`);
  console.log(`Serving image from: ${imagePath}`);

  // Send the file
  res.sendFile(imagePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.status(404).json({ error: 'Image not found' });
      } else {
        console.error(err);
        res.status(500).json({ error: 'Error serving image' });
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});