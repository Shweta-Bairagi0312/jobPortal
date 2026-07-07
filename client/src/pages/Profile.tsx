import { useState, useEffect } from 'react';
import { User, MapPin, Phone, FileText, Plus, X, Save, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Education, Experience } from '../types';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'education' | 'experience' | 'resume'>('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [] as string[]
  });
  const [skillInput, setSkillInput] = useState('');
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [editingEducation, setEditingEducation] = useState<number | null>(null);
  const [editingExperience, setEditingExperience] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || []
      });
      setEducation(user.education || []);
      setExperience(user.experience || []);
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('phone', formData.phone);
      updateData.append('location', formData.location);
      updateData.append('bio', formData.bio);
      updateData.append('skills', JSON.stringify(formData.skills));

      await authAPI.updateProfile(updateData);
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const saveEducation = async () => {
    setLoading(true);
    try {
      await authAPI.updateProfile({
        education: education
      } as unknown as FormData);
      await refreshUser();
      setEditingEducation(null);
      toast.success('Education updated');
    } catch {
      toast.error('Failed to update education');
    } finally {
      setLoading(false);
    }
  };

  const saveExperience = async () => {
    setLoading(true);
    try {
      await authAPI.updateProfile({
        experience: experience
      } as unknown as FormData);
      await refreshUser();
      setEditingExperience(null);
      toast.success('Experience updated');
    } catch {
      toast.error('Failed to update experience');
    } finally {
      setLoading(false);
    }
  };

  const addEducation = () => {
    setEducation([...education, {
      institution: '',
      degree: '',
      field: '',
      startYear: new Date().getFullYear()
    } as Education]);
    setEditingEducation(education.length);
  };

  const addExperience = () => {
    setExperience([...experience, {
      company: '',
      position: '',
      startDate: new Date().toISOString(),
      current: false
    } as Experience]);
    setEditingExperience(experience.length);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your personal information</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-blue-600" />
                  )}
                </div>
                <h2 className="font-semibold text-slate-800">{user?.name}</h2>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'profile', label: 'Profile Info', icon: User },
                  { id: 'education', label: 'Education', icon: FileText },
                  { id: 'experience', label: 'Experience', icon: FileText },
                  { id: 'resume', label: 'Resume', icon: FileText }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as typeof activeSection)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {activeSection === 'profile' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      placeholder="Tell employers about yourself..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.skills.map((skill) => (
                        <span key={skill} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="hover:text-blue-800">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="Add a skill..."
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={addSkill}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-800">Education</h2>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-lg">
                      {editingEducation === idx ? (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const updated = [...education];
                                updated[idx].institution = e.target.value;
                                setEducation(updated);
                              }}
                              placeholder="Institution"
                              className="px-3 py-2 border border-slate-300 rounded-lg"
                            />
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = [...education];
                                updated[idx].degree = e.target.value;
                                setEducation(updated);
                              }}
                              placeholder="Degree"
                              className="px-3 py-2 border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={saveEducation} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                              Save
                            </button>
                            <button onClick={() => setEditingEducation(null)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-slate-800">{edu.institution}</h3>
                            <p className="text-sm text-slate-600">{edu.degree} in {edu.field}</p>
                          </div>
                          <button
                            onClick={() => setEditingEducation(idx)}
                            className="p-2 text-slate-400 hover:text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-800">Experience</h2>
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-lg">
                      {editingExperience === idx ? (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...experience];
                                updated[idx].company = e.target.value;
                                setExperience(updated);
                              }}
                              placeholder="Company"
                              className="px-3 py-2 border border-slate-300 rounded-lg"
                            />
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => {
                                const updated = [...experience];
                                updated[idx].position = e.target.value;
                                setExperience(updated);
                              }}
                              placeholder="Position"
                              className="px-3 py-2 border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={saveExperience} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                              Save
                            </button>
                            <button onClick={() => setEditingExperience(null)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-slate-800">{exp.position}</h3>
                            <p className="text-sm text-slate-600">{exp.company}</p>
                          </div>
                          <button
                            onClick={() => setEditingExperience(idx)}
                            className="p-2 text-slate-400 hover:text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'resume' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-6">Resume</h2>
                {user?.resume ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-medium text-slate-800">Resume uploaded</p>
                        <p className="text-sm text-slate-500">Your resume is ready for applications</p>
                      </div>
                    </div>
                    <a
                      href={user.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      View
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-medium text-slate-800">No resume uploaded</h3>
                    <p className="text-slate-500 mt-1 mb-4">Upload your resume to apply faster</p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                      <Plus className="w-4 h-4" />
                      Upload Resume
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
