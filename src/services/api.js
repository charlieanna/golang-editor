// src/services/api.js

import axios from 'axios';

// Execute Code
export const executeCode = async (language, code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/execute`, {
      language,
      code,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Base URL of your backend API
const API_BASE_URL = 'http://localhost:8081'; // Update if your backend runs on a different port or domain


export const fetchExercises = async (site, id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/exercises/${site}/${id}`);
    return response.data.exercise; // Assuming the API returns an array of exercises
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};
