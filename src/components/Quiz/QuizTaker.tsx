'use client';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/client';
import Link from 'next/link';

export default function QuizTaker({ quizId, questions }: { quizId: string, questions: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) {
    return <div className="p-8 text-center">ไม่มีข้อสอบในระบบ</div>;
  }

  const currentQ = questions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handleSubmit = async () => {
    let calculatedScore = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswerIndex) calculatedScore++;
    });
    setScore(calculatedScore);
    setIsSubmitted(true);

    try {
      await addDoc(collection(db, 'results'), {
        userId: 'mai', // บันทึกให้เป็นของ "มาย" เสมอ
        studentName: 'มาย',
        quizId,
        score: calculatedScore,
        totalQuestions: questions.length,
        userAnswers: answers,
        completedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-4">ผลการทำแบบทดสอบ</h2>
        <p className="text-2xl text-blue-600 font-semibold mb-6">ได้คะแนน: {score} / {questions.length}</p>
        <Link href="/dashboard" className="text-blue-500 hover:underline">กลับไปที่แดชบอร์ด</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-xl mt-10">
      <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
        <span>ข้อที่ {currentIndex + 1} จาก {questions.length}</span>
      </div>
      
      <h2 className="text-2xl mb-8 font-semibold text-gray-800">{currentQ.text}</h2>
      
      <div className="space-y-3">
        {currentQ.options.map((opt: string, i: number) => (
          <button 
            key={i}
            onClick={() => handleSelect(i)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all 
              ${answers[currentIndex] === i 
                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                : 'bg-white border-gray-200 hover:border-gray-300'}`}
          >
            {opt}
          </button>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        {currentIndex < questions.length - 1 ? (
          <button 
            onClick={handleNext} 
            disabled={answers[currentIndex] === undefined}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            ถัดไป
          </button>
        ) : (
          <button 
            onClick={handleSubmit} 
            disabled={answers[currentIndex] === undefined}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            ส่งคำตอบ
          </button>
        )}
      </div>
    </div>
  );
}
