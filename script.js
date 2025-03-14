const questions = [
  {
    question: "What does HTML stand for?",
    answers: ["HyperText Markup Language", "HighText Machine Language", "HyperText and links Markup Language", "HyperTool Multi Language"],
    correct: 0
  },
  {
    question: "Which HTML tag is used to link an external CSS file?",
    answers: ["<style>", "<css>", "<script>", "<link>"],
    correct: 3
  },
  {
    question: "What symbol is used in CSS to select an ID?",
    answers: [". (dot)", "# (hash)", "$ (dollar)", "* (asterisk)"],
    correct: 1
  },
  {
    question: "What JavaScript keyword declares a constant variable?",
    answers: ["var", "let", "const", "static"],
    correct: 2
  },
  {
    question: "Bootstrap is primarily built with which CSS preprocessor?",
    answers: ["SASS", "LESS", "Stylus", "PostCSS"],
    correct: 0
  },
  {
    question: "Which HTML element is used to define JavaScript code?",
    answers: ["<style>", "<script>", "<js>", "<javascript>"],
    correct: 1
  },
  {
    question: "Which of these is NOT a JavaScript framework?",
    answers: ["React", "Angular", "Laravel", "Vue"],
    correct: 2
  },
  {
    question: "How do you insert a comment in CSS?",
    answers: ["// comment", "/* comment */", "<!-- comment -->", "# comment"],
    correct: 1
  },
  {
    question: "Which CSS property is used to change text color?",
    answers: ["font-color", "text-color", "fgcolor", "color"],
    correct: 3
  },
  {
    question: "What is the correct JavaScript syntax to change content of an HTML element with id 'demo'?",
    answers: ["document.getElement('demo').innerHTML = 'Hello';", "document.getElementById('demo').innerHTML = 'Hello';", "#demo.innerHTML = 'Hello';", "document.getId('demo') = 'Hello';"],
    correct: 1
  },
  {
    question: "Which HTTP method is commonly used to retrieve data from a server?",
    answers: ["POST", "GET", "PUT", "DELETE"],
    correct: 1
  },
  {
    question: "In Bootstrap, which class is used to create a responsive container?",
    answers: [".box", ".responsive", ".container", ".grid"],
    correct: 2
  },
  {
    question: "Which JavaScript method is used to convert a JSON string into a JavaScript object?",
    answers: ["JSON.stringify()", "JSON.parse()", "JSON.objectify()", "JSON.toObject()"],
    correct: 1
  },
  {
    question: "Which attribute specifies where a form's data will be sent when submitted?",
    answers: ["method", "action", "target", "href"],
    correct: 1
  }
];





let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;  // 30 seconds per question

// Load leaderboard from localStorage or default
let leaderboardData = JSON.parse(localStorage.getItem('leaderboardData')) || [
  { name: "Jonathan Porter", score: 6500, date: Date.now() },
  { name: "Julia Bell", score: 6000, date: Date.now() },
  { name: "Alexa Richter", score: 4500, date: Date.now() },
  { name: "Amanda Hall", score: 4000, date: Date.now() },
  { name: "Ellie Rosenfelder", score: 3500, date: Date.now() }
];

// Initialize quiz
document.getElementById("start-btn").onclick = startQuiz;
document.getElementById("next-btn").onclick = () => {
  currentQuestionIndex++;
  setNextQuestion();
};

function startQuiz() {
  document.getElementById("start-screen").classList.add("d-none");
  document.getElementById("quiz-screen").classList.remove("d-none");
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(questions[currentQuestionIndex]);
  startTimer();
}

function showQuestion(q) {
  document.getElementById("question-number").textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
  document.getElementById("question").textContent = q.question;

  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-outline-secondary");
    btn.textContent = answer;
    btn.onclick = () => selectAnswer(btn, index, q.correct);
    document.getElementById("answer-buttons").appendChild(btn);
  });
}

function selectAnswer(btn, selected, correct) {
  clearInterval(timer);
  if (selected === correct) {
    btn.classList.add("correct");
    score += (100 + (timeLeft * 10)); // Points based on remaining time
  } else {
    btn.classList.add("wrong");
    document.querySelectorAll("#answer-buttons button")[correct].classList.add("correct");
  }

  document.getElementById("score").textContent = `Score: ${score}`;
  Array.from(document.getElementById("answer-buttons").children).forEach(b => b.disabled = true);
  document.getElementById("next-btn").classList.remove("d-none");

  if (currentQuestionIndex === questions.length - 1) {
    document.getElementById("next-btn").textContent = "See Results";
    document.getElementById("next-btn").onclick = showResults;
  }
}

function resetState() {
  clearInterval(timer);
  timeLeft = 30; // Reset timer for each question
  document.getElementById("timer").textContent = timeLeft;
  document.getElementById("next-btn").classList.add("d-none");
  document.getElementById("answer-buttons").innerHTML = '';
}

function startTimer() {
  timeLeft = 30;
  document.getElementById("timer").textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      Array.from(document.getElementById("answer-buttons").children).forEach(b => b.disabled = true);
      document.getElementById("next-btn").classList.remove("d-none");
    }
  }, 1000);
}

function showResults() {
  clearInterval(timer);
  document.getElementById("quiz-screen").classList.add("d-none");
  document.getElementById("result-screen").classList.remove("d-none");
  document.getElementById("final-score").textContent = `${score} points`;

  updateLeaderboard();
}

function updateLeaderboard() {
  const userName = prompt("Congrats! Enter your name for the leaderboard:", "Anonymous") || "Anonymous";
  
  leaderboardData.push({ name: userName, score: score, date: Date.now() });

  // Keep only last week's data
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  leaderboardData = leaderboardData.filter(entry => entry.date >= oneWeekAgo);

  // Sort leaderboard and keep top 5
  leaderboardData.sort((a, b) => b.score - a.score);
  leaderboardData = leaderboardData.slice(0, 5);

  localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));

  renderLeaderboard();
}

function renderLeaderboard() {
  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = '';

  leaderboardData.forEach(entry => {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between");
    li.innerHTML = `<span>${entry.name}</span><span>${entry.score} pts</span>`;
    leaderboard.appendChild(li);
  });
}

// Render leaderboard on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("leaderboard")) {
    renderLeaderboard();
  }
});
