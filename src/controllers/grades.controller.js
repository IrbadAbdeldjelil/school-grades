const { z }  = require('zod');
const Grade = require('../models/grade.model');
const { calculate } = require('../helpers/calculate');
const { gradeSchema } = require('../helpers/validation');
const { generateCertificates } = require('../helpers/generate');

const createGrade = async (req, res, next) => {
    try {
	     const parsed = gradeSchema.safeParse(req.body);
       if (!parsed.success) return res.status(400).json({
            success: false,
            message: parsed.error.message
        });
        const {
            name,
            gender,
            semester,
            academicYear,
            grades
        } = parsed.data;

        // حساب النتيجة
        const { total, average, result, mention } = calculate(grades);

        // حفظ في DB
        const grade = await Grade.create({
            name,
            gender,
            semester,
            academicYear,
            islamic:  grades.islamic,
            arabic:   grades.arabic,
            math:     grades.math,
            science:  grades.science,
            civic:    grades.civic,
            french:   grades.french,
            sport:    grades.sport,
            art:      grades.art,
            conduct:  grades.conduct,
            total,
            average,
            result,
            mention
        });

        res.status(201).json({
            success: true,
            message: 'تم حفظ الدرجات بنجاح',
            data: { id: grade.id }
        });

    } catch (error) {
        next(error);
    }
};

const getAllGrades = async (req, res, next) => {
    try {
        const grades = await Grade.findAll({
            order: [['average', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: grades
        });

    } catch (error) {
        next(error);
    }
};

const getGrade = async (req, res, next) => {
    try {
      const { id } = req.params;
        
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) return res.status(400).json({
            success: false,
            message: 'معرف غير صالح'
        });

        const grade = await Grade.findByPk(id);
        if (!grade) return res.status(404).json({
            success: false,
            message: 'الطالب غير موجود'
        });

        res.status(200).json({
            success: true,
            data: grade
        });

    } catch (error) {
        next(error);
    }
};

const calculateRanks = async (req, res, next) => {
    try {
        const rankSchema = z.object({
            semester:     z.enum(['الاولى', 'الثانية', 'الاخيرة']),
            academicYear: z.string().regex(/^\d{4}-\d{4}$/, 'مثال: 2025-2026')
        });

        const parsed = rankSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({
            success: false,
            message: parsed.error.errors[0].message
        });

        const { semester, academicYear } = parsed.data;

        const grades = await Grade.findAll({
            where: { semester, academicYear },
            order: [['average', 'DESC']]
        });

        let rank = 1;
        for (let i = 0; i < grades.length; i++) {
            // إذا كان المعدل مختلفاً عن السابق — غيّر الترتيب
            if (i > 0 && grades[i].average < grades[i - 1].average) {
                rank = i + 1;
            }
            await grades[i].update({ rank });
        }

        res.status(200).json({
            success: true,
            message: `تم حساب ترتيب ${grades.length} طالب`
        });

    } catch (error) {
        next(error);
    }
};


const generateCertificatesHandler = async (req, res, next) => {
    try {
        const certSchema = z.object({
            semester:     z.enum(['الاولى', 'الثانية', 'الاخيرة']),
            academicYear: z.string().regex(/^\d{4}-\d{4}$/),
            issueDate:    z.string().min(1)
        });

        const parsed = certSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({
            success: false,
            message: parsed.error.errors[0].message
        });

        const { semester, academicYear, issueDate } = parsed.data;

        const grades = await Grade.findAll({
            where: { semester, academicYear },
            order: [['rank', 'ASC']]
        });

        if (!grades.length) return res.status(404).json({
            success: false,
            message: 'لا يوجد طلاب في هذه الفترة'
        });

        const doc = generateCertificates(
            grades.map(g => g.dataValues),
            issueDate
        );

        const buffer = await Packer.toBuffer(doc);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=certificates.docx`);
        res.send(buffer);

    } catch (error) {
        next(error);
    }
};

module.exports = { createGrade, getAllGrades, getGrade, calculateRanks, generateCertificatesHandler };