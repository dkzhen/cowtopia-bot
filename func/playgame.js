const axios = require("axios");
const { validateToken } = require("./CheckValidToken");
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createGame(token, API_CREATE_GAME) {
  const play = await axios.post(
    API_CREATE_GAME,
    { game_id: "59bcd12e-04e2-404c-a172-311a0084587d" },
    {
      headers: {
        Authorization: `${token.token}`,
      },
    }
  );
  return play.data.data.round_id;
}

const claimReward = async (token, API_CLAIM_REWARD) => {
  const randomNumber = getRandomNumber(500, 600);
  const claim = await axios.post(
    API_CLAIM_REWARD,
    { game_id: "59bcd12e-04e2-404c-a172-311a0084587d", points: randomNumber },
    {
      headers: {
        Authorization: `${token.token}`,
      },
    }
  );
  return claim.data.data.points;
};

async function checkAvailableGame(token) {
  try {
    const BALANCE_API =
      "https://api-web.tomarket.ai/tomarket-game/v1/user/balance";
    const playPasses = await axios.post(
      BALANCE_API,
      {},
      {
        headers: {
          Authorization: `${token.token}`,
        },
      }
    );

    return playPasses.data.data.play_passes;
  } catch (error) {
    console.log(error);
  }
}

async function delayedExecution(count) {
  console.log(`[ ${count} ] Game started...`);
  await new Promise((resolve) => setTimeout(resolve, 40000));
  console.log(`[ ${count} ] Game ended...`);
}

exports.playGame = async () => {
  const API_CREATE_GAME =
    "https://api-web.tomarket.ai/tomarket-game/v1/game/play";
  const API_CLAIM_REWARD =
    "https://api-web.tomarket.ai/tomarket-game/v1/game/claim";

  const tokens = await validateToken();

  try {
    for (const token of tokens) {
      const availableGame = await checkAvailableGame(token);
      if (availableGame < 1) {
        console.log(`[ Completed ] : no game available to play`);
      } else {
        let gameCount = await checkAvailableGame(token);
        let count = 1;
        while (gameCount > 0) {
          const gameId = await createGame(token, API_CREATE_GAME);
          console.log(`[ ${count} ] Round id : ${gameId}`);
          await delayedExecution(count);
          const claim = await claimReward(token, API_CLAIM_REWARD);
          console.log(`[ ${count} ] Game Points : ${claim}`);

          gameCount--;
          count++;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
