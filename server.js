const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route root to popup.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'popup.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
