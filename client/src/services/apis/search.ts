import axios from "axios";
import { BASE_URL, getAuthHeaders } from "./config";

export interface SearchResult {
  scripId: string;
  scripToken: string;
  symbolName: string;
  tradingSymbol: string;
  description: string;
  uniqueKey: string;
  exchangeName: string;
  optionType?: string;
  displayExpiryDate?: string;
}

export interface SearchResponse {
  openSearchResponse: SearchResult[];
  count: number;
}

export const fetchGlobalSearch = async (query: string): Promise<SearchResult[]> => {
  // FIX: Most market APIs require at least 3 characters to prevent massive result sets
  if (!query || query.trim().length < 3) return [];

  const token = localStorage.getItem('bearer_token');
  
  try {
    const response = await axios.get<SearchResponse>(
      `${BASE_URL}/v1/api/global-search/search`,
      {
        params: { 
          symbol: query.trim().toUpperCase(), 
          top: 20, 
          skip: 0 
        },
        headers: getAuthHeaders(token || "")
      }
    );

    return response.data?.openSearchResponse || [];
  } catch (error: any) {
    if (error.response?.data) {
      // This will help you see the EXACT validation message in the console
      console.error("Validation Details:", error.response.data.errors);
    }
    throw error;
  }
};