import axios from "axios";
import { BASE_URL, getAuthHeaders } from "./config";

// 1. Fetch the list of all watchlists (v1)
export const fetchWatchlistList = async () => {
  const token = localStorage.getItem("bearer_token");
  const response = await axios.get(`${BASE_URL}/v1/api/watchlist/list`, {
    headers: getAuthHeaders(token || ""),
  });
  return response.data;
};

// 2. Fetch scrips for a specific watchlist (v1 POST)
export const fetchWatchlistScrips = async (watchlistId: number) => {
  const token = localStorage.getItem("bearer_token");
  const response = await axios.post(
    `${BASE_URL}/v1/api/watchlist/scrips/list`,
    { watchlistId },
    { headers: getAuthHeaders(token || "") }
  );
  return response.data;
};