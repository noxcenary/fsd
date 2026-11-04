const express = require("express");

const app = express();

// Allows the server to receive JSON data
app.use(express.json());

// Test API
app.get("/", (req, res) => {
    res.json({
        message: "NGO Platform Backend is running!"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});