const { google } = require('googleapis');
const fs = require('fs');

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
app.post('/submit-mileage', async (req, res) => {
    try {
        console.log("Received:", req.body);

        await appendToSheet(req.body);

        res.json({ message: "Mileage saved to Google Sheets!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving mileage" });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function appendToSheet(data) {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1Qtf6MsIzHvdugmba-Ti_xqL5iYVBh3ChZIj3QPoSAng';

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:D',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [[
                data.name,
                data.date,
                data.miles,
                data.notes
            ]]
        }
    });
}
