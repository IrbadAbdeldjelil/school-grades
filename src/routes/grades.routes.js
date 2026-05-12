const { Router } = require('express');
const { createGrade, getAllGrades, getGrade, calculateRanks, generateCertificatesHandler } = require('../controllers/grades.controller');

const router = Router();

router.post('/',     createGrade);
router.get('/',      getAllGrades);
router.get('/:id',   getGrade);
router.post('/certificates', calculateRanks, generateCertificatesHandler);

module.exports = router;