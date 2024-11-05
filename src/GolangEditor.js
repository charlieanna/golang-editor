import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LearningEditor = () => {
    const [article, setArticle] = useState('');
    const [question, setQuestion] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initial article and question setup
        setArticle(`
            Log-Structured Merge (LSM) Trees are a type of data structure 
            used to manage write-heavy workloads efficiently. LSM Trees 
            are designed to optimize write operations by sequentially 
            writing data to disk, delaying merging and sorting until 
            later. This structure is often used in databases like 
            Cassandra and LevelDB to ensure high throughput.
        `);
        setQuestion('Why are LSM Trees particularly suited for write-heavy workloads?');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Send user's response to the backend
            const response = await axios.post('http://localhost:8080/submit-response', {
                userId: 'user123',
                code: userAnswer,
                question: question,
            });

            setFeedback(response.data.message);
            setIsLoading(false);
        } catch (error) {
            console.error('Error submitting response:', error);
            setFeedback('There was an error submitting your response.');
            setIsLoading(false);
        }
    };

    const handleFetchNextQuestion = async () => {
        setIsLoading(true);

        try {
            // Fetch the next question from the backend
            const response = await axios.get('http://localhost:8080/get-question', {
                params: { userId: 'user123' },
            });

            setQuestion(response.data.question);
            setUserAnswer(''); // Clear the text box when a new question is fetched
            setFeedback(''); // Clear feedback when a new question is fetched
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching next question:', error);
            setFeedback('There was an error fetching the next question.');
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Learn About LSM Trees</h1>
            <div style={{ marginBottom: '20px' }}>
                <p>{article}</p>
            </div>
            <h2>Question:</h2>
            <p>{question}</p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    rows="4"
                    cols="50"
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    {isLoading ? 'Submitting...' : 'Submit Answer'}
                </button>
            </form>
            {feedback && (
                <div style={{ marginTop: '20px', color: feedback.includes('error') ? 'red' : 'green' }}>
                    <p>{feedback}</p>
                </div>
            )}
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
