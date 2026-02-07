const Task = require("../models/Task");

// GET all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE task
exports.createTask = async (req, res) => {
  try {
    const newTask = new Task({ title: req.body.title });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE task (mark as completed)
exports.updateTaskText = async (req, res) => {
  try {
    const { title } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
