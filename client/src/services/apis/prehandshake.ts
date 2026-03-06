    import axios from 'axios';
    import { BASE_URL, getAuthHeaders, STATIC_PUBLIC_KEY } from './config';

    export const preAuthHandshake = async () => { 
    try {
        const response = await axios.post(
            `${BASE_URL}/v1/api/auth/pre-auth-handshake`,
            {
                // Ensure this key matches exactly what the server expects
                devicePublicKey: STATIC_PUBLIC_KEY 
            }, 
            { headers: getAuthHeaders() }
        );
        console.log('Handshake Success!', response.data);
        return response.data;
    } catch (error: any) {
        // Log the full response to see EXACTLY what is missing
        console.error("Detailed Handshake Error:", error.response?.data);
        throw error;
    }
};