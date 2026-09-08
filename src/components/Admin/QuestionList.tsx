'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export default function QuestionList({ quizId }: { quizId: string }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Edit State
  const [editPrompt, setEditPrompt] = useState('');
  const [editOptions, setEditOptions] = useState(['', '', '', '']);
  const [editCorrect, setEditCorrect] = useState(0);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const qRef = collection(db, `quizzes/${quizId}/questions`);
      const snapshot = await getDocs(qRef);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuestions(fetched);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const handleDelete = async (questionId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อสอบนี้?')) return;
    try {
      await deleteDoc(doc(db, `quizzes/${quizId}/questions`, questionId));
      fetchQuestions(); // Refresh list
    } catch (error) {
      console.error(error);
      alert('ลบข้อมูลไม่สำเร็จ');
    }
  };

  const startEdit = (q: any) => {
    setEditingId(q.id);
    setEditPrompt(q.text);
    setEditOptions(q.options || ['', '', '', '']);
    setEditCorrect(q.correctAnswerIndex || 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (questionId: string) => {
    try {
      const qRef = doc(db, `quizzes/${quizId}/questions`, questionId);
      await updateDoc(qRef, {
        text: editPrompt,
        options: editOptions,
        correctAnswerIndex: editCorrect
      });
      setEditingId(null);
      fetchQuestions();
    } catch (error) {
      console.error(error);
      alert('บันทึกการแก้ไขไม่สำเร็จ');
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const newOps = [...editOptions];
    newOps[index] = val;
    setEditOptions(newOps);
  };

  if (loading) return <div className="mt-8 text-center text-gray-500">กำลังโหลดคำถาม...</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">📋 รายการข้อสอบทั้งหมด ({questions.length} ข้อ)</h3>
        <button onClick={fetchQuestions} className="text-sm text-blue-600 hover:underline">🔄 รีเฟรช</button>
      </div>
      
      {questions.length === 0 ? (
        <p className="text-gray-500 bg-white p-4 rounded border">ยังไม่มีคำถามในชุดข้อสอบนี้</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              {editingId === q.id ? (
                <div className="space-y-3">
                  <label className="font-semibold text-sm">คำถาม:</label>
                  <textarea 
                    value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <label className="font-semibold text-sm block mt-2">ตัวเลือก (ติ๊กข้อที่ถูก):</label>
                  {editOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="radio" name="editCorrect" checked={editCorrect === i} onChange={() => setEditCorrect(i)} />
                      <input type="text" value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className="border p-1 flex-1 rounded" />
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleSaveEdit(q.id)} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">บันทึก</button>
                    <button onClick={cancelEdit} className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400">ยกเลิก</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg mb-2">ข้อ {index + 1}: {q.text}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(q)} className="text-sm text-blue-600 hover:underline">แก้ไข</button>
                      <button onClick={() => handleDelete(q.id)} className="text-sm text-red-600 hover:underline">ลบ</button>
                    </div>
                  </div>
                  <ul className="space-y-1 ml-4 list-decimal">
                    {q.options?.map((opt: string, i: number) => (
                      <li key={i} className={q.correctAnswerIndex === i ? 'text-green-600 font-bold' : 'text-gray-600'}>
                        {opt} {q.correctAnswerIndex === i && ' (เฉลย)'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
