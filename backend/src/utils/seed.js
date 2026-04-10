require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/project');
const Task = require('../models/task');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project_mgmt');

  await Project.deleteMany({});
  await Task.deleteMany({});

  const projects = await Project.insertMany([
    { name: 'Website Redesign', description: 'Redesign company website with new brand guidelines' },
    { name: 'Mobile App v2', description: 'Build iOS/Android app for the platform' },
    { name: 'API Integration', description: 'Integrate third-party payment and analytics APIs' },
  ]);

  const statuses = ['todo', 'in-progress', 'done'];
  const priorities = ['low', 'medium', 'high'];

  const tasks = [];
  for (const project of projects) {
    tasks.push(
      { project_id: project._id, title: 'Setup project structure', status: 'done', priority: 'high', due_date: new Date('2025-01-10') },
      { project_id: project._id, title: 'Write technical spec', status: 'in-progress', priority: 'medium', due_date: new Date('2025-02-15') },
      { project_id: project._id, title: 'Implement core features', status: 'todo', priority: 'high', due_date: new Date('2025-03-01') },
      { project_id: project._id, title: 'Code review & QA', status: 'todo', priority: 'medium', due_date: new Date('2025-03-20') },
      { project_id: project._id, title: 'Deploy to production', status: 'todo', priority: 'low', due_date: new Date('2025-04-01') },
    );
  }

  await Task.insertMany(tasks);
  console.log('Seed complete');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
