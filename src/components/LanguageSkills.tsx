
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LanguageSkills = () => {
  const languages = [
    { name: "C++", problems: 937, color: "bg-blue-500" },
    { name: "MySQL", problems: 91, color: "bg-orange-500" },
    { name: "JavaScript", problems: 35, color: "bg-yellow-500" }
  ];

  const skills = [
    { category: "Advanced", items: [
      { name: "Dynamic Programming", count: 186, color: "bg-purple-500" },
      { name: "Backtracking", count: 92, color: "bg-red-500" }
    ]},
    { category: "Intermediate", items: [
      { name: "Hash Table", count: 190, color: "bg-green-500" },
      { name: "Math", count: 161, color: "bg-blue-500" }
    ]},
    { category: "Fundamental", items: [
      { name: "Array", count: 528, color: "bg-cyan-500" },
      { name: "String", count: 234, color: "bg-pink-500" },
      { name: "Sorting", count: 118, color: "bg-indigo-500" }
    ]}
  ];

  return (
    <div className="space-y-6">
      {/* Languages */}
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {languages.map((lang, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-300">{lang.name}</span>
              <span className="text-white font-semibold">{lang.problems} problems solved</span>
            </div>
          ))}
          <button className="text-blue-400 text-sm hover:underline">Show more</button>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {skills.map((skillGroup, groupIndex) => (
            <div key={groupIndex}>
              <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  skillGroup.category === 'Advanced' ? 'bg-red-500' :
                  skillGroup.category === 'Intermediate' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}></span>
                {skillGroup.category}
              </h4>
              <div className="space-y-2">
                {skillGroup.items.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-white">x{skill.count}</span>
                  </div>
                ))}
              </div>
              {groupIndex < skills.length - 1 && (
                <button className="text-blue-400 text-sm hover:underline mt-2">Show more</button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSkills;
