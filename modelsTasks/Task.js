// models/Task.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: String,
    required: true,
    unique: true
  },
  dueDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Task', taskSchema);