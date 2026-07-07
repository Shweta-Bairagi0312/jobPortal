import SavedJob from '../models/SavedJob.js';
import Job from '../models/Job.js';

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingSave = await SavedJob.findOne({
      user: req.user._id,
      job: jobId
    });

    if (existingSave) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const savedJob = await SavedJob.create({
      user: req.user._id,
      job: jobId
    });

    res.status(201).json({ success: true, data: savedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      user: req.user._id,
      job: req.params.jobId
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.json({ success: true, message: 'Job removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'companyName logo location' }
      })
      .sort({ createdAt: -1 });

    const validSavedJobs = savedJobs.filter(sj => sj.job);

    res.json({ success: true, data: validSavedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkIfSaved = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      user: req.user._id,
      job: req.params.jobId
    });

    res.json({ success: true, isSaved: !!savedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
