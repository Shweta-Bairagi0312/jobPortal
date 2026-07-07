import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';

export const createJob = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });
    if (!company) {
      return res.status(400).json({ message: 'Please create a company profile first' });
    }

    const job = await Job.create({
      ...req.body,
      company: company._id,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      jobType,
      experience,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (experience) query.experience = experience;

    if (minSalary || maxSalary) {
      query['salary.min'] = minSalary ? { $gte: parseInt(minSalary) } : { $exists: true };
      query['salary.max'] = maxSalary ? { $lte: parseInt(maxSalary) } : { $exists: true };
    }

    const jobs = await Job.find(query)
      .populate('company', 'companyName logo location')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'companyName logo location description website industry companySize')
      .populate('createdBy', 'name');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const company = await Company.findOne({ owner: req.user._id });
    if (!company || job.company.toString() !== company._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('company', 'companyName logo location');

    res.json({ success: true, data: updatedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const company = await Company.findOne({ owner: req.user._id });
    if (req.user.role !== 'admin' && (!company || job.company.toString() !== company._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Application.deleteMany({ job: req.params.id });
    await Job.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployerJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const jobs = await Job.find({ company: company._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate('company', 'companyName logo location')
      .sort({ views: -1, createdAt: -1 })
      .limit(8);

    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });

    const categoryStats = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const locationStats = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        categoryStats,
        locationStats
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
