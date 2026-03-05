import axios from 'axios';
import { BASE_URL, getAuthHeaders } from './config';

export const getDashboardConfig = async () => {
    const token = localStorage.getItem('bearer_token');
    
    if (!token) {
        throw new Error("No bearer token found in storage");
    }

    try {
        const response = await axios.get(
            // Updated path to include /profile/
            `${BASE_URL}/v1/api/profile/dashboard-config`, 
            { 
                headers: getAuthHeaders(token) 
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Dashboard API Error:", error.response?.data || error.message);
        throw error;
    }
};