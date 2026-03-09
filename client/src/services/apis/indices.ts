import axios from "axios";
import { BASE_URL, getAuthHeaders } from "./config";

export interface IndexDetail {
  indexName: string;
  exchange: string;
  indexToken: string;
  decimalPrecision: number;
  exchangeSegment: string;
  symbolName: string;
}

export const fetchIndicesApi = async (exchange: string = "BSE") => {
  const token = localStorage.getItem("bearer_token");
  const response = await axios.post(
    `${BASE_URL}/v1/middleware-bff/stocks/index`,
    { exchange },
    { headers: getAuthHeaders(token || "") }
  );
  // console.log("DEBUG: Raw Indices API Response:", response.data);
  return response.data.IndexDetails as IndexDetail[];
};