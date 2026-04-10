import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data } = await supabase.from('quiz_questions').select('*');
    if (data) setQuestions(data);
    setLoading(false);
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    const correct = index === questions[currentIndex].correct_index;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 10);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
      updateGlobalScore();
    }
  };

  const updateGlobalScore = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('climate_literacy_score')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        await supabase
          .from('profiles')
          .update({ climate_literacy_score: profile.climate_literacy_score + score })
          .eq('id', user.id);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setShowResult(false);
  };

  if (loading) return <div className="text-center font-black text-4xl mt-20">LOADING BRAIN CELLS...</div>;
  if (questions.length === 0) return <div className="text-center font-black text-4xl mt-20">NO QUESTIONS. THE PLANET IS SAVED?</div>;

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h2 className="text-6xl font-black uppercase tracking-tighter">Quiz Over</h2>
        <div className="brutal-card bg-brutal-yellow">
          <p className="text-2xl font-bold mb-4">Your Score: {score} pts</p>
          <p className="text-lg italic">
            {score > 50 
              ? "Wow, you actually know things. Impressive for a human." 
              : "Yikes. Maybe stick to coloring books?"}
          </p>
        </div>
        <button onClick={resetQuiz} className="brutal-btn-primary flex items-center gap-2 mx-auto">
          <RefreshCcw size={20} /> Try Again
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="font-black uppercase text-sm text-gray-500">Question {currentIndex + 1}/{questions.length}</p>
          <h2 className="text-4xl font-black uppercase tracking-tight">Climate Literacy Test</h2>
        </div>
        <div className="text-right">
          <p className="font-black text-2xl">{score} PTS</p>
        </div>
      </div>

      <div className="brutal-card min-h-[400px] flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-8">{currentQ.question}</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map((option, i) => {
              const isSelected = selectedOption === i;
              const isCorrectOption = i === currentQ.correct_index;
              
              let bgColor = "bg-white";
              if (selectedOption !== null) {
                if (isCorrectOption) bgColor = "bg-brutal-green";
                else if (isSelected) bgColor = "bg-brutal-pink";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(i)}
                  disabled={selectedOption !== null}
                  className={cn(
                    "brutal-btn text-left flex items-center justify-between",
                    bgColor
                  )}
                >
                  <span>{option}</span>
                  {selectedOption !== null && isCorrectOption && <CheckCircle2 size={20} />}
                  {selectedOption !== null && isSelected && !isCorrectOption && <XCircle size={20} />}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 border-4 border-black bg-gray-50"
            >
              <p className="font-black uppercase text-sm mb-2">The Truth:</p>
              <p className="font-bold mb-6">{currentQ.explanation}</p>
              <button onClick={nextQuestion} className="brutal-btn-primary w-full flex items-center justify-center gap-2">
                {currentIndex + 1 === questions.length ? "Finish" : "Next Question"}
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
