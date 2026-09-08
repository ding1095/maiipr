import ScoreHistory from "@/components/Dashboard/ScoreHistory";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">แดชบอร์ดนักเรียน</h1>
        
        <ScoreHistory />
      </div>
    </div>
  );
}
