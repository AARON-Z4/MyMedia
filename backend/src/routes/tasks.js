const router = require('express').Router();
const tasks = require('../controllers/tasks');
const { taskUpdateRules } = require('../middleware/validate');

router.put('/:id', taskUpdateRules, tasks.update);
router.delete('/:id', tasks.remove);

module.exports = router;
