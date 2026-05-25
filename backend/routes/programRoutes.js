const { Router } = require('express');
const {
  listPlans,
  getPlanDetail,
  createPlan,
  addPlanStep,
  deletePlan,
} = require('../controllers/programController');

const asyncHandler = require('../middleware/asyncHandler');

const router = Router();

router.get('/',          asyncHandler(listPlans));
router.get('/:id',       asyncHandler(getPlanDetail));
router.post('/',         asyncHandler(createPlan));
router.post('/:id/steps', asyncHandler(addPlanStep));
router.delete('/:id',   asyncHandler(deletePlan));

module.exports = router;