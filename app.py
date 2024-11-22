# app.py

import streamlit as st
import requests
import json
import datetime

# -----------------------------
# Configuration
# -----------------------------

API_BASE_URL = 'http://localhost:8080'  # Replace with your backend API URL
USER_ID = 'user123'  # In a real application, manage user authentication properly

# -----------------------------
# Helper Functions
# -----------------------------

def submit_user_response(user_id, question, user_answer):
    """
    Sends the user's answer to the backend API and returns feedback.
    """
    endpoint = f"{API_BASE_URL}/submit-response"
    payload = {
        'userId': user_id,
        'code': user_answer,
        'question': question
    }
    try:
        response = requests.post(endpoint, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Error submitting response: {e}")
        return None

def fetch_next_question(user_id):
    """
    Fetches the next question from the backend API.
    """
    endpoint = f"{API_BASE_URL}/get-question"
    params = {'userId': user_id}
    try:
        response = requests.get(endpoint, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching next question: {e}")
        return None

def initialize_session_state():
    """
    Initializes the session state variables.
    """
    if 'article' not in st.session_state:
        st.session_state['article'] = """
            Log-Structured Merge (LSM) Trees are a type of data structure 
            used to manage write-heavy workloads efficiently. LSM Trees 
            are designed to optimize write operations by sequentially 
            writing data to disk, delaying merging and sorting until 
            later. This structure is often used in databases like 
            Cassandra and LevelDB to ensure high throughput.
        """
    if 'question' not in st.session_state:
        st.session_state['question'] = 'What are the use(s) for struct tags in Go?'
    if 'feedback' not in st.session_state:
        st.session_state['feedback'] = ''
    if 'is_loading' not in st.session_state:
        st.session_state['is_loading'] = False

# -----------------------------
# Streamlit App Layout
# -----------------------------

def main():
    st.title("📚 Adaptive Learning Assistant")

    initialize_session_state()

    # -----------------------------
    # Article Section
    # -----------------------------
    st.header("📖 Article:")
    st.write(st.session_state['article'])

    # -----------------------------
    # Question Section
    # -----------------------------
    st.header("❓ Current Question:")
    st.write(st.session_state['question'])

    # -----------------------------
    # User Answer Form
    # -----------------------------
    with st.form(key='answer_form'):
        user_answer = st.text_area("Your Answer:", height=100)
        submit_button = st.form_submit_button(label='Submit Answer')

    # Handle form submission
    if submit_button:
        if user_answer.strip() == '':
            st.error("Please enter your answer before submitting.")
        else:
            st.session_state['is_loading'] = True
            st.session_state['feedback'] = "Submitting your answer..."
            st.experimental_rerun()  # Rerun to show the loading state

    # -----------------------------
    # Feedback Section
    # -----------------------------
    if st.session_state['is_loading']:
        with st.spinner('Processing your answer...'):
            feedback = submit_user_response(USER_ID, st.session_state['question'], user_answer)
            if feedback:
                st.session_state['feedback'] = feedback.get('feedback', 'No feedback provided.')
                # Optionally, update the question if a new one is provided
                new_question = feedback.get('summary', '')
                if new_question:
                    st.session_state['question'] = new_question
            else:
                st.session_state['feedback'] = "Failed to receive feedback."
            st.session_state['is_loading'] = False
            st.experimental_rerun()

    if st.session_state['feedback']:
        st.header("📢 Feedback:")
        st.write(st.session_state['feedback'])

    # -----------------------------
    # Fetch Next Question Button
    # -----------------------------
    if st.button("🔄 Fetch Next Question"):
        st.session_state['is_loading'] = True
        st.session_state['feedback'] = "Fetching the next question..."
        st.experimental_rerun()

    if st.session_state['is_loading'] and st.session_state['feedback'].startswith("Fetching"):
        with st.spinner('Fetching next question...'):
            next_q = fetch_next_question(USER_ID)
            if next_q:
                st.session_state['question'] = next_q.get('question', st.session_state['question'])
                st.session_state['feedback'] = "Next question fetched successfully."
            else:
                st.session_state['feedback'] = "Failed to fetch the next question."
            st.session_state['is_loading'] = False
            st.experimental_rerun()

    # -----------------------------
    # Display Next Question Feedback
    # -----------------------------
    if st.session_state['feedback'].startswith("Next question"):
        st.header("🆕 Next Question:")
        st.write(st.session_state['question'])

if __name__ == "__main__":
    main()
