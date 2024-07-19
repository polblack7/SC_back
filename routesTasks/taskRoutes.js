// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../modelsTasks/Task');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const taskSchema = require('../modelsTasks/Task');

const { ObjectId } = require("mongodb");




// Маршрут для создания задачи
router.post('/create', authMiddleware, async (req, res) => {
  const { description, dueDate } = req.body;
  const userId = req.user.id;
  const taskId = new mongoose.Types.ObjectId(); // создаем уникальный ID для задачи

  if (!description || !dueDate) {
    return res.status(400).json({ message: 'Описание и дата выполнения обязательны' });
  }

  try {
    const newTask = new Task({
      description,
      userId,
      taskId,
      dueDate
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании задачи', error });
  }
});

router.put('/update/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { description, dueDate } = req.body;
  const userId = req.user.id;

  console.log(`User ${userId} is attempting to update task ${id}`);

  try {
    const task = await Task.findOne({ taskId: id, userId });

    if (!task) {
      console.log(`Task ${id} not found for user ${userId}`);
      return res.status(404).json({ message: 'Task not found' });
    }

    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    console.log(`Task ${id} updated successfully`);
    res.status(200).json(task);
  } catch (error) {
    console.log('Error updating task', error);
    res.status(500).json({ message: 'Error updating task', error });
  }
});

router.delete("/delete/:id", async (req, res) => {
 
  const _id = new ObjectId(req.params.id);
  const Test = mongoose.model('Task', taskSchema.taskSchema);

  const deletedTodo = await Test.deleteOne({ _id });

  res.status(200).json(deletedTodo);
});

router.get('/all', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});




module.exports = router;