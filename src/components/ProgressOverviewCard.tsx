
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressItem {
  label: string;
  completed: number;
  total: number;
  color: string;
}

interface ProgressOverviewCardProps {
  totalProgress: number;
  totalCompleted: number;
  totalProblems: number;
  progressItems: ProgressItem[];
}

const ProgressOverviewCard = ({ 
  totalProgress, 
  totalCompleted, 
  totalProblems, 
  progressItems 
}: ProgressOverviewCardProps) => {
  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">DSA Progress Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Total Progress</span>
            <span className="text-white font-bold">{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
          <p className="text-sm text-gray-400 mt-1">
            {totalCompleted} / {totalProblems}
          </p>
        </div>
        
        {progressItems.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">{item.label}</span>
              <span className="text-white font-bold">
                {item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0}%
              </span>
            </div>
            <Progress 
              value={item.total > 0 ? (item.completed / item.total) * 100 : 0} 
              className="h-2" 
            />
            <p className="text-sm text-gray-400 mt-1">
              {item.completed} / {item.total} completed
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProgressOverviewCard;
