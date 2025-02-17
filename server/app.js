const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const keysFilePath = 'keys.txt'; // Path to your keys.txt

// Endpoint for redeeming the key
app.post('/redeem', async (req, res) => {
    const { key, guildId, duration } = req.body;

    // Check if the key is valid
    fs.readFile(keysFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading keys file." });
        }

        const keys = data.split('\n');
        if (!keys.includes(key)) {
            return res.status(400).json({ message: "Invalid key." });
        }

        // Proceed to call the bot's /redeem command
        const botToken = 'YOUR_BOT_TOKEN'; // Replace with your bot's token
        const discordApiUrl = `https://discord.com/api/v10/interactions`;

        const commandData = {
            type: 1, // The type for interaction (simple command)
            data: {
                name: 'redeem',
                options: [
                    { name: 'guild_id', value: guildId },
                    { name: 'key', value: key },
                    { name: 'token_type', value: duration }
                ]
            }
        };

        // Call the Discord API to send the interaction
        axios.post(discordApiUrl, commandData, {
            headers: {
                'Authorization': `Bot ${botToken}`
            }
        })
        .then(() => {
            res.json({ message: "Key redeemed successfully! Boosting server now." });
        })
        .catch(err => {
            res.status(500).json({ message: "Error executing the command." });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
