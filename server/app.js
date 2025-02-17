const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Middleware to parse JSON requests

// Read the keys from keys.txt (Assuming each key is on a new line)
const keys = fs.readFileSync("./server/keys.txt", "utf-8").split("\n").map(key => key.trim());

// POST endpoint to handle redeeming the key
app.post("/redeem", async (req, res) => {
    const { key, guildId, duration } = req.body;

    // Check if the key is valid
    if (!keys.includes(key)) {
        return res.json({ success: false, error: "Invalid key!" });
    }

    // Check if the duration is valid (either 1 or 3 months)
    if (duration !== "1" && duration !== "3") {
        return res.json({ success: false, error: "Invalid duration!" });
    }

    // Send the /redeem command to the bot
    try {
        const botToken = "MTMxNDAzMzM3ODEzNTI0NDg5MQ.GL-Le_.GkXGqt01K41XCkFSnEyTMH0ILZMWv3jhxNom6E";
        const command = `/redeem ${guildId} ${key} ${duration}`;

        // Make a request to the bot (replace with your bot API if using one)
        await axios.post(`https://discord.com/api/v9/interactions`, {
            type: 1,
            data: {
                content: command,
                token: botToken
            }
        });

        // Respond back with success
        res.json({ success: true });
    } catch (error) {
        console.error("Error in redeem command:", error);
        res.json({ success: false, error: "Failed to send command to bot." });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
