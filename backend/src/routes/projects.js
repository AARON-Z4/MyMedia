const router = require('express').Router();
const projects = require('../controllers/projects');
const tasks = require('../controllers/tasks');
const { projectRules, taskRules, taskUpdateRules } = require('../middleware/validate');

router.get('/', projects.list);
router.post('/', projectRules, projects.create);
router.get('/:id', projects.getOne);
router.delete('/:id', projects.remove);

// task sub-routes
router.get('/:project_id/tasks', tasks.list);
router.post('/:project_id/tasks', taskRules, tasks.create);

module.exports = router;
