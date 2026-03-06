import axios from 'axios';
import { BASE_URL, getAuthHeaders } from './config';

export const getMarketStatus = async () => {
    const token = localStorage.getItem('bearer_token');
    try {
        const response = await axios.get(
            `${BASE_URL}/v2/api/stocks/market-status`,
            { headers: getAuthHeaders(token || "") }
        );
        return response.data;
    } catch (error) {
        console.error("Market Status API Error:", error);
        throw error;
    }   
};