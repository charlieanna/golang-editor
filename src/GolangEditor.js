import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LearningEditor = () => {
  const [article, setArticle] = useState('');
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize article content and question
  useEffect(() => {
    const initialArticle = `
      Log-Structured Merge (LSM) Trees are a type of data structure 
      used to manage write-heavy workloads efficiently. LSM Trees 
      are designed to optimize write operations by sequentially 
      writing data to disk, delaying merging and sorting until 
      later. This structure is often used in databases like 
      Cassandra and LevelDB to ensure high throughput.
    `;
    const initialQuestion = 'What are the use(s) for struct tags in Go?';
    setArticle(initialArticle);
    setQuestion(initialQuestion);
  }, []);

  // API call to submit the user's response
  const submitUserResponse = async () => {
    try {
      const response = await axios.post('http://localhost:8080/submit-response', {
        userId: 'user123',
        code: userAnswer,
        question,
      });

      setFeedback(response.data.feedback);
      setQuestion(response.data.summary || question); // Update question only if summary is provided
      setUserAnswer(''); // Clear user answer input
    } catch (error) {
      console.error('Error submitting response:', error);
      setFeedback('There was an error submitting your response.');
    } finally {
      setIsLoading(false);
    }
  };

  // API call to fetch the next question
  const fetchNextQuestion = async () => {
    try {
      const response = await axios.get('http://localhost:8080/get-question', {
        params: { userId: 'user123' },
      });

      setQuestion(response.data.question);
      setUserAnswer('');
      setFeedback(''); // Clear previous feedback
    } catch (error) {
      console.error('Error fetching next question:', error);
      setFeedback('There was an error fetching the next question.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    submitUserResponse();
  };

  // Handle fetching the next question
  const handleFetchNextQuestion = () => {
    setIsLoading(true);
    fetchNextQuestion();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Learn About LSM Trees</h1>

      {/* Article Content */}
      <section style={{ marginBottom: '20px' }}>
        <h2>Article:</h2>
        <p>{article}</p>
      </section>

      {/* Current Question */}
      <section>
        <h2>Question:</h2>
        <p>{question}</p>
      </section>

      {/* User Answer Form */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows="4"
          cols="50"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Answer'}
        </button>
      </form>

      {/* Feedback Section */}
      {feedback && (
        <div style={{ marginTop: '20px', color: feedback.includes('error') ? 'red' : 'green' }}>
          <p>{feedback}</p>
        </div>
      )}

      {/* Fetch Next Question Button */}
      <button
        onClick={handleFetchNextQuestion}
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
        disabled={isLoading}
      >
        {isLoading ? 'Loading next question...' : 'Fetch Next Question'}
      </button>
    </div>
  );
};

export default LearningEditor;
