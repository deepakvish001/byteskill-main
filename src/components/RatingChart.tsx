
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const RatingChart = () => {
  const ratingData = [
    { date: "2019", rating: 1200 },
    { date: "2020", rating: 1350 },
    { date: "2021", rating: 1400 },
    { date: "2022", rating: 1480 },
    { date: "2023", rating: 1520 },
    { date: "2024", rating: 1545 }
  ];

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Contest Rating</p>
            <p className="text-2xl font-bold text-white">1,545</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Global Ranking</p>
            <p className="text-lg font-semibold text-white">227,661 / 700k</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Attended</p>
            <p className="text-lg font-semibold text-white">20</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Top</p>
            <p className="text-2xl font-bold text-orange-400">32.64%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingData}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis hide />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingChart;
