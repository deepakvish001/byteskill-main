
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const HeatMapCalendar = () => {
  // Generate sample data for the last 12 months
  const generateHeatMapData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Generate random activity level (0-4)
      const activity = Math.floor(Math.random() * 5);
      
      data.push({
        date: date.toISOString().split('T')[0],
        count: activity,
        level: activity
      });
    }
    
    return data;
  };

  const heatMapData = generateHeatMapData();
  
  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0: return "bg-gray-800";
      case 1: return "bg-green-900";
      case 2: return "bg-green-700";
      case 3: return "bg-green-600";
      case 4: return "bg-green-500";
      default: return "bg-gray-800";
    }
  };

  // Group data by weeks
  const weeks = [];
  for (let i = 0; i < heatMapData.length; i += 7) {
    weeks.push(heatMapData.slice(i, i + 7));
  }

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-400" />
          Solve Calendar
        </CardTitle>
        <CardDescription className="text-gray-400">
          Your coding activity over the past year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-53 gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(day.level)} hover:ring-1 hover:ring-gray-400 transition-all cursor-pointer`}
                    title={`${day.date}: ${day.count} problems solved`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-400">Less</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatMapCalendar;
