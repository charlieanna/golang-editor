// src/services/api.js

import axios from 'axios';

// Base URL of your backend API
const API_BASE_URL = 'http://localhost:8080'; // Update if your backend runs on a different port or domain

/**
 * Fetches exercises from the backend API based on the provided article content.
 * @param {string} articleContent - The content of the article to generate exercises from.
 * @returns {Promise<Array>} - A promise that resolves to an array of exercises.
 */
export const fetchExercises = async (articleContent) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-learning-objectives`, {
      params: { articleContent },
    });
    return response.data.exercises || [];
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

/**
 * Executes user-submitted code by sending it to the backend API.
 * @param {string} language - The programming language of the code (e.g., 'golang').
 * @param {string} code - The user-submitted code.
 * @returns {Promise<Object>} - A promise that resolves to the execution result.
 */
export const executeCode = async (language, code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/execute`, {
      language,
      code,
    });
    return response.data;
  } catch (error) {
    console.error('Error executing code:', error);
    throw error;
  }
};
