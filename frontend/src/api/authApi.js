import API from './axios';

/**
 * Authentication API Service
 * Handles User and Company registration and login.
 */

// User Endpoints
export const userRegister = async (userData) => {
    return await API.post('/users/register', userData);
};

export const userLogin = async (credentials) => {
    return await API.post('/users/login', credentials);
};

// Company Endpoints
export const companyRegister = async (companyData) => {
    return await API.post('/companies/register', companyData);
};

export const companyLogin = async (credentials) => {
    return await API.post('/companies/login', credentials);
};

const authApi = {
    userRegister,
    userLogin,
    companyRegister,
    companyLogin,
};

export default authApi;
