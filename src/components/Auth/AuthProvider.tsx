'use client';
import { useEffect } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ลงชื่อเข้าใช้อัตโนมัติแบบไม่ระบุตัวตน (Anonymous) สำหรับนักเรียน
    // เพื่อให้ระบบสามารถบันทึกและดึงคะแนนของแต่ละเครื่อง/เบราว์เซอร์ได้
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((user: any) => {
        if (!user) {
          signInAnonymously(auth).catch((error) => {
            console.error("Anonymous auth failed:", error);
          });
        }
      });
      return () => unsubscribe();
    }
  }, []);

  return <>{children}</>;
}
