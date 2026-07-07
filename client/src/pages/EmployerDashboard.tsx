import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, FileText, TrendingUp, Plus, Eye, Trash2 } from 'lucide-react';
import { Job, Application, Company } from '../types';
import { jobAPI, applicationAPI, companyAPI } from '../utils/api';
import toast from 'react-hot-toast';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes, companyRes] = await Promise.all([
        jobAPI.getEmployerJobs(),
        applicationAPI.getEmployer(),
        companyAPI.getMy().catch(() => ({ data: { data: null } }))
      ]);
      setJobs(jobsRes.data.data);
      setApplications(appsRes.data.data);
      setCompany(companyRes.data.data);
    } catch (error) {
      console.error('Error fetching employer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await jobAPI.delete(jobId);
      setJobs(jobs.filter(j => j._id !== jobId));
      toast.success('Job deleted successfully');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  const handleUpdateStatus = async (app: Application, status: string) => {
    try {
      await applicationAPI.updateStatus(app._id, { status });
      setApplications(applications.map(a =>
        a._id === app._id ? { ...a, status: status as Application['status'] } : a
      ));
      toast.success(`Application ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const stats = [
    { label: 'Active Jobs', value: jobs.filter(j => j.isActive).length, icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Applications', value: applications.length, icon: FileText, color: 'bg-purple-100 text-purple-600' },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'pending').length, icon: Users, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Hired', value: applications.filter(a => a.status === 'accepted').length, icon: TrendingUp, color: 'bg-green-100 text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Employer Dashboard</h1>
              <p className="text-slate-500 mt-1">Manage your jobs and applicants</p>
            </div>
            {company ? (
              <Link
                to="/employer/post-job"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                Post New Job
              </Link>
            ) : (
              <Link
                to="/employer/create-company"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                Create Company
              </Link>
            )}
          </div>
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
                onClick={() => setActiveTab('jobs')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === 'jobs'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                My Jobs ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab('applicants')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === 'applicants'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <Users className="w-4 h-4" />
                Applicants ({applications.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activeTab === 'jobs' ? (
              !company ? (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-medium text-slate-800">Create your company profile first</h3>
                  <p className="text-slate-500 mt-1 mb-4">You need to create a company profile before posting jobs</p>
                  <Link
                    to="/employer/create-company"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create Company Profile
                  </Link>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-medium text-slate-800">No jobs posted yet</h3>
                  <p className="text-slate-500 mt-1 mb-4">Post your first job to start receiving applications</p>
                  <Link
                    to="/employer/post-job"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Post Job
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Job Title</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Location</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Applicants</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job._id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-4">
                            <Link to={`/jobs/${job._id}`} className="font-medium text-slate-800 hover:text-blue-600">
                              {job.title}
                            </Link>
                          </td>
                          <td className="py-4 px-4 text-slate-600">{job.location}</td>
                          <td className="py-4 px-4 text-slate-600">{job.jobType}</td>
                          <td className="py-4 px-4 text-slate-600">{job.applicants?.length || 0}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {job.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/jobs/${job._id}`} className="p-2 text-slate-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteJob(job._id)}
                                className="p-2 text-slate-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-medium text-slate-800">No applicants yet</h3>
                <p className="text-slate-500 mt-1">Applicants will appear here when they apply to your jobs</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800">{app.applicant.name}</h3>
                      <p className="text-sm text-slate-500">{app.job.title}</p>
                      <p className="text-sm text-slate-400">{app.applicant.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app, e.target.value)}
                        className="px-3 py-1 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="accepted">Accepted</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
