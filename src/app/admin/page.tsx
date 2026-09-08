'use client';
import { useState } from 'react';
import CSVUploader from "@/components/Admin/CSVUploader";
import { db } from '@/lib/firebase/client';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminPage() {
  const [quizId, setQuizId] = useState("");
  const [title, setTitle] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizId || !title) return alert("กรุณากรอกรหัสและชื่อชุดข้อสอบ");
    
    setLoading(true);
    try {
      // สร้าง Document ใน Collection quizzes เพื่อให้ระบบรู้ว่ามีชุดข้อสอบนี้อยู่
      await setDoc(doc(db, "quizzes", quizId), {
        title,
        createdAt: serverTimestamp(),
        isActive: true
      });
      setIsCreated(true);
      alert("สร้างหัวข้อสอบสำเร็จ! กรุณาอัปโหลดไฟล์ CSV ต่อไป");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด: ตรวจสอบการตั้งค่า Firebase Security Rules");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">จัดการระบบ (Admin)</h1>
        
        {!isCreated ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold mb-4">1. สร้างหัวข้อแบบทดสอบใหม่</h2>
            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">รหัสชุดข้อสอบ (เช่น math-01, quiz-001)</label>
                <input 
                  type="text" 
                  value={quizId}
                  onChange={(e) => setQuizId(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-blue-500"
                  placeholder="รหัสภาษาอังกฤษหรือตัวเลข (ห้ามเว้นวรรค)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อชุดข้อสอบ (เช่น แบบทดสอบคณิตศาสตร์ บทที่ 1)</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-blue-500"
                  placeholder="พิมพ์ชื่อแบบทดสอบ"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "กำลังสร้าง..." : "สร้างชุดข้อสอบ"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                2. นำเข้าคำถามสำหรับ: <span className="text-blue-600">{title}</span>
              </h2>
              <button onClick={() => setIsCreated(false)} className="text-sm text-gray-500 hover:underline">
                สร้างชุดข้อสอบอื่น
              </button>
            </div>
            <CSVUploader quizId={quizId} />
          </div>
        )}
      </div>
    </div>
  );
}
