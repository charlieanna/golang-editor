import React, { useState } from 'react';
import axios from 'axios';

const LearningObjectivesEditor = () => {
  const [articleContent, setArticleContent] = useState('');
  const [learningObjectives, setLearningObjectives] = useState([]);
  const [initialQuestions, setInitialQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [nextQuestions, setNextQuestions] = useState({});
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // API call to get learning objectives
  const getLearningObjectives = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/get-learning-objectives', {
        params: { articleContent },
      });
      setLearningObjectives(response.data.learning_objectives || []);
    } catch (error) {
      console.error('Error getting learning objectives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // API call to get initial question
  const getInitialQuestion = async (objective) => {
    try {
      const response = await axios.get('http://localhost:8080/get-question', {
        params: { objective },
      });
      setInitialQuestions((prev) => ({ ...prev, [objective]: response.data.question }));
    } catch (error) {
      console.error('Error getting initial question:', error);
    }
  };

  // Handle button click to get learning objectives
  const handleButtonClick = () => {
    getLearningObjectives();
  };

  // Handle text box change
  const handleArticleContentChange = (e) => {
    setArticleContent(e.target.value);
  };

  // Handle get initial question button click
  const handleGetInitialQuestionClick = (objective) => {
    getInitialQuestion(objective);
  };

  // Handle answer submission and send answer to backend
  const handleAnswerSubmission = async (e, objective) => {
    e.preventDefault();
    const answer = e.target.answer.value;
    try {
      const response = await axios.post('http://localhost:8080/submit-response', {
        objective,
        question: initialQuestions[objective],
        answer,
        userId: 'user123',
      });

      // Extract response data
      const { feedback, nextQuestion, summary } = response.data;

      // Update state with the answer and backend response data
      setAnswers((prev) => ({ ...prev, [objective]: answer }));
      setFeedback((prev) => ({ ...prev, [objective]: feedback }));
      setNextQuestions((prev) => ({ ...prev, [objective]: nextQuestion }));
      setSummary(summary);
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert("Failed to submit the answer."); // Notify the user in case of an error
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Learning Objectives</h1>

      {/* Article Content Text Box */}
      <section style={{ marginBottom: '20px' }}>
        <h2>Enter Article Content:</h2>
        <textarea
          value={articleContent}
          onChange={handleArticleContentChange}
          rows="10"
          cols="50"
          style={{ width: '100%', padding: '10px' }}
        />
      </section>

      {/* Learning Objectives */}
      <section>
        <h2>Learning Objectives:</h2>
        <ul>
          {learningObjectives.map((objective, index) => (
            <li key={index}>
              {objective}
              <button
                onClick={() => handleGetInitialQuestionClick(objective)}
                style={{ padding: '5px 10px', cursor: 'pointer' }}
              >
                Get Initial Question
              </button>
              {initialQuestions[objective] && (
                <div>
                  <p>Initial Question: {initialQuestions[objective]}</p>
                  <form onSubmit={(e) => handleAnswerSubmission(e, objective)}>
                    <input type="text" name="answer" placeholder="Enter your answer" />
                    <button type="submit">Submit Answer</button>
                  </form>
                </div>
              )}
              {answers[objective] && (
                <div>
                  <p>Your Answer: {answers[objective]}</p>
                  <p>Feedback: {feedback[objective]}</p>
                  <p>Next Question: {nextQuestions[objective]}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Button to get learning objectives */}
      <button
        onClick={handleButtonClick}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
        disabled={isLoading}
      >
        {isLoading ? 'Loading learning objectives...' : 'Get Learning Objectives'}
      </button>

      {/* Summary */}
      {summary && (
        <section style={{ marginTop: '20px' }}>
          <h2>Summary</h2>
          <p>{summary}</p>
        </section>
      )}
    </div>
  );
};

export default LearningObjectivesEditor;
