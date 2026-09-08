import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-2xl text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          ระบบทำแบบทดสอบออนไลน์
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          ยินดีต้อนรับสู่แพลตฟอร์มทำแบบทดสอบ (Online Quiz Platform) ที่สร้างด้วย Next.js และ Firebase
        </p>

        <div className="flex gap-4 flex-col sm:flex-row w-full justify-center sm:justify-start">
          <Link
            href="/dashboard"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-8"
          >
            ไปที่แดชบอร์ด
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-900 hover:bg-gray-50 text-sm sm:text-base h-10 sm:h-12 px-8"
          >
            ผู้ดูแลระบบ (Admin)
          </Link>
        </div>
      </main>
    </div>
  );
}
