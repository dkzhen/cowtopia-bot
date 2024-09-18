const { default: axios } = require("axios");
const { validateToken } = require("./CheckValidToken");

exports.claimFarming = async () => {
  try {
    const tokens = await validateToken();

    for (const token of tokens) {
      const res = await axios.post(
        "https://api-web.tomarket.ai/tomarket-game/v1/farm/claim",
        { game_id: "53b22103-c7ff-413d-bc63-20f6fb806a07" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token.token}`,
          },
        }
      );

      if (res.data.status === 500) {
        console.log(`[ Completed ] : ${res.data.message}`);
        try {
          const start = await axios.post(
            "https://api-web.tomarket.ai/tomarket-game/v1/farm/start",
            { game_id: "53b22103-c7ff-413d-bc63-20f6fb806a07" },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token.token}`,
              },
            }
          );
          console.log(`[ Running ] : Farming started ${start.data}`);
        } catch (error) {
          console.log(error.message);
        }
      } else {
        console.log(
          `[ Running ] : Claim this time Rewards : ${res.data.data.points}`
        );
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
