const Program = require('../models/Program');

async function listPlans(req, res) {
  const { difficulty } = req.query;
  const plans = await Program.findAll({ difficulty });
  return res.json({ plans });
}

async function getPlanDetail(req, res) {
  const plan = await Program.findById(req.params.id);
  if (!plan) return res.status(404).json({ message: 'Plan not found.' });
  return res.json({ plan });
}

async function createPlan(req, res) {
  const { title, difficulty, duration_min, calories_est, description, image_url } = req.body;

  if (!title || !difficulty || !duration_min || !calories_est) {
    return res.status(400).json({ message: 'title, difficulty, duration_min and calories_est are required.' });
  }

  const plan = await Program.create({ title, difficulty, duration_min, calories_est, description, image_url });
  return res.status(201).json({ plan });
}

async function addPlanStep(req, res) {
  const { step_order, name, duration_label, sets_label, exercise_id } = req.body;

  if (!step_order || !name) {
    return res.status(400).json({ message: 'step_order and name are required.' });
  }

  const step = await Program.addStep(req.params.id, { step_order, name, duration_label, sets_label, exercise_id });
  return res.status(201).json({ step });
}

async function deletePlan(req, res) {
  await Program.remove(req.params.id);
  return res.status(204).end();
}

module.exports = { listPlans, getPlanDetail, createPlan, addPlanStep, deletePlan };