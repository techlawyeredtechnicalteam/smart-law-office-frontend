import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PerformanceReviewPanel() {
  return (
    <Card className="lg:col-span-1 shadow-sm border border-gray-100 h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Performance Review
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] flex items-end justify-around p-4">
        {/* Placeholder for the bar chart/avatars */}
        <div className="flex items-end h-full w-full space-x-4">
          {/* Placeholder Bars */}
          <div className="flex-1 h-1/3 bg-violet-200 rounded-t-md relative">
            {/* Avatars go here */}
          </div>
          <div className="flex-1 h-2/3 bg-violet-200 rounded-t-md relative">
            {/* Avatars go here */}
          </div>
          <div className="flex-1 h-full bg-violet-200 rounded-t-md relative">
            {/* Avatars go here */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
