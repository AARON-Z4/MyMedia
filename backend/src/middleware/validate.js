const { body, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }
  next();
};

const validId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  return true;
};

const projectRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').optional().trim(),
  handle,
];

const taskRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  handle,
];

const taskUpdateRules = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  handle,
];

module.exports = { projectRules, taskRules, taskUpdateRules, validId };
