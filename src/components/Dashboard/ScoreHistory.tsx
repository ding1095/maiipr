'use client';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/client';

export default function ScoreHistory() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const q = query(
          collection(db, 'results'), 
          where('userId', '==', 'mai'),
          orderBy('completedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedResults = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResults(fetchedResults);
      } catch (error) {
        console.error("Error fetching results: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div className="p-10 text-center">กำลังโหลดประวัติของมาย...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">ประวัติการทำแบบทดสอบของคุณ</h2>
      <div className="space-y-4">
        {results.map(res => (
          <div key={res.id} className="p-5 border border-gray-100 rounded-lg shadow-sm flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition">
            <div>
              <p className="font-semibold text-lg text-gray-800">รหัสแบบทดสอบ: {res.quizId}</p>
              <p className="text-sm text-gray-500 mt-1">
                สอบเมื่อ: {res.completedAt?.toDate().toLocaleString('th-TH')}
              </p>
            </div>
            <div className="text-2xl font-black text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
              {res.score} <span className="text-lg text-blue-400">/ {res.totalQuestions}</span>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="text-center py-10 text-gray-500">คุณยังไม่เคยทำแบบทดสอบใด ๆ</div>
        )}
      </div>
    </div>
  );
}
