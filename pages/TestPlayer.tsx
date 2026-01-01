
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, User } from '../utils/api';
import { TestItem, Question } from '../types';
import { Clock, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useToast } from '../components/Toast';

export const TestPlayer = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [test, setTest] = useState<TestItem | null>(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({}); // qIndex -> optionIndex
    const [timeLeft, setTimeLeft] = useState(0); // seconds
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        // Auth Check
        const user = api.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        const init = async () => {
            if (!testId) return;

            try {
                // 1. Fetch Test
                const tests = await api.getTests();
                const t = tests.find(item => item.id === testId);

                if (!t) {
                    addToast("Test not found", 'error');
                    navigate('/dashboard');
                    return;
                }

                // 2. Fetch Results (awaiting properly)
                const results = await api.getUserResults(user.id);
                const prev = results.find(r => r.testId === testId);

                if (prev) {
                    setTest(t);
                    setScore(prev.score);
                    setIsSubmitted(true);
                    addToast("You have already completed this test.", 'info');
                    return;
                }

                // 3. Check Course Validity (Only if not submitted)
                if (user.courseExpiry && user.courseExpiry[t.courseId]) {
                    const expiry = new Date(user.courseExpiry[t.courseId]);
                    if (expiry < new Date()) {
                        addToast("Access Denied: Your course validity has expired.", 'error');
                        navigate('/dashboard');
                        return;
                    }
                }

                // 4. Start Test
                setTest(t);
                setTimeLeft(t.timeMinutes * 60);

            } catch (e) {
                console.error(e);
                addToast("Error loading test", 'error');
                navigate('/dashboard');
            }
        };

        init();
    }, [testId, navigate, addToast]);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            timerRef.current = window.setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !isSubmitted && test) {
            handleSubmit();
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, [timeLeft, isSubmitted, test]);

    const handleOptionSelect = (optionIndex: number) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [currentQIndex]: optionIndex }));
    };

    const handleSubmit = () => {
        if (!test) return;

        let calcScore = 0;
        test.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctOptionIndex) {
                calcScore += (test.positiveMarks || 4);
            } else if (answers[idx] !== undefined) {
                calcScore -= (test.negativeMarks || 1);
            }
        });
        setScore(calcScore);
        setIsSubmitted(true);

        // Save Result
        const user = api.getCurrentUser();
        if (user) {
            api.saveTestResult({
                testId: test.id,
                userId: user.id,
                score: calcScore,
                totalQuestions: test.questions.length,
                date: new Date().toISOString()
            });
        }
        addToast("Test submitted successfully!", 'success');
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!test) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Test...</div>;

    const currentQuestion = test.questions[currentQIndex];

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Header */}
            <header className="bg-slate-900 border-b border-white/5 p-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-white font-bold text-lg">{test.title}</h1>
                        <p className="text-slate-400 text-xs">Question {currentQIndex + 1} of {test.questions.length}</p>
                    </div>
                    <div className={`flex items-center px-4 py-2 rounded-lg font-mono font-bold ${timeLeft < 300 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-white'}`}>
                        <Clock className="h-4 w-4 mr-2" />
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
                {!isSubmitted ? (
                    <Reveal>
                        <div className="glass-card p-6 md:p-10 rounded-2xl border border-white/10">
                            <div className="mb-8">
                                <span className="text-teal-400 font-bold text-sm uppercase tracking-wide mb-2 block">Question {currentQIndex + 1}</span>

                                {currentQuestion.imageUrl && (
                                    <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-slate-900 flex justify-center p-4">
                                        <img
                                            src={currentQuestion.imageUrl}
                                            alt="Question Diagram"
                                            className="max-h-64 object-contain rounded-lg"
                                        />
                                    </div>
                                )}

                                <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">{currentQuestion.text}</h2>
                            </div>

                            <div className="space-y-3">
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center ${answers[currentQIndex] === idx
                                            ? 'bg-teal-500/20 border-teal-500 text-white'
                                            : 'bg-slate-900/50 border-white/5 text-slate-300 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border mr-4 flex items-center justify-center text-xs font-bold ${answers[currentQIndex] === idx ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-600 text-slate-500'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-8">
                            <button
                                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQIndex === 0}
                                className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                            </button>

                            {currentQIndex === test.questions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 flex items-center shadow-lg shadow-emerald-500/20"
                                >
                                    <Save className="h-4 w-4 mr-2" /> Submit Test
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                                    className="px-6 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-400 flex items-center shadow-lg shadow-teal-500/20"
                                >
                                    Next <ChevronRight className="h-4 w-4 ml-2" />
                                </button>
                            )}
                        </div>

                        {/* Question Palette */}
                        <div className="mt-12">
                            <p className="text-slate-400 text-sm mb-4">Question Palette</p>
                            <div className="flex flex-wrap gap-2">
                                {test.questions.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentQIndex(idx)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${currentQIndex === idx ? 'ring-2 ring-white bg-teal-500 text-white' :
                                            answers[idx] !== undefined ? 'bg-teal-500/50 text-white' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                ) : (
                    <Reveal>
                        <div className="glass-card p-10 rounded-2xl border border-white/10 text-center max-w-lg mx-auto">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Test Submitted!</h2>
                            <p className="text-slate-400 mb-8">You have successfully completed the test.</p>

                            <div className="bg-slate-900/80 p-6 rounded-xl border border-white/5 mb-8">
                                <p className="text-slate-500 text-sm uppercase tracking-widest mb-1">Your Score</p>
                                <p className="text-4xl font-bold text-white mb-2">
                                    {score} <span className="text-xl text-slate-500 font-medium">/ {test.questions.length * (test.positiveMarks || 4)}</span>
                                </p>
                                <p className="text-xs text-slate-400">
                                    (+{test.positiveMarks || 4} for Correct, -{test.negativeMarks || 1} for Wrong)
                                </p>
                            </div>

                            <div className="space-y-6 text-left mb-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <h3 className="text-white font-bold border-b border-white/10 pb-2">Detailed Analysis</h3>
                                {test.questions.map((q, idx) => {
                                    const isCorrect = answers[idx] === q.correctOptionIndex;
                                    const isSkipped = answers[idx] === undefined;
                                    return (
                                        <div key={idx} className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/20' : isSkipped ? 'bg-slate-800/50 border-white/5' : 'bg-red-500/10 border-red-500/20'}`}>
                                            <p className="text-white font-bold mb-2"><span className="text-slate-500 mr-2">Q{idx + 1}.</span> {q.text}</p>
                                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                                <div className={`${isCorrect ? 'text-emerald-400' : isSkipped ? 'text-slate-400' : 'text-red-400'}`}>
                                                    <span className="font-bold block text-xs opacity-70 uppercase">Your Answer</span>
                                                    {isSkipped ? 'Skipped' : q.options[answers[idx]]}
                                                </div>
                                                <div className="text-emerald-400">
                                                    <span className="font-bold block text-xs opacity-70 uppercase">Correct Answer</span>
                                                    {q.options[q.correctOptionIndex]}
                                                </div>
                                            </div>
                                            {q.explanation && (
                                                <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5 text-sm text-slate-300">
                                                    <p className="font-bold text-indigo-400 text-xs uppercase mb-1">Explanation</p>
                                                    {q.explanation}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full py-4 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-400 transition"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </Reveal>
                )}
            </main>
        </div>
    );
};
