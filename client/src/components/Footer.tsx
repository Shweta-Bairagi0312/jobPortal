import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">JobPortal</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Connecting talented professionals with their dream careers. Your next opportunity awaits.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-500 transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-500 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-500 transition">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-blue-500 transition">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-blue-500 transition">Companies</Link></li>
              <li><Link to="/register" className="hover:text-blue-500 transition">Create Account</Link></li>
              <li><Link to="/about" className="hover:text-blue-500 transition">Career Resources</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-blue-500 transition">Post a Job</Link></li>
              <li><Link to="/register" className="hover:text-blue-500 transition">Create Company Profile</Link></li>
              <li><Link to="/about" className="hover:text-blue-500 transition">Pricing</Link></li>
              <li><Link to="/about" className="hover:text-blue-500 transition">Recruiting Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>support@jobportal.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/about" className="hover:text-blue-500 transition">Privacy Policy</Link>
            <Link to="/about" className="hover:text-blue-500 transition">Terms of Service</Link>
            <Link to="/about" className="hover:text-blue-500 transition">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
