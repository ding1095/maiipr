'use client';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export default function ManualQuestionForm({ quizId }: { quizId: string }) {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return alert("กรุณากรอกคำถาม");
    if (options.some(opt => !opt.trim())) return alert("กรุณากรอกตัวเลือกให้ครบทั้ง 4 ข้อ");

    setLoading(true);
    try {
      const questionsRef = collection(db, `quizzes/${quizId}/questions`);
      await addDoc(questionsRef, {
        text: questionText,
        options: options,
        correctAnswerIndex: correctIndex,
      });
      alert('เพิ่มข้อสอบสำเร็จ!');
      // Reset form
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectIndex(0);
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow mt-6">
      <h3 className="text-lg font-bold mb-4 text-purple-700">✍️ เพิ่มข้อสอบแบบพิมพ์ทีละข้อ</h3>
      <form onSubmit={handleAddQuestion} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">คำถาม</label>
          <textarea 
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-purple-500 min-h-[80px]"
            placeholder="เช่น เมืองหลวงของประเทศไทยคืออะไร?"
            required
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium">ตัวเลือก (ติ๊กจุดวงกลมเพื่อเลือกข้อที่ถูกต้อง)</label>
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              <input 
                type="radio" 
                name="correctAnswer" 
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                className="w-5 h-5 text-purple-600 focus:ring-purple-500 cursor-pointer"
                title={`ตั้งเป็นเฉลยข้อ ${i + 1}`}
              />
              <input 
                type="text" 
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                className={`w-full border rounded p-2 focus:outline-purple-500 ${correctIndex === i ? 'border-purple-400 bg-purple-50' : 'border-gray-300'}`}
                placeholder={`ตัวเลือกที่ ${i + 1}`}
                required
              />
            </div>
          ))}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกข้อสอบ'}
        </button>
      </form>
    </div>
  );
}
