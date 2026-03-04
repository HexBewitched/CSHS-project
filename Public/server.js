import { google } from "googleapis";
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// ---------- GOOGLE AUTH ----------

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = "1Qtf6MsIzHvdugmba-Ti_xqL5iYVBh3ChZIj3QPoSAng";

// ---------- FUNCTIONS ----------

async function appendToSheet(data) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:D",
    valueInputOption: "USER_ENTERED",
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

async function getSheetData() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:D",
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log("No data found.");
      return;
    }

    console.log("Sheet Data (A-D):");
    rows.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });

  } catch (err) {
    console.error("Error retrieving sheet data:", err);
  }
}

// ---------- ROUTES ----------

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/submit-mileage", async (req, res) => {
  try {
    console.log("Received:", req.body);
    await appendToSheet(req.body);
    res.json({ message: "Mileage saved to Google Sheets!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving mileage" });
  }
});

app.get("/get-sheet-data", async (req, res) => {
  await getSheetData();
  res.send("Data logged to server console.");
});

// ---------- START SERVER ----------

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Optional: run once on startup
  await getSheetData();
});
