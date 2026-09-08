'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import { db } from '@/lib/firebase/client';
import { collection, writeBatch, doc } from 'firebase/firestore';

interface CSVRow {
  Question: string;
  OptionA: string;
  OptionB: string;
  OptionC: string;
  OptionD: string;
  CorrectAnswer: string;
}

export default function CSVUploader({ quizId }: { quizId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = () => {
    if (!file) return alert('กรุณาเลือกไฟล์ CSV ก่อน');
    setLoading(true);

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const batch = writeBatch(db);
          const questionsRef = collection(db, `quizzes/${quizId}/questions`);

          const answerMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

          results.data.forEach((row) => {
            const newDocRef = doc(questionsRef);
            batch.set(newDocRef, {
              text: row.Question,
              options: [row.OptionA, row.OptionB, row.OptionC, row.OptionD],
              correctAnswerIndex: answerMap[row.CorrectAnswer?.toUpperCase()] ?? 0,
            });
          });

          await batch.commit();
          alert('นำเข้าข้อสอบสำเร็จ!');
        } catch (error) {
          console.error(error);
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
          setLoading(false);
          setFile(null);
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-md bg-white border border-gray-200 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">อัปโหลด CSV นำเข้าข้อสอบ</h3>
      <input 
        type="file" 
        accept=".csv" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none mb-4 p-2"
      />
      <button 
        onClick={handleUpload} 
        disabled={loading || !file}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'กำลังนำเข้า...' : 'นำเข้าข้อมูลเข้าสู่ระบบ'}
      </button>
    </div>
  );
}
