const dotenv = require("dotenv");
const fs = require("fs").promises;
const axios = require("axios");
const { validateToken } = require("./CheckValidToken");
dotenv.config();

const API_URL = "https://cowtopia-be.tonfarmer.com/mission";
const CLAIM_API_URL = "https://cowtopia-be.tonfarmer.com/mission/check";

exports.claimMission = async function () {
  try {
    const tokens = await validateToken();
    if (tokens.length < 1) return null;
    for (const token of tokens) {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        });

        const missions = response.data.data;

        for (const mission of missions.missions) {
          if (!mission.completed) {
            try {
              const BODY_DATA = {
                mission_key: mission.key,
              };

              const claimResponse = await axios.post(CLAIM_API_URL, BODY_DATA, {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                  "Content-Type": "application/json",
                },
              });

              console.log(
                `[ Running   ] : Claimed ${mission.key} successfully. Response status: ${claimResponse.status} `
              );
            } catch (error) {
              console.log(`[ Error ] : Claim ${mission.key} failed`);
            }
          } else {
            console.log(`[ Completed ] : ${mission.key} completed`);
          }
        }
      } catch (error) {
        console.log(`Error fetching missions data :`, error.response.status);
      }
    }
  } catch (error) {
    console.log(`[ Error ] : Error token file `);
  }
};
