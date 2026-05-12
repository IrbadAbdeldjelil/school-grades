const { z }  = require('zod');
const { Packer} = require('docx');
const Grade = require('../models/grade.model');
const { calculate, calculateRanks } = require('../helpers/calculate');
const { gradeSchema, certSchema } = require('../helpers/validation');
const { generateCertificates } = require('../helpers/generate');

const createGrade = async (req, res, next) => {
    
	     const parsed = gradeSchema.safeParse(req.body);
       if (!parsed.success) return next(parsed.error);

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
        
        //console.log(grade);
        
        res.status(201).json({
            success: true,
            message: 'تم حفظ الدرجات بنجاح',
            data: { id: grade.id }
        });

};

const getAllGrades = async (req, res, next) => {
    
        const grades = await Grade.findAll({
            order: [['average', 'DESC']]
        });

        res.status(200).json({
            success: true,
            message: 'جميع درجات الطلاب',
            data: grades
        });

};

const getGrade = async (req, res, next) => {

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
            message: 'تم ايجاد الطالب بنجاح',
            data: grade
        });

};


const generateCertificatesHandler = async (req, res, next) => {
       
        const parsed = certSchema.safeParse(req.body);
        if (!parsed.success) return next(parsed.error);
         
        const { semester, academicYear, issueDate } = parsed.data;
        await calculateRanks(Grade, semester, academicYear);
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

    };

module.exports = { createGrade, getAllGrades, getGrade, calculateRanks, generateCertificatesHandler };