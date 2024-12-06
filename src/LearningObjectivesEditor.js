import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TextFetcher = () => {
  const [parsedQuestion, setParsedQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasFetched = useRef(false); // Ref to track API call

  // Function to parse the fetched text
  const parseFetchedText = (text) => {
    try {
      const questionMatch = text.match(/Question:\s*(.*?)\s*Options:/s);
      const optionsMatch = text.match(/Options:\s*(.*?)\s*Correct Answer:/s);
      const correctAnswerMatch = text.match(/Correct Answer:\s*(.*?)\s*Explanation:/s);
      const explanationMatch = text.match(/Explanation:\s*(.*)/s);

      if (
        !questionMatch ||
        !optionsMatch ||
        !correctAnswerMatch ||
        !explanationMatch
      ) {
        throw new Error('Invalid text format');
      }

      const question = questionMatch[1].trim();
      const optionsText = optionsMatch[1].trim();
      const correctAnswerText = correctAnswerMatch[1].trim();
      const explanation = explanationMatch[1].trim();

      // Improved regex for options
      const optionRegex = /\s*([a-dA-D])\)\s*([\s\S]*?)(?=\s*[a-dA-D]\)|$)/g;
      let match;
      const options = [];

      while ((match = optionRegex.exec(optionsText)) !== null) {
        const label = match[1].toLowerCase();
        const text = match[2].trim();
        options.push({ label, text });
      }

      // Extract the correct answer label
      const correctAnswerLabel = correctAnswerText.charAt(0).toLowerCase();
      const correctOption = options.find(
        (option) => option.label === correctAnswerLabel
      );

      if (!correctOption) {
        throw new Error('Correct answer not found among options');
      }

      return {
        question,
        options,
        correctAnswer: correctOption,
        explanation,
      };
    } catch (err) {
      console.error('Error parsing fetched text:', err);
      setError('Failed to parse the fetched text. Please check the format.');
      return null;
    }
  };

  // Function to get the 'articleContent' parameter from the URL
  const getArticleContentFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('articleContent') || '';
  };

  // API call to get the text
  const getText = async (articleContent) => {
    setIsLoading(true);
    setError(null);
    setIsSubmitted(false);
    setSelectedOption('');
    setParsedQuestion(null);
    try {
      const response = await axios.get('http://localhost:8080/get-learning-objectives', {
        params: { articleContent },
      });
      const text = response.data.text || 'No text found.';
      const parsed = parseFetchedText(text);
      if (parsed) {
        setParsedQuestion(parsed);
      }
    } catch (err) {
      console.error('Error fetching text:', err);
      setError('Failed to fetch the text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch objectives on component mount
  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate calls
    hasFetched.current = true;

    const articleContent = getArticleContentFromURL();
    if (articleContent) {
      getText(articleContent);
    } else {
      setError('No article content provided.');
    }
  }, []);

  // Handle option change
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption || !parsedQuestion) return;

    const isAnswerCorrect =
      selectedOption.toLowerCase() === parsedQuestion.correctAnswer.label;
    setIsCorrect(isAnswerCorrect);
    setIsSubmitted(true);
  };

  // Function to get option styles based on submission and correctness
  const getOptionStyle = (option) => {
    if (!isSubmitted) return {};

    if (option.label === parsedQuestion.correctAnswer.label) {
      return { backgroundColor: '#d4edda' }; // Green for correct answer
    }

    if (option.label === selectedOption && option.label !== parsedQuestion.correctAnswer.label) {
      return { backgroundColor: '#f8d7da' }; // Red for incorrect selection
    }

    return {};
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Learning Objectives</h1>

      {/* Display Loading Indicator */}
      {isLoading && (
        <div style={{ marginTop: '20px' }}>
          <p>Loading learning objectives...</p>
        </div>
      )}

      {/* Display Error if any */}
      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <p>{error}</p>
        </div>
      )}

      {/* Display Parsed Question */}
      {parsedQuestion && (
        <section style={{ marginTop: '20px' }}>
          <form onSubmit={handleSubmit}>
            <h2>Question:</h2>
            <p>{parsedQuestion.question}</p>

            <h3>Options:</h3>
            {parsedQuestion.options.map((option) => (
              <div
                key={option.label}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  borderRadius: '4px',
                  ...getOptionStyle(option),
                }}
              >
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="option"
                    value={option.label}
                    checked={selectedOption === option.label}
                    onChange={handleOptionChange}
                    required
                    style={{ marginRight: '10px' }}
                  />
                  <strong>{option.label.toUpperCase()})</strong> {option.text}
                </label>
              </div>
            ))}

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
              disabled={!selectedOption}
            >
              Submit Answer
            </button>
          </form>

          {/* Display Feedback */}
          {isSubmitted && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ color: isCorrect ? '#28a745' : '#dc3545' }}>
                {isCorrect ? 'Correct!' : 'Incorrect.'}
              </h3>
              {!isCorrect && (
                <p>
                  You selected <strong>{selectedOption.toUpperCase()})</strong>.
                </p>
              )}
              <p>
                <strong>Correct Answer:</strong> {parsedQuestion.correctAnswer.label.toUpperCase()}) {parsedQuestion.correctAnswer.text}
              </p>
              <p>
                <strong>Explanation:</strong> {parsedQuestion.explanation}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default TextFetcher;
