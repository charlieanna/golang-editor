// src/hooks/useFetchExercises.js

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExercises } from '../services/api';

/**
 * Custom hook to fetch exercises based on site and question ID extracted from the URL.
 * @returns {Object} - An object containing exercises, loading state, and error information.
 */
const useFetchExercises = () => {
  const { site, question_id } = useParams(); // Extract 'site' and 'question_id' from the URL
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false); // To prevent duplicate fetches

  useEffect(() => {
    if (hasFetched.current || !site || !question_id) return;
    hasFetched.current = true;

    const getExercisesData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedExercises = await fetchExercises(site, question_id);
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

    getExercisesData();
  }, [site, question_id]);

  return { exercises, isLoading, error };
};

export default useFetchExercises;
