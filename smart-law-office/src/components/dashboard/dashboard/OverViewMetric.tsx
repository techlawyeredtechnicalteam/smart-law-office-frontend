import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverviewMetricsProps {
  title: string;
  value: number | string;
  percentChange?: string;
  isPositive?: boolean;
  subtext?: string;
}

export function OverviewMetrics({
  title,
  value,
  percentChange,
  isPositive,
  subtext
}: OverviewMetricsProps) {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        {percentChange && (
          <p
            className={`text-sm mt-1 flex items-center ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            {percentChange}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
