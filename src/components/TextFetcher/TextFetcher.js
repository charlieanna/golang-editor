// src/components/TextFetcher/TextFetcher.js

import React from 'react';
import useFetchExercises from '../../hooks/useFetchExercises';
import { getArticleContentFromURL } from '../../utils/url';
import Exercise from './Exercise';

/**
 * TextFetcher Component
 * Fetches and displays a list of coding exercises based on the article content.
 */
const TextFetcher = () => {
  const articleContent = getArticleContentFromURL();
  const { exercises, isLoading, error } = useFetchExercises(articleContent);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Learning Objectives</h1>

      {/* Display Loading Indicator */}
      {isLoading && (
        <div style={{ marginTop: '20px' }}>
          <p>Loading exercises...</p>
        </div>
      )}

      {/* Display Error if any */}
      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <p>{error}</p>
        </div>
      )}

      {/* Display Exercises */}
      {!isLoading && !error && exercises.length > 0 && (
        <section style={{ marginTop: '20px' }}>
          <Exercise exercises={exercises} />
        </section>
      )}
    </div>
  );
};

export default TextFetcher;
