// src/hooks/useFetchExercises.js

import { useState, useEffect, useRef } from 'react';
import { fetchExercises } from '../services/api';

/**
 * Custom hook to fetch exercises based on article content.
 * @param {string} articleContent - The content of the article to generate exercises from.
 * @returns {Object} - An object containing exercises, loading state, and error information.
 */
const useFetchExercises = (articleContent) => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false); // To prevent duplicate fetches

  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate calls
    hasFetched.current = true;

    const getExercisesData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedExercises = await fetchExercises(articleContent);
        if (fetchedExercises.length === 0) {
          setError('No exercises found.');
          return;
        }
        setExercises(fetchedExercises);
      } catch (err) {
        setError('Failed to fetch the exercises. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (articleContent) {
      getExercisesData();
    } else {
      setError('No article content provided.');
    }
  }, [articleContent]);

  return { exercises, isLoading, error };
};

export default useFetchExercises;
