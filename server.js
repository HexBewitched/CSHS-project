const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files (your frontend)
app.use(express.static('public'));

// Test route
app.get('/', (req, res) => {
    res.send("Server is running");
});

// Mileage POST route
app.post('/submit-mileage', (req, res) => {
    console.log("Received data:", req.body);
    res.json({ message: "Mileage received!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
