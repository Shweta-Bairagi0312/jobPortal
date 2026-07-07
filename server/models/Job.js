import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 5000 },
  requirements: [{ type: String }],
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' }
  },
  location: { type: String, required: true },
  category: { type: String, required: true, enum: [
    'Technology', 'Healthcare', 'Finance', 'Marketing', 'Sales',
    'Design', 'Education', 'Engineering', 'Human Resources', 'Operations',
    'Customer Service', 'Legal', 'Media', 'Other'
  ]},
  experience: { type: String, enum: ['Entry Level', '1-2 years', '3-5 years', '5-10 years', '10+ years'] },
  jobType: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'] },
  skills: [{ type: String }],
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  isActive: { type: Boolean, default: true },
  deadline: { type: Date },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

jobSchema.index({ title: 'text', description: 'text', location: 'text' });

export default mongoose.model('Job', jobSchema);
