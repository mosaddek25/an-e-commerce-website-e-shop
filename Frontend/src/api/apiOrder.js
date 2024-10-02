import axios from 'axios';
import { API } from '../utils/config';

export const addToCart = (token, cartItem) => {
    return axios.post(`${API}/cart`, cartItem, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

export const getCartItems = (token) => {
    return axios.get(`${API}/cart`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export const updateCartItems = (token, cartItem) => {
    return axios.put(`${API}/cart`, cartItem, {
        headers: {
            "Content-Type": `application/json`,
            "Authorization": `Bearer ${token}`
        }
    })
}

export const deleteCartItem = (token, cartItem) => {
    return axios.delete(`${API}/cart/${cartItem._id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export const getProfile = token => {
    return axios.get(`${API}/profile`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export const updateProfile = (token, data) => {
    return axios.post(`${API}/profile`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

export const initPayment = (token) => {
    console.log("Initiating payment request..."); // Add this for debugging
    return axios.post('/api/payment/init', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        console.log("Payment response: ", response);  // Add this for debugging
        return response;
    }).catch(error => {
        console.error("Payment initiation error: ", error); // Add this for debugging
        throw error;
    });
};
