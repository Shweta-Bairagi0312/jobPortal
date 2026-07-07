import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, DollarSign, Briefcase, Clock, Building2, Heart, Share2,
  ArrowLeft, Check, Calendar, Users, ChevronRight, FileText, Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import { jobAPI, savedJobAPI, applicationAPI } from '../utils/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobAPI.getById(id!);
        setJob(response.data.data);

        if (isAuthenticated) {
          const savedRes = await savedJobAPI.checkIfSaved(id!);
          setIsSaved(savedRes.data.isSaved);
        }
      } catch (error) {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id, isAuthenticated]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      return;
    }

    try {
      if (isSaved) {
        await savedJobAPI.unsave(id!);
        setIsSaved(false);
        toast.success('Job removed from saved list');
      } else {
        await savedJobAPI.save(id!);
        setIsSaved(true);
        toast.success('Job saved successfully');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (user?.role !== 'job_seeker') {
      toast.error('Only job seekers can apply');
      return;
    }

    setShowApplyModal(true);
  };

  const submitApplication = async () => {
    setApplying(true);
    try {
      await applicationAPI.apply(id!, { coverLetter });
      setHasApplied(true);
      setShowApplyModal(false);
      toast.success('Application submitted successfully!');
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to submit application';
      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = () => {
    if (!job?.salary?.min && !job?.salary?.max) return 'Salary not disclosed';
    const currency = job.salary?.currency || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    });
    if (job.salary?.min && job.salary?.max) {
      return `${formatter.format(job.salary.min)} - ${formatter.format(job.salary.max)}`;
    }
    return job.salary?.min ? `From ${formatter.format(job.salary.min)}` : `Up to ${formatter.format(job.salary.max || 0)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </button>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.companyName}
                className="w-20 h-20 rounded-xl object-cover border border-slate-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-blue-100 flex items-center justify-center border border-slate-200">
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
                  <Link
                    to={`/companies/${job.company?._id}`}
                    className="text-slate-600 hover:text-blue-600 transition"
                  >
                    {job.company?.companyName}
                  </Link>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className={`p-3 rounded-xl border ${
                      isSaved
                        ? 'border-red-200 bg-red-50 text-red-500'
                        : 'border-slate-200 hover:border-red-200 hover:text-red-500'
                    } transition`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-xl border border-slate-200 hover:border-blue-200 hover:text-blue-600 transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {job.jobType}
                </span>
                {job.experience && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {job.experience}
                  </span>
                )}
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  {formatSalary()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Job Description</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-20">
              {hasApplied ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-slate-800 font-medium">Applied Successfully</p>
                  <p className="text-sm text-slate-500 mt-1">We will notify you about updates</p>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Apply Now
                </button>
              )}

              <div className="border-t border-slate-200 mt-6 pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Posted</p>
                    <p className="text-sm font-medium text-slate-800">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Applicants</p>
                    <p className="text-sm font-medium text-slate-800">
                      {job.applicants?.length || 0} applied
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">About Company</h3>
              {job.company && (
                <div>
                  <Link
                    to={`/companies/${job.company._id}`}
                    className="flex items-center gap-3 hover:bg-slate-50 -mx-3 px-3 py-2 rounded-lg transition"
                  >
                    {job.company.logo ? (
                      <img src={job.company.logo} alt={job.company.companyName} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-800">{job.company.companyName}</p>
                      <p className="text-sm text-slate-500">{job.company.location}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Apply for {job.title}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  placeholder="Tell the employer why you're a great fit for this role..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {user?.resume ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Resume uploaded</p>
                    <p className="text-xs text-slate-500">Your profile resume will be used</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                  Please upload your resume in your profile before applying
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={submitApplication}
                  disabled={applying}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
