
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Link, Github, Linkedin } from "lucide-react";

const ProfileHeader = () => {
  return (
    <Card className="bg-black border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
          {/* Profile Image */}
          <div className="relative">
            <img
              src="/placeholder.svg"
              alt="Profile"
              className="w-24 h-24 rounded-lg border-2 border-gray-700"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black"></div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold text-white">Deepak Vishwakarma</h1>
                <p className="text-gray-400">@deepakvish001</p>
                <p className="text-sm text-gray-500">Rank 12,818</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                India
              </div>
              <div className="flex items-center">
                <Link className="w-4 h-4 mr-1" />
                https://www.byteskill.in/
              </div>
              <div className="flex items-center">
                <Github className="w-4 h-4 mr-1" />
                deepakvish001
              </div>
              <div className="flex items-center">
                <Linkedin className="w-4 h-4 mr-1" />
                deepakvish001
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">
              ✅ Founder and CEO at Byteskill | 🎓 MS in DS&AI from University of Arizona, LPU
              🏆 7+ Years of Diverse Professional Experience
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-900 text-blue-400 border-blue-800">Byteskill | Founder and CEO</Badge>
              <Badge className="bg-gray-800 text-gray-400 border-gray-700">Lovely Professional University</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
