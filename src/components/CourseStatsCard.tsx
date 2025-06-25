
import { Card, CardContent } from "@/components/ui/card";

interface CourseStatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const CourseStatsCard = ({ title, value, icon, color }: CourseStatsCardProps) => {
  return (
    <Card className="bg-gray-900/50 border-gray-700 hover:bg-gray-900/70 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseStatsCard;
