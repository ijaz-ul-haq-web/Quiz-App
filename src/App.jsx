import React, { useEffect, useState } from "react";

const SAMPLE_QUESTION = [
    {
        id: 1,
        question: "React main state ki lia konsa hook use hota hai?",
        options: ["useEffect", "useState", "useMemo", "useREf"],
        answer: "useState",
    },
    {
        id: 2,
        question: "JSX kiya hota hai?",
        options: ["JS ka XML ka shorthand", "CSS framework", "server side language", "Database"],
        answer: "JS ka XML ka shorthand",
    },
    {
        id: 3,
        question: "React main component ko functional bana kr use konse cheez import krte hai?",
        options: ["class", "function", "hooks", "props"],
        answer: "hooks",
    },
];

function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}


export default function App() {

    const [started, setStarted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);


    function startQuiz() {
        const loaded = SAMPLE_QUESTION.map((q) => ({
            ...q,
            options: shuffleArray(q.options),

        }));

        setQuestions(loaded);
        setStarted(true);
        setCurrentIndex(0);
        setSelected(null);
        setScore(0);
        setShowResult(false);
        setTimeLeft(15);
    }

    function chooseOption(option) {
        if (selected !== null) return;
        setSelected(option);
        const correct = questions[currentIndex].answer === option;
        if (correct) setScore((s) => s + 1);
        setTimeout(() => {
            nextQuestion();
        }, 700);
    }

    function nextQuestion() {
        setSelected(null);
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((i) => i + 1);
            setTimeLeft(15);
        } else {
            setShowResult(true);
        }
    }

    useEffect(() => {
        if (!started || showResult) return;
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            nextQuestion();
            return;
        }

        const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, started, showResult]);


    return (
        <div style={styles.app}>
            <div style={styles.card}>
                <h1 style={styles.title} Quiz App Mini Project></h1>
                {!started && (
                    <StartScreen onStart={startQuiz} total={SAMPLE_QUESTION.length} />
                )}

                {started && !showResult && questions.length > 0 && (
                    <Quiz
                        question={questions[currentIndex]}
                        currentIndex={currentIndex}
                        total={questions.length}
                        selected={selected}
                        onChoose={chooseOption}
                        timeLeft={timeLeft}
                    />
                )}

                {showResult && (
                    <Result
                        score={score}
                        total={questions.length}
                        onRestart={() => setStarted(false)}
                    />
                )}

                <footer style={styles.footer}>Made for practice - customize freely.</footer>
            </div>
        </div>
    );
}

function StartScreen({ onStart, total }) {
    return (
        <div style={styles.center}>
            <p>Ready? Quiz me! Total questions: {total}</p>
            <button style={styles.button} onClick={onStart}>Start Quiz</button>
        </div>
    );
}

function Quiz({ question, currentIndex, total, selected, onChoose, timeLeft }) {
    return(
        <div>
            <div style={styles.rowBetween}>
                <small>
                    Question {currentIndex + 1} / {total}
                </small>
                <small>Time: {timeLeft}s</small>
            </div>

            <QuestionCard
             question = {question}
             selected = {selected}
             onChoose = {onChoose}
             />
        </div>
    );
}

function QuestionCard({ question, selected, onChoose }) {
    return(
        <div>
            <h2 style={styles.question}>{question.question}</h2>
            <div>
                {question.options.map((opt)=> {
                    const isSelected = selected === opt;
                    return(
                        <button key = {opt}
                        onClick={() => onChoose(opt)}
                        style={{
                            ...styles.option,
                            ...(isSelected ? styles.optionSelected : {}),
                        }}> {opt} </button>
                    );
                })}
            </div>
        </div>
    );
}


function Result({ score, total, onRestart }) {
    return(
        <div style={styles.center}>
            <h2>Your Score</h2>
            <p style={{ fontSize: 24}}> {score} / {total}</p>
            <button style={styles.button} onClick={onRestart}>
                Play Again
            </button>
        </div>
    );
}

const styles = {
    app: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#f8fafc,#e6eef8)",
        padding: 20,
        fontFamily: "Inter, Roboto, sans-serif",
    },
    card: {
        width: 520,
        maxWidth: "95vW",
        background: "white",
        borderRadius: 12,
        boxShadow: "0 6px 24px rgba(16,24,40,0.08)",
        padding: 24,
    },
    title: {margin: 0, marginBottom: 12, fontSize: 20 },
    center: { display: "flex", flexDirection: "column", gap: 12, alignItems: "center"},
    button: {
        padding: "10px 18px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        background: "#2563eb",
        color: "white",
        fontWeight: 600,
    },
    footer: {marginTop: 14, fontSize: 12, color: "#64748b", textAlign: "center"},
    rowBetween: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
    question: { fontSize: 18, margin: "12px 0"},
    option: {
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        border: "1px solid #e2e8f0",
        background: "white",
        cursor: "pointer",
    },
    optionSelected: {
        background: "#eef2ff",
        borderColor: "#c7d2fe"
    },
};