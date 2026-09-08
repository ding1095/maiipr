'use client';
import { useState, useEffect } from 'react';
import CSVUploader from "@/components/Admin/CSVUploader";
import ManualQuestionForm from "@/components/Admin/ManualQuestionForm";
import { db } from '@/lib/firebase/client';
import { doc, setDoc, serverTimestamp, collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function AdminPage() {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Admin State
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [quizId, setQuizId] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Existing Quizzes
  const fetchQuizzes = async () => {
    try {
      const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetchedQuizzes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(fetchedQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes: ", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchQuizzes();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "din" && password === "dinadmin") {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("รหัสผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizId || !title) return alert("กรุณากรอกรหัสและชื่อชุดข้อสอบ");
    
    setLoading(true);
    try {
      await setDoc(doc(db, "quizzes", quizId), {
        title,
        createdAt: serverTimestamp(),
        isActive: true
      });
      alert("สร้างหัวข้อสอบสำเร็จ!");
      setView('edit');
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด: ตรวจสอบการตั้งค่า Firebase Security Rules");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExistingQuiz = (qId: string, qTitle: string) => {
    setQuizId(qId);
    setTitle(qTitle);
    setView('edit');
  };

  const handleBackToList = () => {
    setView('list');
    setQuizId("");
    setTitle("");
    fetchQuizzes();
  };

  // 1. หน้า Login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <div className="text-center mb-6">
            <span className="text-4xl">🔐</span>
            <h1 className="text-2xl font-bold mt-2">เข้าสู่ระบบ (Admin)</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้ (Username)</label>
              <input 
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">รหัสผ่าน (Password)</label>
              <input 
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none" required
              />
            </div>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700">
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">จัดการระบบ (Admin Dashboard)</h1>
          <button onClick={() => setIsLoggedIn(false)} className="text-red-500 hover:underline">ออกจากระบบ</button>
        </div>
        
        {/* หน้าแสดงรายการชุดข้อสอบ */}
        {view === 'list' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-purple-700">สร้างชุดข้อสอบใหม่</h2>
                <p className="text-gray-500 text-sm">เพิ่มหัวข้อวิชาใหม่ลงในระบบ</p>
              </div>
              <button onClick={() => setView('create')} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                + สร้างใหม่
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">ชุดข้อสอบที่มีอยู่แล้ว (แก้ไข/เพิ่มข้อสอบ)</h2>
              {quizzes.length === 0 ? (
                <p className="text-gray-500">ยังไม่มีชุดข้อสอบในระบบ</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {quizzes.map(q => (
                    <div key={q.id} className="border p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 cursor-pointer" onClick={() => handleSelectExistingQuiz(q.id, q.title)}>
                      <div>
                        <h3 className="font-semibold text-lg">{q.title}</h3>
                        <p className="text-xs text-gray-500">ID: {q.id}</p>
                      </div>
                      <span className="text-purple-600 text-sm font-medium">จัดการ &rarr;</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* หน้าสร้างชุดข้อสอบใหม่ */}
        {view === 'create' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">สร้างหัวข้อแบบทดสอบใหม่</h2>
              <button onClick={handleBackToList} className="text-gray-500 hover:underline">กลับไปหน้าแรก</button>
            </div>
            <form onSubmit={handleCreateQuiz} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium mb-1">รหัสชุดข้อสอบ (เช่น math-01)</label>
                <input 
                  type="text" value={quizId} onChange={(e) => setQuizId(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-purple-500" required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อชุดข้อสอบ</label>
                <input 
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-purple-500" required
                />
              </div>
              <button type="submit" disabled={loading} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50">
                {loading ? "กำลังสร้าง..." : "บันทึกข้อมูล"}
              </button>
            </form>
          </div>
        )}

        {/* หน้าแก้ไข / เพิ่มคำถามในชุดข้อสอบ */}
        {view === 'edit' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                จัดการคำถาม: <span className="text-purple-600">{title}</span>
              </h2>
              <button onClick={handleBackToList} className="text-sm text-gray-500 hover:text-purple-600 hover:underline flex items-center">
                &larr; กลับไปเลือกชุดข้อสอบ
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <CSVUploader quizId={quizId} />
              </div>
              <div>
                <ManualQuestionForm quizId={quizId} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
