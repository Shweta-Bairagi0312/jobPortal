import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Building2, Users, TrendingUp, Search, MapPin, ChevronRight } from 'lucide-react';
import JobCard from '../components/JobCard';
import { Job, Company } from '../types';
import { jobAPI, companyAPI } from '../utils/api';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes, jobStatsRes] = await Promise.all([
          jobAPI.getFeatured(),
          companyAPI.getAll({ limit: 4 }),
          jobAPI.getStats()
        ]);
        setFeaturedJobs(jobsRes.data.data);
        setTopCompanies(companiesRes.data.data);
        setStats({
          totalJobs: jobStatsRes.data.data.activeJobs,
          totalCompanies: 0,
          totalUsers: 0
        });
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (locationQuery) params.append('location', locationQuery);
    window.location.href = `/jobs?${params.toString()}`;
  };

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer at Google',
      content: 'JobPortal helped me land my dream job at a top tech company. The platform made it easy to find relevant opportunities and connect with recruiters.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager at Microsoft',
      content: 'The personalized job recommendations and easy application process saved me hours of time. Highly recommend for anyone job hunting.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      name: 'Emily Davis',
      role: 'UX Designer at Apple',
      content: 'Found multiple great opportunities within days of signing up. The interface is intuitive and the job quality is excellent.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream Job<br />
              <span className="text-blue-200">Start Your Career Journey</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Connect with top employers and discover opportunities that match your skills and aspirations.
            </p>

            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-slate-200">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Job title, keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="flex-1 text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  Search
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-blue-200">
              <span>Popular:</span>
              <Link to="/jobs?search=Software+Engineer" className="hover:text-white transition">Software Engineer</Link>
              <Link to="/jobs?search=Product+Manager" className="hover:text-white transition">Product Manager</Link>
              <Link to="/jobs?search=UX+Designer" className="hover:text-white transition">UX Designer</Link>
              <Link to="/jobs?search=Data+Analyst" className="hover:text-white transition">Data Analyst</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{stats.totalJobs.toLocaleString()}+</h3>
              <p className="text-slate-500 mt-1">Active Jobs</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{stats.totalCompanies.toLocaleString()}+</h3>
              <p className="text-slate-500 mt-1">Companies</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">10K+</h3>
              <p className="text-slate-500 mt-1">Job Seekers</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">5K+</h3>
              <p className="text-slate-500 mt-1">Successful Hires</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Featured Jobs</h2>
            <Link
              to="/jobs"
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 4, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Top Companies</h2>
            <Link
              to="/companies"
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {topCompanies.map((company) => (
              <Link
                key={company._id}
                to={`/companies/${company._id}`}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all text-center"
              >
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.companyName}
                    className="w-16 h-16 rounded-lg object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                )}
                <h3 className="font-semibold text-slate-800">{company.companyName}</h3>
                <p className="text-sm text-slate-500 mt-1">{company.industry}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Join thousands of professionals who found their dream jobs through JobPortal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6">
                <p className="text-slate-300 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Start Your Journey?</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Create your account today and take the first step towards your dream career.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
