'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import Link from 'next/link';

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetchedQuizzes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes: ", error);
      } finally {
        setLoading(false);
      }
    };

    // Make sure Firebase is initialized
    if (db) {
      fetchQuizzes();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            เลือกแบบทดสอบที่ต้องการทำ
          </h1>
          <Link href="/" className="text-purple-600 hover:underline">กลับหน้าหลัก</Link>
        </div>
        
        {loading ? (
          <div className="text-center p-10 text-xl text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : quizzes.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-2xl shadow-sm text-gray-500">
            ยังไม่มีแบบทดสอบในระบบครับ รอคุณครูมาเพิ่มข้อสอบก่อนนะ 😊
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-purple-100 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">รหัสข้อสอบ: {quiz.id}</p>
                </div>
                <Link 
                  href={`/quiz/${quiz.id}`}
                  className="w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  เริ่มทำข้อสอบ
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
