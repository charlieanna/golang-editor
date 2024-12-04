import React, { useState } from 'react';
import axios from 'axios';

const TextFetcher = () => {
  const [articleContent, setArticleContent] = useState('');
  const [fetchedText, setFetchedText] = useState('');
  const [parsedQuestion, setParsedQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

      // Parse options into an array
      const optionRegex = /([a-d])\)\s*([^a-d]+)/gi;
      let match;
      const options = [];
      while ((match = optionRegex.exec(optionsText)) !== null) {
        options.push({
          label: match[1],
          text: match[2].trim(),
        });
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

  // API call to get the text
  const getText = async () => {
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

  // Handle button click to get the text
  const handleButtonClick = () => {
    getText();
  };

  // Handle text area change
  const handleArticleContentChange = (e) => {
    setArticleContent(e.target.value);
  };

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
      <h1>Text Fetcher</h1>

      {/* Article Content Text Box */}
      <section style={{ marginBottom: '20px' }}>
        <h2>Enter Article Content:</h2>
        <textarea
          value={articleContent}
          onChange={handleArticleContentChange}
          rows="10"
          cols="50"
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          placeholder="Paste your article content here..."
        />
      </section>

      {/* Button to get the text */}
      <button
        onClick={handleButtonClick}
        style={{
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
        disabled={isLoading || !articleContent.trim()}
      >
        {isLoading ? 'Fetching text...' : 'Get Text'}
      </button>

      {/* Display Error if any */}
      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <p>{error}</p>
        </div>
      )}

      {/* Display Fetched Text (For Debugging Purposes) */}
      {fetchedText && (
        <section style={{ marginTop: '20px' }}>
          <h2>Fetched Text:</h2>
          <p>{fetchedText}</p>
        </section>
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
