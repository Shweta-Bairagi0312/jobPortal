import Company from '../models/Company.js';
import Job from '../models/Job.js';

export const createCompany = async (req, res) => {
  try {
    const { companyName, description, website, location, industry, companySize, foundedYear } = req.body;

    const existingCompany = await Company.findOne({ owner: req.user._id });
    if (existingCompany) {
      return res.status(400).json({ message: 'You already have a company profile' });
    }

    const companyData = {
      companyName,
      description,
      website,
      location,
      industry,
      companySize,
      foundedYear,
      owner: req.user._id
    };

    if (req.file) {
      companyData.logo = `/uploads/${req.file.filename}`;
    }

    const company = await Company.create(companyData);

    await req.user.updateOne({ company: company._id });

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('owner', 'name email');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      company._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedCompany });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    const companies = await Company.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Company.countDocuments(query);

    res.json({
      success: true,
      data: companies,
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

export const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.params.id, isActive: true })
      .populate('company', 'companyName logo location')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompanyStats = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const totalJobs = await Job.countDocuments({ company: company._id });
    const activeJobs = await Job.countDocuments({ company: company._id, isActive: true });
    const totalApplications = await Job.aggregate([
      { $match: { company: company._id } },
      { $group: { _id: null, total: { $sum: { $size: '$applicants' } } } }
    ]);

    res.json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        totalApplications: totalApplications[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
