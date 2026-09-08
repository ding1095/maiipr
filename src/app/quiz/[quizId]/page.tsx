'use client';
import { useEffect, useState, use } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import QuizTaker from '@/components/Quiz/QuizTaker';
import Link from 'next/link';

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  // Use `use(params)` to unwrap the Promise in Next.js 15+ Client Components
  const { quizId } = use(params);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [quizInfo, setQuizInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      try {
        // Fetch Quiz Info
        const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
        if (!quizDoc.exists()) {
          setError("ไม่พบแบบทดสอบนี้ในระบบ");
          setLoading(false);
          return;
        }
        setQuizInfo(quizDoc.data());

        // Fetch Questions
        const qRef = collection(db, `quizzes/${quizId}/questions`);
        const snapshot = await getDocs(qRef);
        
        if (snapshot.empty) {
          setError("แบบทดสอบนี้ยังไม่มีคำถาม");
        } else {
          // Shuffle questions or just map them
          const fetchedQuestions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setQuestions(fetchedQuestions);
        }
      } catch (err) {
        console.error(err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อสอบ (อย่าลืมตั้ง Rules ให้รองรับการอ่านด้วยนะครับ)");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndQuestions();
  }, [quizId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">กำลังเตรียมข้อสอบ...</div>;
  
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-gray-50">
      <div className="text-2xl text-red-500 mb-4">{error}</div>
      <Link href="/quiz" className="text-blue-500 hover:underline">กลับไปเลือกแบบทดสอบใหม่</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">{quizInfo?.title}</h1>
        <p className="text-gray-500 mt-2">จำนวน {questions.length} ข้อ</p>
      </div>
      
      <QuizTaker quizId={quizId} questions={questions} />
    </div>
  );
}
