
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Trophy, Target, Flame, Calendar, Edit, Save, X, Upload, Github, 
  Linkedin, Globe, Code, MapPin, Building, Briefcase, GraduationCap,
  Award, Plus, Trash2, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  mobile_number: string | null;
  avatar_url: string | null;
  xp_points: number;
  problems_solved: number;
  current_streak: number;
  max_streak: number;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  leetcode_url: string | null;
  portfolio_url: string | null;
  location: string | null;
  company: string | null;
  job_title: string | null;
  created_at: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  location: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  technologies: string[] | null;
  github_url: string | null;
  live_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_ongoing: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date_achieved: string | null;
  organization: string | null;
  certificate_url: string | null;
}

const EnhancedUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchEducation(),
        fetchExperience(),
        fetchProjects(),
        fetchAchievements()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (error) throw error;
    setProfile(data);
  };

  const fetchEducation = async () => {
    const { data, error } = await supabase
      .from('user_education')
      .select('*')
      .eq('user_id', user?.id)
      .order('start_date', { ascending: false });

    if (error) throw error;
    setEducation(data || []);
  };

  const fetchExperience = async () => {
    const { data, error } = await supabase
      .from('user_experience')
      .select('*')
      .eq('user_id', user?.id)
      .order('start_date', { ascending: false });

    if (error) throw error;
    setExperience(data || []);
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('user_projects')
      .select('*')
      .eq('user_id', user?.id)
      .order('start_date', { ascending: false });

    if (error) throw error;
    setProjects(data || []);
  };

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user?.id)
      .order('date_achieved', { ascending: false });

    if (error) throw error;
    setAchievements(data || []);
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      await fetchProfile();
      toast.success('Avatar updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user?.id);

      if (error) throw error;
      
      await fetchProfile();
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    }
  };

  const getXPBadge = (xp: number) => {
    if (xp >= 10000) return { name: "Legendary", color: "bg-purple-600", progress: 100 };
    if (xp >= 5000) return { name: "Expert", color: "bg-red-600", progress: (xp - 5000) / 50 };
    if (xp >= 2500) return { name: "Advanced", color: "bg-orange-600", progress: (xp - 2500) / 25 };
    if (xp >= 1000) return { name: "Intermediate", color: "bg-blue-600", progress: (xp - 1000) / 15 };
    if (xp >= 500) return { name: "Beginner", color: "bg-green-600", progress: (xp - 500) / 5 };
    return { name: "Newbie", color: "bg-gray-600", progress: xp / 5 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!profile) return null;

  const badge = getXPBadge(profile.xp_points);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Profile Header */}
        <Card className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-gray-700 backdrop-blur-lg">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Avatar Section */}
              <div className="relative group">
                <Avatar className="h-32 w-32 ring-4 ring-orange-500/20">
                  <AvatarImage src={profile.avatar_url || undefined} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-4xl font-bold">
                    {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="h-8 w-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                      {profile.full_name || profile.username}
                    </h1>
                    <Badge className={`${badge.color} text-white text-lg px-4 py-2 font-semibold`}>
                      {badge.name}
                    </Badge>
                  </div>
                  <p className="text-xl text-gray-400 mb-2">@{profile.username}</p>
                  
                  {/* Location and Company */}
                  <div className="flex flex-wrap items-center gap-4 text-gray-400">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.company && (
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{profile.job_title ? `${profile.job_title} at ` : ''}{profile.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                    {profile.bio}
                  </p>
                )}

                {/* Social Links */}
                <div className="flex flex-wrap gap-3">
                  {profile.github_url && (
                    <Button variant="outline" size="sm" asChild className="border-gray-600 hover:border-gray-500">
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {profile.linkedin_url && (
                    <Button variant="outline" size="sm" asChild className="border-gray-600 hover:border-gray-500">
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {profile.leetcode_url && (
                    <Button variant="outline" size="sm" asChild className="border-gray-600 hover:border-gray-500">
                      <a href={profile.leetcode_url} target="_blank" rel="noopener noreferrer">
                        <Code className="h-4 w-4 mr-2" />
                        LeetCode
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {profile.portfolio_url && (
                    <Button variant="outline" size="sm" asChild className="border-gray-600 hover:border-gray-500">
                      <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Portfolio
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Edit Profile Button */}
              <ProfileEditDialog profile={profile} onUpdate={updateProfile} />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="XP Points"
            value={profile.xp_points}
            icon={Trophy}
            color="text-yellow-500"
            badge={badge}
          />
          <StatsCard
            title="Problems Solved"
            value={profile.problems_solved}
            icon={Target}
            color="text-green-500"
          />
          <StatsCard
            title="Current Streak"
            value={profile.current_streak}
            icon={Flame}
            color="text-orange-500"
          />
          <StatsCard
            title="Max Streak"
            value={profile.max_streak}
            icon={Calendar}
            color="text-blue-500"
          />
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 p-1 bg-gray-800 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'projects', label: 'Projects', icon: Code },
            { id: 'achievements', label: 'Achievements', icon: Award }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'education' && <EducationTab education={education} onUpdate={fetchEducation} />}
          {activeTab === 'experience' && <ExperienceTab experience={experience} onUpdate={fetchExperience} />}
          {activeTab === 'projects' && <ProjectsTab projects={projects} onUpdate={fetchProjects} />}
          {activeTab === 'achievements' && <AchievementsTab achievements={achievements} onUpdate={fetchAchievements} />}
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon: Icon, color, badge }: any) => (
  <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg hover:bg-gray-800/50 transition-colors">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white">{value?.toLocaleString() || 0}</p>
          {badge && title === 'XP Points' && (
            <div className="mt-2">
              <Progress value={badge.progress} className="h-2" />
              <p className="text-xs text-gray-400 mt-1">
                Progress to next level
              </p>
            </div>
          )}
        </div>
        <Icon className={`h-10 w-10 ${color}`} />
      </div>
    </CardContent>
  </Card>
);

const ProfileEditDialog = ({ profile, onUpdate }: any) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    bio: profile.bio || '',
    location: profile.location || '',
    company: profile.company || '',
    job_title: profile.job_title || '',
    github_url: profile.github_url || '',
    linkedin_url: profile.linkedin_url || '',
    leetcode_url: profile.leetcode_url || '',
    portfolio_url: profile.portfolio_url || '',
    mobile_number: profile.mobile_number || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile_number">Mobile Number</Label>
              <Input
                id="mobile_number"
                value={formData.mobile_number}
                onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="bg-gray-800 border-gray-600"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title</Label>
            <Input
              id="job_title"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              className="bg-gray-800 border-gray-600"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="bg-gray-800 border-gray-600"
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="bg-gray-800 border-gray-600"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leetcode_url">LeetCode URL</Label>
                <Input
                  id="leetcode_url"
                  value={formData.leetcode_url}
                  onChange={(e) => setFormData({ ...formData, leetcode_url: e.target.value })}
                  className="bg-gray-800 border-gray-600"
                  placeholder="https://leetcode.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                <Input
                  id="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  className="bg-gray-800 border-gray-600"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-orange-500 to-red-500">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Placeholder components for different tabs
const OverviewTab = () => (
  <Card className="bg-gray-900/50 border-gray-700">
    <CardContent className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>
      <p className="text-gray-400">Your learning journey overview will be displayed here with progress charts and recent activity.</p>
    </CardContent>
  </Card>
);

const EducationTab = ({ education, onUpdate }: any) => (
  <Card className="bg-gray-900/50 border-gray-700">
    <CardContent className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Education</h3>
        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>
      {education.length === 0 ? (
        <p className="text-gray-400">No education entries yet. Add your educational background!</p>
      ) : (
        <div className="space-y-4">
          {education.map((edu: Education) => (
            <div key={edu.id} className="border border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white">{edu.degree} - {edu.institution}</h4>
              {edu.field_of_study && <p className="text-gray-400">{edu.field_of_study}</p>}
              <p className="text-sm text-gray-500">
                {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}
              </p>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const ExperienceTab = ({ experience, onUpdate }: any) => (
  <Card className="bg-gray-900/50 border-gray-700">
    <CardContent className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Work Experience</h3>
        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>
      {experience.length === 0 ? (
        <p className="text-gray-400">No work experience added yet. Share your professional journey!</p>
      ) : (
        <div className="space-y-4">
          {experience.map((exp: Experience) => (
            <div key={exp.id} className="border border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white">{exp.position} - {exp.company}</h4>
              {exp.location && <p className="text-gray-400">{exp.location}</p>}
              <p className="text-sm text-gray-500">
                {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
              </p>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const ProjectsTab = ({ projects, onUpdate }: any) => (
  <Card className="bg-gray-900/50 border-gray-700">
    <CardContent className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Projects</h3>
        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>
      {projects.length === 0 ? (
        <p className="text-gray-400">No projects added yet. Showcase your work!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project: Project) => (
            <div key={project.id} className="border border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white">{project.title}</h4>
              <p className="text-gray-400 text-sm mb-2">{project.description}</p>
              {project.technologies && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                {project.github_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-3 w-3" />
                    </a>
                  </Button>
                )}
                {project.live_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const AchievementsTab = ({ achievements, onUpdate }: any) => (
  <Card className="bg-gray-900/50 border-gray-700">
    <CardContent className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Achievements</h3>
        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Achievement
        </Button>
      </div>
      {achievements.length === 0 ? (
        <p className="text-gray-400">No achievements added yet. Celebrate your accomplishments!</p>
      ) : (
        <div className="space-y-4">
          {achievements.map((achievement: Achievement) => (
            <div key={achievement.id} className="border border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white">{achievement.title}</h4>
              {achievement.organization && <p className="text-gray-400">{achievement.organization}</p>}
              <p className="text-gray-400 text-sm">{achievement.description}</p>
              <p className="text-sm text-gray-500">{achievement.date_achieved}</p>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default EnhancedUserProfile;
