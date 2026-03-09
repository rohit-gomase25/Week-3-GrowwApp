import axios from "axios";
import { BASE_URL, getAuthHeaders } from "./config";

export interface NewsItem {
  title: string;
  contentSnippet: string;
  link: string;
  publishedDate: string;
  source: string;
}

export const getMarketNews = async (top: number = 10, skip: number = 0): Promise<NewsItem[]> => {
  const token = localStorage.getItem('bearer_token');
  
  try {
    const response = await axios.get<NewsItem[]>(
      `${BASE_URL}/v1/api/stocks/news`,
      {
        params: { top, skip },
        headers: getAuthHeaders(token || "")
      }
    );
    return response.data || [];
  } catch (error) {
    console.error("News API Error:", error);
    throw error;
  }
};