import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, FileText, TrendingUp, Clock } from 'lucide-react';
import { Application, Job, SavedJob } from '../types';
import { applicationAPI, savedJobAPI, jobAPI } from '../utils/api';
import JobCard from '../components/JobCard';

const Dashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applied' | 'saved'>('applied');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, savedRes, jobsRes] = await Promise.all([
          applicationAPI.getMy(),
          savedJobAPI.getMy(),
          jobAPI.getFeatured()
        ]);
        setApplications(appsRes.data.data);
        setSavedJobs(savedRes.data.data);
        setRecentJobs(jobsRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Applications Sent', value: applications.length, icon: FileText, color: 'bg-blue-100 text-blue-600' },
    { label: 'Under Review', value: applications.filter(a => a.status === 'reviewing' || a.status === 'pending').length, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'shortlisted').length, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Saved Jobs', value: savedJobs.length, icon: Heart, color: 'bg-red-100 text-red-600' }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      reviewing: 'bg-blue-100 text-blue-700',
      shortlisted: 'bg-purple-100 text-purple-700',
      rejected: 'bg-red-100 text-red-700',
      accepted: 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Track your job applications and manage your profile</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('applied')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === 'applied'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <FileText className="w-4 h-4" />
                Applied Jobs ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === 'saved'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <Heart className="w-4 h-4" />
                Saved Jobs ({savedJobs.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activeTab === 'applied' ? (
              applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-medium text-slate-800">No applications yet</h3>
                  <p className="text-slate-500 mt-1 mb-4">Start applying to jobs to track them here</p>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <Link
                          to={`/jobs/${app.job._id}`}
                          className="font-medium text-slate-800 hover:text-blue-600 transition"
                        >
                          {app.job.title}
                        </Link>
                        <p className="text-sm text-slate-500">{app.job.company?.companyName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      <span className="text-sm text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )
            ) : savedJobs.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-medium text-slate-800">No saved jobs</h3>
                <p className="text-slate-500 mt-1 mb-4">Save jobs to apply later</p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {savedJobs.map((saved) => (
                  saved.job && <JobCard key={saved._id} job={saved.job} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recommended Jobs</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700 transition">
              View All
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {recentJobs.slice(0, 4).map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
