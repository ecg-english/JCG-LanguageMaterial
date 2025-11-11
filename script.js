// Section navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update progress
    updateProgress();
}

// Quiz functionality
const quizScores = {
    1: { correct: 0, total: 3, answers: {} },
    2: { correct: 0, total: 3, answers: {} },
    3: { correct: 0, total: 3, answers: {} },
    4: { correct: 0, total: 3, answers: {} },
    5: { correct: 0, total: 3, answers: {} }
};

function checkAnswer(section, questionNum) {
    const questionDiv = document.querySelector(`[data-section="${section}"][data-question="${questionNum}"]`);
    const selectedOption = questionDiv.querySelector('.quiz-option.selected');
    const feedback = questionDiv.querySelector('.quiz-feedback');
    const checkButton = questionDiv.querySelector('.check-button');

    if (!selectedOption) {
        alert('<ruby>選択肢<rt>せんたくし</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください / Please select an option');
        return;
    }

    const isCorrect = selectedOption.getAttribute('data-answer') === 'correct';
    
    // Store answer if not already answered
    if (!quizScores[section].answers[questionNum]) {
        if (isCorrect) {
            quizScores[section].correct++;
        }
        quizScores[section].answers[questionNum] = isCorrect;
    }

    // Show feedback
    feedback.classList.add('show');
    if (isCorrect) {
        feedback.classList.remove('incorrect');
        feedback.classList.add('correct');
        feedback.querySelector('p').innerHTML = '✅ <ruby>正解<rt>せいかい</rt></ruby>です！/ Correct!';
        selectedOption.classList.add('correct');
    } else {
        feedback.classList.remove('correct');
        feedback.classList.add('incorrect');
        const correctOption = questionDiv.querySelector('[data-answer="correct"]');
        feedback.querySelector('p').innerHTML = '❌ <ruby>不正解<rt>ふせいかい</rt></ruby>です。<ruby>正解<rt>せいかい</rt></ruby>は: ' + correctOption.textContent + '<br>Incorrect. The correct answer is: ' + correctOption.textContent;
        selectedOption.classList.add('incorrect');
        correctOption.classList.add('correct');
    }

    // Disable all options and button
    const allOptions = questionDiv.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
    checkButton.disabled = true;

    // Update score display
    updateScore(section);
    updateProgress();
}

function updateScore(section) {
    const scoreDisplay = document.getElementById(`scoreText${section}`);
    scoreDisplay.textContent = `${quizScores[section].correct}/${quizScores[section].total}`;
}

function updateProgress() {
    let totalCorrect = 0;
    let totalQuestions = 0;

    for (let section in quizScores) {
        totalCorrect += quizScores[section].correct;
        totalQuestions += quizScores[section].total;
    }

    const percentage = Math.round((totalCorrect / totalQuestions) * 100);
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = percentage + '%';
    progressFill.textContent = percentage + '%';
}

// Add click handlers for quiz options
document.addEventListener('DOMContentLoaded', function() {
    const allOptions = document.querySelectorAll('.quiz-option');
    allOptions.forEach(option => {
        option.addEventListener('click', function() {
            const questionDiv = this.closest('.quiz-question');
            const section = questionDiv.getAttribute('data-section');
            const questionNum = questionDiv.getAttribute('data-question');
            
            // Only allow selection if not already answered
            if (!quizScores[section].answers[questionNum]) {
                const siblings = questionDiv.querySelectorAll('.quiz-option');
                siblings.forEach(sib => sib.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
    });
});

