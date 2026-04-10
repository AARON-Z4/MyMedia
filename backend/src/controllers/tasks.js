const Task = require('../models/task');
const Project = require('../models/project');

const list = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const { status, sort, page = 1, limit = 20 } = req.query;

    const query = { project_id };
    if (status) query.status = status;

    const sortObj = sort === 'due_date' ? { due_date: 1 } : { created_at: -1 };

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(100, parseInt(limit));

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)),
      Task.countDocuments(query),
    ]);

    res.json({
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.project_id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const task = await Task.create({ ...req.body, project_id: req.params.project_id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, update, remove };
