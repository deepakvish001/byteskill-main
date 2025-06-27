import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Edit, Save, X, Plus, Trash2, Camera, Key, Github, Linkedin, Globe, Code, GraduationCap, Briefcase, Trophy, Calendar, MapPin, Building, ExternalLink, Upload } from 'lucide-react';
import { toast } from 'sonner';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import ProjectForm from './ProjectForm';
import AchievementForm from './AchievementForm';
import ChangePasswordForm from './ChangePasswordForm';
interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  mobile_number: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  leetcode_url: string | null;
  portfolio_url: string | null;
  location: string | null;
  company: string | null;
  job_title: string | null;
  xp_points: number;
  problems_solved: number;
  current_streak: number;
  max_streak: number;
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
  technologies: string[];
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
  const {
    user
  } = useAuth();
  const {
    trackProfileUpdate
  } = useActivityTracker();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    mobile_number: '',
    bio: '',
    github_url: '',
    linkedin_url: '',
    leetcode_url: '',
    portfolio_url: '',
    location: '',
    company: '',
    job_title: ''
  });

  // Dialog states
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);
  const fetchUserData = async () => {
    if (!user) return;
    try {
      setLoading(true);

      // Fetch profile
      const {
        data: profileData,
        error: profileError
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileError) throw profileError;
      setProfile(profileData);
      setProfileForm({
        full_name: profileData.full_name || '',
        mobile_number: profileData.mobile_number || '',
        bio: profileData.bio || '',
        github_url: profileData.github_url || '',
        linkedin_url: profileData.linkedin_url || '',
        leetcode_url: profileData.leetcode_url || '',
        portfolio_url: profileData.portfolio_url || '',
        location: profileData.location || '',
        company: profileData.company || '',
        job_title: profileData.job_title || ''
      });

      // Fetch education
      const {
        data: educationData
      } = await supabase.from('user_education').select('*').eq('user_id', user.id).order('start_date', {
        ascending: false
      });
      if (educationData) setEducation(educationData);

      // Fetch experience
      const {
        data: experienceData
      } = await supabase.from('user_experience').select('*').eq('user_id', user.id).order('start_date', {
        ascending: false
      });
      if (experienceData) setExperience(experienceData);

      // Fetch projects
      const {
        data: projectsData
      } = await supabase.from('user_projects').select('*').eq('user_id', user.id).order('start_date', {
        ascending: false
      });
      if (projectsData) setProjects(projectsData);

      // Fetch achievements
      const {
        data: achievementsData
      } = await supabase.from('user_achievements').select('*').eq('user_id', user.id).order('date_achieved', {
        ascending: false
      });
      if (achievementsData) setAchievements(achievementsData);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };
  const handleProfileUpdate = async () => {
    if (!user) return;
    try {
      const {
        error
      } = await supabase.from('profiles').update({
        ...profileForm,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      if (error) throw error;
      await fetchUserData();
      setEditing(false);
      await trackProfileUpdate();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('profile-pictures').upload(fileName, file);
      if (uploadError) throw uploadError;
      const {
        data
      } = supabase.storage.from('profile-pictures').getPublicUrl(fileName);
      const {
        error: updateError
      } = await supabase.from('profiles').update({
        avatar_url: data.publicUrl
      }).eq('id', user.id);
      if (updateError) throw updateError;
      await fetchUserData();
      toast.success('Profile picture updated successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };
  const handleDeleteItem = async (type: string, id: string) => {
    try {
      let error;
      switch (type) {
        case 'education':
          ({
            error
          } = await supabase.from('user_education').delete().eq('id', id));
          break;
        case 'experience':
          ({
            error
          } = await supabase.from('user_experience').delete().eq('id', id));
          break;
        case 'project':
          ({
            error
          } = await supabase.from('user_projects').delete().eq('id', id));
          break;
        case 'achievement':
          ({
            error
          } = await supabase.from('user_achievements').delete().eq('id', id));
          break;
      }
      if (error) throw error;
      await fetchUserData();
      toast.success(`${type} deleted successfully`);
    } catch (error: any) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };
  const openEditForm = (type: string, item?: any) => {
    setEditingItem(item);
    switch (type) {
      case 'education':
        setShowEducationForm(true);
        break;
      case 'experience':
        setShowExperienceForm(true);
        break;
      case 'project':
        setShowProjectForm(true);
        break;
      case 'achievement':
        setShowAchievementForm(true);
        break;
    }
  };
  const closeForm = () => {
    setEditingItem(null);
    setShowEducationForm(false);
    setShowExperienceForm(false);
    setShowProjectForm(false);
    setShowAchievementForm(false);
    setShowPasswordForm(false);
  };
  if (loading || !profile) {
    return <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>;
  }
  return <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gray-900/50 border-gray-800 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-orange-500/20">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-3xl">
                  {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 rounded-full p-2 cursor-pointer transition-colors">
                <Camera className="h-4 w-4 text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">{profile.full_name || profile.username}</h1>
                <div className="flex gap-2">
                  <Button onClick={() => setEditing(!editing)} variant="outline" className="border-gray-600 hover:border-orange-500 bg-zinc-950 hover:bg-zinc-800 text-zinc-50">
                    {editing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  <Button onClick={() => setShowPasswordForm(true)} variant="outline" className="border-gray-600 text-white hover:border-orange-500 bg-zinc-950 hover:bg-zinc-800">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
              <p className="text-xl text-gray-400 mb-2">@{profile.username}</p>
              {profile.job_title && profile.company && <p className="text-gray-300 mb-2">{profile.job_title} at {profile.company}</p>}
              {profile.location && <p className="text-gray-400 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </p>}
              {profile.bio && <p className="text-gray-300 mt-3 max-w-2xl">{profile.bio}</p>}
              
              {/* Social Links */}
              <div className="flex items-center gap-4 mt-4">
                {profile.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Github className="h-5 w-5" />
                  </a>}
                {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>}
                {profile.leetcode_url && <a href={profile.leetcode_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Code className="h-5 w-5" />
                  </a>}
                {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Globe className="h-5 w-5" />
                  </a>}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800 hover:border-yellow-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">XP Points</p>
                <p className="text-3xl font-bold text-white">{profile.xp_points}</p>
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-full">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Problems Solved</p>
                <p className="text-3xl font-bold text-white">{profile.problems_solved}</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-full">
                <Code className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 hover:border-orange-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-white">{profile.current_streak}</p>
              </div>
              <div className="bg-orange-500/10 p-3 rounded-full">
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Max Streak</p>
                <p className="text-3xl font-bold text-white">{profile.max_streak}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Edit Form */}
      {editing && <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-white">Full Name</Label>
                <Input id="full_name" value={profileForm.full_name} onChange={e => setProfileForm({
              ...profileForm,
              full_name: e.target.value
            })} className="bg-gray-800/50 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile_number" className="text-white">Mobile Number</Label>
                <Input id="mobile_number" value={profileForm.mobile_number} onChange={e => setProfileForm({
              ...profileForm,
              mobile_number: e.target.value
            })} className="bg-gray-800/50 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_title" className="text-white">Job Title</Label>
                <Input id="job_title" value={profileForm.job_title} onChange={e => setProfileForm({
              ...profileForm,
              job_title: e.target.value
            })} className="bg-gray-800/50 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-white">Company</Label>
                <Input id="company" value={profileForm.company} onChange={e => setProfileForm({
              ...profileForm,
              company: e.target.value
            })} className="bg-gray-800/50 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">Location</Label>
                <Input id="location" value={profileForm.location} onChange={e => setProfileForm({
              ...profileForm,
              location: e.target.value
            })} className="bg-gray-800/50 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url" className="text-white">GitHub URL</Label>
                <Input id="github_url" value={profileForm.github_url} onChange={e => setProfileForm({
              ...profileForm,
              github_url: e.target.value
            })} className="bg-gray-800/50 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="text-white">LinkedIn URL</Label>
                <Input id="linkedin_url" value={profileForm.linkedin_url} onChange={e => setProfileForm({
              ...profileForm,
              linkedin_url: e.target.value
            })} className="bg-gray-800/50 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leetcode_url" className="text-white">LeetCode URL</Label>
                <Input id="leetcode_url" value={profileForm.leetcode_url} onChange={e => setProfileForm({
              ...profileForm,
              leetcode_url: e.target.value
            })} className="bg-gray-800/50 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio_url" className="text-white">Portfolio URL</Label>
                <Input id="portfolio_url" value={profileForm.portfolio_url} onChange={e => setProfileForm({
              ...profileForm,
              portfolio_url: e.target.value
            })} className="bg-gray-800/50 border-gray-600 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Bio</Label>
              <Textarea id="bio" value={profileForm.bio} onChange={e => setProfileForm({
            ...profileForm,
            bio: e.target.value
          })} className="bg-gray-800/50 border-gray-600 text-white" rows={3} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setEditing(false)} variant="outline" className="border-gray-600 bg-zinc-950 hover:bg-zinc-800 text-zinc-50">
                Cancel
              </Button>
              <Button onClick={handleProfileUpdate} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>}

      {/* Detailed Sections - Education, Experience, Projects, Achievements */}
      <Tabs defaultValue="education" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border-gray-800">
          <TabsTrigger value="education" className="font-normal text-zinc-50 bg-zinc-950 hover:bg-zinc-800">
            <GraduationCap className="w-4 h-4 mr-2" />
            Education
          </TabsTrigger>
          <TabsTrigger value="experience" className="bg-zinc-950 hover:bg-zinc-800 text-zinc-50">
            <Briefcase className="w-4 h-4 mr-2" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-zinc-50 bg-zinc-950 hover:bg-zinc-800">
            <Code className="w-4 h-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="achievements" className="bg-zinc-950 hover:bg-zinc-800 text-zinc-50">
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="education">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Education</CardTitle>
                <CardDescription className="text-gray-400">Your educational background</CardDescription>
              </div>
              <Button onClick={() => openEditForm('education')} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </CardHeader>
            <CardContent>
              {education.length > 0 ? <div className="space-y-4">
                  {education.map(edu => <div key={edu.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{edu.degree}</h3>
                          <p className="text-orange-400">{edu.institution}</p>
                          {edu.field_of_study && <p className="text-gray-400">{edu.field_of_study}</p>}
                          <p className="text-sm text-gray-500">
                            {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}
                          </p>
                          {edu.description && <p className="text-gray-300 mt-2">{edu.description}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => openEditForm('education', edu)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400" onClick={() => handleDeleteItem('education', edu.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>)}
                </div> : <p className="text-gray-400 text-center py-8">No education records added yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Experience</CardTitle>
                <CardDescription className="text-gray-400">Your work experience</CardDescription>
              </div>
              <Button onClick={() => openEditForm('experience')} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardHeader>
            <CardContent>
              {experience.length > 0 ? <div className="space-y-4">
                  {experience.map(exp => <div key={exp.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{exp.position}</h3>
                          <p className="text-orange-400">{exp.company}</p>
                          {exp.location && <p className="text-gray-400 flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {exp.location}
                            </p>}
                          <p className="text-sm text-gray-500">
                            {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                          </p>
                          {exp.description && <p className="text-gray-300 mt-2">{exp.description}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => openEditForm('experience', exp)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400" onClick={() => handleDeleteItem('experience', exp.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>)}
                </div> : <p className="text-gray-400 text-center py-8">No experience records added yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Projects</CardTitle>
                <CardDescription className="text-gray-400">Your personal and professional projects</CardDescription>
              </div>
              <Button onClick={() => openEditForm('project')} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? <div className="space-y-4">
                  {projects.map(proj => <div key={proj.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{proj.title}</h3>
                          <p className="text-sm text-gray-500">
                            {proj.start_date} - {proj.is_ongoing ? 'Ongoing' : proj.end_date}
                          </p>
                          {proj.description && <p className="text-gray-300 mt-2">{proj.description}</p>}
                          {proj.technologies && proj.technologies.length > 0 && <div className="flex flex-wrap gap-1 mt-2">
                              {proj.technologies.map(tech => <Badge key={tech} variant="secondary" className="bg-orange-600/20 text-orange-400">
                                  {tech}
                                </Badge>)}
                            </div>}
                          <div className="flex items-center gap-2 mt-2">
                            {proj.github_url && <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                <Github className="h-4 w-4" />
                                GitHub
                              </a>}
                            {proj.live_url && <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                <ExternalLink className="h-4 w-4" />
                                Live Demo
                              </a>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => openEditForm('project', proj)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400" onClick={() => handleDeleteItem('project', proj.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>)}
                </div> : <p className="text-gray-400 text-center py-8">No project records added yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Achievements</CardTitle>
                <CardDescription className="text-gray-400">Your awards, certifications, and achievements</CardDescription>
              </div>
              <Button onClick={() => openEditForm('achievement')} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? <div className="space-y-4">
                  {achievements.map(achievement => <div key={achievement.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{achievement.title}</h3>
                          <p className="text-orange-400">{achievement.organization}</p>
                          <p className="text-sm text-gray-500">
                            {achievement.date_achieved}
                          </p>
                          {achievement.description && <p className="text-gray-300 mt-2">{achievement.description}</p>}
                          {achievement.certificate_url && <a href={achievement.certificate_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 mt-2">
                              <Upload className="h-4 w-4" />
                              View Certificate
                            </a>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => openEditForm('achievement', achievement)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400" onClick={() => handleDeleteItem('achievement', achievement.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>)}
                </div> : <p className="text-gray-400 text-center py-8">No achievement records added yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      <EducationForm education={editingItem} onSave={() => {
      fetchUserData();
      closeForm();
    }} onCancel={closeForm} open={showEducationForm} />
      
      <ExperienceForm experience={editingItem} onSave={() => {
      fetchUserData();
      closeForm();
    }} onCancel={closeForm} open={showExperienceForm} />
      
      <ProjectForm project={editingItem} onSave={() => {
      fetchUserData();
      closeForm();
    }} onCancel={closeForm} open={showProjectForm} />
      
      <AchievementForm achievement={editingItem} onSave={() => {
      fetchUserData();
      closeForm();
    }} onCancel={closeForm} open={showAchievementForm} />
      
      <ChangePasswordForm open={showPasswordForm} onCancel={closeForm} />
    </div>;
};
export default EnhancedUserProfile;