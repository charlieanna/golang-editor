// src/components/TextFetcher/TextFetcher.js

import React from 'react';
import useFetchExercises from '../../hooks/useFetchExercises';
import { getSiteAndIdFromURL } from '../../utils/url';
import Exercise from './Exercise';

/**
 * TextFetcher Component
 * Fetches and displays a list of coding exercises based on the site and question ID extracted from the URL.
 */
const TextFetcher = () => {
  // Extract 'site' and 'id' from the current URL
  const { site, id } = getSiteAndIdFromURL();

  // Use the custom hook with 'site' and 'id'
  const { exercises, isLoading, error } = useFetchExercises(site, id);

  // Handle cases where 'site' or 'id' is not present
  if (!site || !id) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Learning Objectives</h1>
        <div style={{ marginTop: '20px', color: 'red' }}>
          <p>Invalid URL. Site or ID is missing.</p>
        </div>
      </div>
    );
  }

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

      {/* Handle case when there are no exercises */}
      {!isLoading && !error && exercises.length === 0 && (
        <div style={{ marginTop: '20px' }}>
          <p>No exercises available.</p>
        </div>
      )}
    </div>
  );
};

export default TextFetcher;
