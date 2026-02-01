import API from './axios';

/**
 * Authentication API Service
 * Handles User and Company registration and login.
 */

// User Endpoints
export const userRegister = (userData) => {
  return API.post('/api/users/register', userData);
};

export const userLogin = (credentials) => {
  return API.post('/api/users/login', credentials);
};

// Company Endpoints
export const companyRegister = (companyData) => {
  return API.post('/api/companies/register', companyData);
};

export const companyLogin = (credentials) => {
  return API.post('/api/companies/login', credentials);
};

export default {
  userRegister,
  userLogin,
  companyRegister,
  companyLogin,
};
