import CSVUploader from "@/components/Admin/CSVUploader";

export default function AdminPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">จัดการระบบ (Admin)</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">นำเข้าข้อสอบใหม่ (ตัวอย่าง Quiz ID: "quiz-001")</h2>
          <CSVUploader quizId="quiz-001" />
        </div>
      </div>
    </div>
  );
}
