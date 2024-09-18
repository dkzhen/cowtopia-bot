const cron = require("node-cron");
const express = require("express");
const { configDotenv } = require("dotenv");
const { validateToken } = require("./func/CheckValidToken");
const { DailyCheckIn } = require("./func/DailyCheckIn");
const { claimFarming } = require("./func/claimFarming");
const { playGame } = require("./func/playgame");
configDotenv();

// DailyCheckIn();
// claimFarming();
playGame();

// cron.schedule("0 * * * *", DailyCheckIn);
// cron.schedule("0 * * * *", claimFarming);
// cron.schedule("0 * * * *", playGame);

// Start the server
const port = process.env.PORT || 103;
const app = express();

app.get("/", (req, res) => {
  res.send("API cron job server is running");
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
