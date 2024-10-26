import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';

const GolangEditor = () => {
  const steps = [
    // Step 1: Introduction to Goroutines
    {
      question: "Step 1: Create a simple function and run it as a goroutine. The function should print a message like 'Hello from Goroutine!'.",
      initialCode: `
package main

import (
  "fmt"
)

// TODO: Create a simple function and run it as a goroutine
func sayHello() {
  fmt.Println("Hello from Goroutine!")
}

func main() {
  fmt.Println("Step 1: Running Goroutine.")
  // Write code to call sayHello as a goroutine
}
      `,
      hint: "Use the 'go' keyword to run sayHello as a goroutine."
    },

    // Step 2: Understanding Channels
    {
      question: "Step 2: Create a channel and send a message from one goroutine to another. The main goroutine should receive and print the message.",
      initialCode: `
package main

import (
  "fmt"
)

// TODO: Use channels to send a message between goroutines
func main() {
  messageChannel := make(chan string)

  // Write a goroutine that sends a message into the channel
  // Write code to receive the message in the main goroutine
}
      `,
      hint: "Use 'go func()' for the sending goroutine, and use '<-' to receive from the channel."
    },

    // Step 3: Combining Goroutines and Channels
    {
      question: "Step 3: Create a channel and send multiple messages from different goroutines. The main goroutine should receive and print the messages.",
      initialCode: `
package main

import (
  "fmt"
)

func main() {
  messageChannel := make(chan string)

  // TODO: Start two goroutines that send messages
  go func() {
    messageChannel <- "Hello from Goroutine 1"
  }()

  go func() {
    messageChannel <- "Hello from Goroutine 2"
  }()

  // Write code to receive and print both messages
}
      `,
      hint: "Use two '<-' operations to receive two messages from the channel."
    },

    // Step 4: Introduction to Worker Pool Pattern
    {
      question: "Step 4: Create a worker function that takes jobs from a channel and sends results to another channel.",
      initialCode: `
package main

import (
  "fmt"
  "time"
)

// TODO: Create a worker function that takes jobs from a channel
func worker(id int, jobs <-chan int, results chan<- int) {
  // Write your code here
}

func main() {
  fmt.Println("Step 4: Worker pool basics.")
}
      `,
      hint: "Use a for loop to read jobs from the 'jobs' channel and send results to the 'results' channel."
    },

    // Step 5: Moving to Full Worker Pool
    {
      question: "Step 5: Complete the worker pool pattern. Start multiple workers and distribute jobs.",
      initialCode: `
package main

import (
  "fmt"
  "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
  for j := range jobs {
    fmt.Printf("Worker %d started job %d\\n", id, j)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d finished job %d\\n", id, j)
    results <- j * 2
  }
}

func main() {
  const numJobs = 5
  jobs := make(chan int, numJobs)
  results := make(chan int, numJobs)

  // TODO: Start workers and send jobs to the jobs channel
  fmt.Println("Step 5: Complete worker pool pattern.")
}
      `,
      hint: "Start workers using 'go worker()' and send jobs using a for loop."
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [code, setCode] = useState(steps[0].initialCode);
  const [output, setOutput] = useState('');
  const [hint, setHint] = useState('');
  const [question, setQuestion] = useState(steps[0].question);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleRunCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/execute', {
        language: 'golang',
        code: code,
      });
      const data = response.data;
      setOutput(data.output || 'No output');
    } catch (error) {
      console.error('Error running code:', error);
      setOutput(error.response ? error.response.data.error : 'Error running the code');
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCode(steps[currentStep + 1].initialCode);
      setQuestion(steps[currentStep + 1].question);
      setHint('');
      setOutput('');
    }
  };

  const handleHint = () => {
    setHint(steps[currentStep].hint);
  };

  return (
    <div>
      <h1>Learn Golang: Goroutines, Channels, and Worker Pool</h1>
      <h2>{question}</h2> {/* Display the current question */}
      <MonacoEditor
        width="800"
        height="400"
        language="go"
        theme="vs-dark"
        value={code}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        onChange={handleCodeChange}
      />
      <br />
      <button onClick={handleRunCode}>Run Code</button>
      <button onClick={handleNextStep}>Next Step</button>
      <button onClick={handleHint}>Show Hint</button>
      <h2>Hint:</h2>
      <pre>{hint}</pre>
      <h2>Output:</h2>
      <pre>{output}</pre>
    </div>
  );
};

export default GolangEditor;
