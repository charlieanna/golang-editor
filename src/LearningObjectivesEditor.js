import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TextFetcher = () => {
  const [exercises, setExercises] = useState([]); // Array of exercises fetched from the API
  const [selectedOptions, setSelectedOptions] = useState({}); // { exerciseId: selectedOption }
  const [submissionStatus, setSubmissionStatus] = useState({}); // { exerciseId: { isSubmitted: boolean, isCorrect: boolean } }
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasFetched = useRef(false); // Ref to track API call

  // Function to get the 'articleContent' parameter from the URL
  const getArticleContentFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('articleContent') || '';
  };

  // API call to get the exercises
  const getExercises = async (articleContent) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/get-learning-objectives', {
        params: { articleContent },
      });


      // Assuming the API returns a JSON object with an "exercises" array
      const fetchedExercises = response.data.exercises || [];
      if (fetchedExercises.length === 0) {
        setError('No exercises found.');
        return;
      }

      setExercises(fetchedExercises);

      // Initialize submission status for each exercise
      const initialSubmissionStatus = {};
      fetchedExercises.forEach((exercise) => {
        initialSubmissionStatus[exercise.title] = { isSubmitted: false, isCorrect: false };
      });
      setSubmissionStatus(initialSubmissionStatus);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Failed to fetch the exercises. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle option change for a specific exercise
  const handleOptionChange = (exerciseTitle, optionLabel) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [exerciseTitle]: optionLabel,
    }));
  };

  // Handle form submission for a specific exercise
  const handleSubmit = (e, exercise) => {
    e.preventDefault();
    const selectedOption = selectedOptions[exercise.title];

    if (!selectedOption) return;

    const isAnswerCorrect =
      selectedOption.toLowerCase() === exercise.correctAnswer.label.toLowerCase();

    setSubmissionStatus((prev) => ({
      ...prev,
      [exercise.title]: { isSubmitted: true, isCorrect: isAnswerCorrect },
    }));
  };

  // Function to get option styles based on submission and correctness
  const getOptionStyle = (exercise, option) => {
    const status = submissionStatus[exercise.title];
    if (!status || !status.isSubmitted) return {};

    if (option.label.toLowerCase() === exercise.correctAnswer.label.toLowerCase()) {
      return { backgroundColor: '#d4edda' }; // Green for correct answer
    }

    if (
      option.label.toLowerCase() === selectedOptions[exercise.title]?.toLowerCase() &&
      option.label.toLowerCase() !== exercise.correctAnswer.label.toLowerCase()
    ) {
      return { backgroundColor: '#f8d7da' }; // Red for incorrect selection
    }

    return {};
  };

  // Fetch exercises on component mount
  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate calls
    hasFetched.current = true;

    const articleContent = getArticleContentFromURL();
    if (articleContent) {
      getExercises(articleContent);
    } else {
      setError('No article content provided.');
    }
  }, []);

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
          {exercises.map((exercise, index) => (
            <div
              key={index}
              style={{
                marginBottom: '40px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            >
              <h2>
                {exercise.difficulty} Level: {exercise.title}
              </h2>
              <p>
                <strong>Problem:</strong> {exercise.problem_statement}
              </p>
              <p>
                <strong>Instructions:</strong> {exercise.instructions}
              </p>
              {exercise.code_template && (
                <pre
                  style={{
                    backgroundColor: '#f8f9fa',
                    padding: '10px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                  }}
                >
                  {exercise.code_template}
                </pre>
              )}
              {exercise.test_cases && (
                <p>
                  <strong>Test Cases:</strong>
                  <br />
                  {exercise.test_cases.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              )}

              {/* Form for selecting options */}
              {/* Form for submitting code (placeholder) */}
              <form onSubmit={(e) => handleSubmit(e, exercise)}>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    fontSize: '16px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Submit Code
                </button>
              </form>

              {/* Display Feedback */}
              {submissionStatus[exercise.title]?.isSubmitted && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ color: submissionStatus[exercise.title].isCorrect ? '#28a745' : '#dc3545' }}>
                    {submissionStatus[exercise.title].isCorrect ? 'Correct!' : 'Incorrect.'}
                  </h3>
                  {!submissionStatus[exercise.title].isCorrect && (
                    <p>
                      You selected <strong>{selectedOptions[exercise.title].toUpperCase()})</strong>.
                    </p>
                  )}
                  <p>
                    <strong>Correct Answer:</strong>{' '}
                    {exercise.correctAnswer.label.toUpperCase()}) {exercise.correctAnswer.text}
                  </p>
                  {exercise.explanation && (
                    <p>
                      <strong>Explanation:</strong> {exercise.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default TextFetcher;
