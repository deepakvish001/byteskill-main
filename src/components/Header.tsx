
import { Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">BS</span>
          </div>
          <span className="text-xl font-bold text-white">Byteskill</span>
        </div>
        <span className="text-sm text-blue-400 font-medium">
          Unlock personalized learning and exclusive roadmaps. Explore Plans
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
          Get Plus
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
