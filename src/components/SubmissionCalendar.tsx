
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SubmissionCalendar = () => {
  // Generate calendar data for the past year
  const generateCalendarData = () => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Generate random submission count (0-4)
      const submissions = Math.floor(Math.random() * 5);
      
      data.push({
        date: date.toISOString().split('T')[0],
        count: submissions
      });
    }
    
    return data;
  };

  const calendarData = generateCalendarData();
  
  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-gray-800";
    if (count === 1) return "bg-green-900";
    if (count === 2) return "bg-green-700";
    if (count === 3) return "bg-green-600";
    return "bg-green-500";
  };

  // Group data by weeks
  const weeks = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">1,094 submissions in the past one year</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
              <span>Total active days: 179</span>
              <span>Max streak: 114</span>
              <span>Current</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Month labels */}
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          {months.map((month, index) => (
            <span key={index}>{month}</span>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-53 gap-1 mb-4">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${getIntensityClass(day.count)} hover:ring-1 hover:ring-gray-400 transition-all cursor-pointer`}
                  title={`${day.date}: ${day.count} submissions`}
                />
              ))}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getIntensityClass(level)}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">More</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionCalendar;
