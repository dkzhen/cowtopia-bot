const { default: axios } = require("axios");

exports.getOfflineProfit = async (token) => {
  try {
    const API_URL = "https://cowtopia-be.tonfarmer.com/user/offline-profit";
    const offlineReward = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return offlineReward.data.data;
  } catch (error) {
    throw error.response.status;
  }
};
