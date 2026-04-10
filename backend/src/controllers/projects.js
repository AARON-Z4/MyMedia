const Project = require('../models/project');
const Task = require('../models/task');

const list = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find().sort({ created_at: -1 }).skip(skip).limit(limit),
      Project.countDocuments(),
    ]);

    res.json({
      data: projects,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ name, description });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // clean up tasks
    await Task.deleteMany({ project_id: req.params.id });

    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, getOne, remove };
