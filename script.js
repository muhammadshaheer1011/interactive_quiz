const quizData = [
    { question: "CSS stands for?", options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correct: "Cascading Style Sheets" },
    { question: "Which is not a JS framework?", options: ["React", "Angular", "Vue", "Laravel"], correct: "Laravel" },
    { question: "HTML stands for?", options: ["Hypertext Markup Language", "Hightext Machine Language", "Hyper Markup Language", "None of these"], correct: "Hypertext Markup Language" }
  ];
  
  let currentQuestion = 0;
  let score = 0;
  
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const quizContainer = document.getElementById('quizContainer');
  const resultContainer = document.getElementById('resultContainer');
  const finalScoreEl = document.getElementById('finalScore');
  const nextBtn = document.getElementById('nextBtn');
  const playerNameEl = document.getElementById('playerName');
  const submitScoreBtn = document.getElementById('submitScore');
  const leaderboardEl = document.getElementById('leaderboard');
  
  function loadQuestion() {
    const currentData = quizData[currentQuestion];
    questionEl.textContent = currentData.question;
    optionsEl.innerHTML = '';
  
    currentData.options.forEach(option => {
      const optionDiv = document.createElement('div');
      optionEl = `
        <div class="form-check">
          <input class="form-check-input" type="radio" name="option" value="${option}" id="${option}">
          <label class="form-check-label" for="${option}">${option}</label>
        </div>`;
      optionEl = document.createElement('div');
      optionEl.className = 'form-check option';
      optionEl.innerHTML = `
        <input class="form-check-input" type="radio" name="option" id="${option}" value="${option}">
        <label class="form-check-label" for="${option}">${option}</label>`;
      optionsEl.appendChild(optionEl);
    });
  }
  
  nextBtn.onclick = () => {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
      alert('Select an option first!');
      return;
    }
  
    if (selectedOption.value === quizData[currentQuestion].correct) {
      score++;
      alert('Correct!');
    } else {
      alert(`Incorrect! Correct answer: ${quizData[currentQuestion].correct}`);
    }
  
    currentQuestion++;
  
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      document.getElementById('quizContainer').style.display = 'none';
      document.getElementById('finalScore').textContent = `Your score: ${score}/${quizData.length}`;
      resultContainer.classList.remove('d-none');
    }
  };
  
  nextBtn.addEventListener('click', loadQuestion);
  
  submitScoreBtn.onclick = function () {
    const name = playerName.value.trim();
    if (!name) {
      alert('Please enter your name.');
      return;
    }
  
    const leaderboard = JSON.parse(localStorage.getItem('weeklyLeaderboard') || '[]');
    leaderboard.push({ name, score, date: new Date().getTime() });
    localStorage.setItem('weeklyLeaderboard', JSON.stringify(leaderboard));
    alert('Score submitted!');
    loadLeaderboard();
  };
  
  function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('weeklyLeaderboard')) || [];
    const oneWeekAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
  
    // Keep only scores from the past week
    const recentScores = leaderboard.filter(entry => entry.date >= oneWeekAgo);
    recentScores.sort((a, b) => b.score - a.score);
    leaderboardEl.innerHTML = '';
  
    recentScores.slice(0, 10).forEach(entry => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.innerHTML = `${entry.name}: <strong>${entry.score}</strong>`;
      leaderboardEl.appendChild(li);
    });
  
    localStorage.setItem('weeklyLeaderboard', JSON.stringify(recentScores));
  };
  
  function saveScore(name, score) {
    const leaderboard = JSON.parse(localStorage.getItem('weeklyLeaderboard')) || [];
    leaderboard.push({ name, score, date: new Date().getTime() });
    localStorage.setItem('weeklyLeaderboard', JSON.stringify(leaderboard));
  }
  
  function init() {
    loadQuestion();
    loadLeaderboard();
  }
  
  function loadQuiz() {
    loadQuestion();
  }
  
  init();
  