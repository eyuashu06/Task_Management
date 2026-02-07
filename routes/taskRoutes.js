const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');

router.get("/:id", controller.getTaskById);

router.get('/', controller.getTasks);
router.post('/', controller.createTask);
router.put('/:id/edit', controller.updateTaskText);
router.delete('/:id', controller.deleteTask);

module.exports = router;
