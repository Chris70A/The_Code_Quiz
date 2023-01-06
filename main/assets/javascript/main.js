// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;       // change this back 
var timerId;

// DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var resultEl = document.getElementById('result');


// this function starts the quiz by hiding the start menu and starting the timer
function startQuiz() {

  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');
  questionsEl.removeAttribute('class');

  timerId = setInterval(clockTick, 1000);

  timerEl.textContent = time;

  getQuestion();
}

// this function collects the questions from the question.js file and loops through the array.
function getQuestion() {

  var currentQuestion = questions[currentQuestionIndex];

 
  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title;

 
  choicesEl.innerHTML = '';


  for (var i = 0; i < currentQuestion.choices.length; i++) {
   
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = i + 1 + '. ' + choice;

   
    choicesEl.appendChild(choiceNode);
  }
}

//this function is the rules of the quiz 
//When user is wrong it subtracts time = -10sec.
function questionClick(event) {
  var buttonEl = event.target;

 
  if (!buttonEl.matches('.choice')) {
    return;
  }

  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    
    time -= 10;

    if (time < 0) {
      time = 0;
    }

  
    timerEl.textContent = time;



    resultEl.textContent = 'Wrong!';
  } else {


    resultEl.textContent = 'Correct!';
  }

  
  resultEl.setAttribute('class', 'result');
  setTimeout(function () {
    resultEl.setAttribute('class', 'result hide');
  }, 1000);

  
  currentQuestionIndex++;

  
  if (time <= 0 || currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

//this function is the end of the quiz.
//shows final score
function quizEnd() {
  
  clearInterval(timerId);


  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');


  var finalScoreEl = document.getElementById('finalScore');
  finalScoreEl.textContent = time;

 
  questionsEl.setAttribute('class', 'hide');
}


function clockTick() {
  
  time--;
  timerEl.textContent = time;

 
  if (time <= 0) {
    quizEnd();
  }
}


//This function stores the score under the Users ID.
// stores it in local storage 
function saveHighscore() {

  var initials = initialsEl.value.trim();


  if (initials !== '') {
   
    var highscores =
      JSON.parse(window.localStorage.getItem('highscores')) || [];

 
    var newScore = {
      score: time,
      initials: initials,
    };

 
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

 
    window.location.href = "highScores.html";
  }
}

function checkForEnter(event) {
 
  if (event.key === 'Enter') {
    saveHighscore();
  }
}


submitBtn.onclick = saveHighscore;
startBtn.onclick = startQuiz;
choicesEl.onclick = questionClick;
initialsEl.onkeyup = checkForEnter;
