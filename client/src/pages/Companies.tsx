import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Search, ChevronRight } from 'lucide-react';
import { Company } from '../types';
import { companyAPI } from '../utils/api';

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, [search]);

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getAll({ search, limit: 20 });
      setCompanies(response.data.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Explore Companies</h1>
          <p className="text-slate-500 mb-6">Find and connect with top companies hiring now</p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="w-16 h-16 bg-slate-200 rounded-lg mx-auto mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-medium text-slate-800">No companies found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Link
                key={company._id}
                to={`/companies/${company._id}`}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-start gap-4">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.companyName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">{company.companyName}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {company.location}
                    </p>
                    {company.industry && (
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs mt-2">
                        {company.industry}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-4 line-clamp-2">{company.description}</p>
                <div className="flex items-center justify-end mt-4 text-blue-600 text-sm font-medium">
                  View Profile <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
