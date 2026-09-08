'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

const encouragements = [
  "ตั้งใจทำนะครับคนเก่ง ครูมายเป็นกำลังใจให้เสมอครับ ✌️",
  "ค่อยๆ คิดนะครับ ไม่ต้องรีบ คุณทำได้อยู่แล้วครับ ✨",
  "ไม่ต้องกดดันตัวเองนะครับ ทำเต็มที่ก็เก่งที่สุดแล้วครับ 💖",
  "เชื่อมั่นในตัวเองนะครับ ครูมายรู้ว่าคุณทำได้แน่นอนครับ 🌟",
  "ข้อสอบอาจจะยากหน่อย แต่ความสามารถคุณมีมากกว่านั้น สู้ๆ ครับ! 🎯",
  "รวบรวมสมาธินะครับ ทำให้เต็มที่ ครูมายรอคอยดูความสำเร็จอยู่นะครับ 📚",
  "เหนื่อยก็ยิ้มสู้ไว้นะครับ เป็นกำลังใจให้ในทุกๆ ข้อเลยครับ 😊"
];

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // สุ่มข้อความเมื่อหน้าเว็บโหลด
    const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];
    setMessage(randomMsg);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center font-sans text-gray-800">
      <main className="w-full max-w-3xl bg-white p-10 sm:p-14 rounded-[3rem] shadow-2xl text-center transform transition-all duration-500 hover:shadow-3xl">
        <div className="mb-6">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full shadow-inner">
            <span className="text-6xl drop-shadow-md">🎓</span>
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4 drop-shadow-sm leading-tight">
          แบบทดสอบออนไลน์
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-500 mb-8 font-medium">
          เตรียมตัวให้พร้อม แล้วมาพิชิตคะแนนกันเลย!
        </p>

        <div className="min-h-[80px] flex items-center justify-center mb-10">
          {message ? (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 text-purple-800 px-8 py-5 rounded-2xl text-lg sm:text-xl font-semibold shadow-sm transition-all duration-500 ease-in-out transform hover:scale-105">
              "{message}"
            </div>
          ) : (
            <div className="animate-pulse bg-gray-100 h-16 w-3/4 rounded-2xl"></div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row w-full justify-center gap-5">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full overflow-hidden shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-1"
          >
            <span className="mr-3 text-2xl group-hover:animate-bounce">🚀</span>
            เริ่มทำแบบทดสอบ
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-all duration-300"
          >
            <span className="mr-2">⚙️</span>
            สำหรับผู้ดูแล (Admin)
          </Link>
        </div>
      </main>
    </div>
  );
}
