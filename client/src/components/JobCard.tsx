import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Clock, Building2 } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  showCompany?: boolean;
}

const JobCard = ({ job, showCompany = true }: JobCardProps) => {
  const formatSalary = () => {
    if (!job.salary?.min && !job.salary?.max) return 'Salary not disclosed';
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
    >
      <div className="flex items-start gap-4">
        {showCompany && job.company?.logo ? (
          <img
            src={job.company.logo}
            alt={job.company.companyName}
            className="w-14 h-14 rounded-lg object-cover border border-slate-200"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
            <Building2 className="w-6 h-6 text-slate-400" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-800 hover:text-blue-600 transition line-clamp-1">
                {job.title}
              </h3>
              {showCompany && (
                <p className="text-sm text-slate-500 mt-0.5">{job.company?.companyName}</p>
              )}
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {formatTimeAgo(job.createdAt)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.jobType}
            </span>
            {job.experience && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.experience}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <DollarSign className="w-4 h-4" />
              {formatSalary()}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
              {job.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
