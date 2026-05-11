const { z } = require('zod');

const gradeSchema = z.object({
    name:         z.string().min(1, 'اسم الطالب مطلوب'),
    gender:       z.enum(['male', 'female']),
    semester:     z.enum(['الاولى', 'الثانية', 'الاخيرة']),
    academicYear: z.string().regex(/^\d{4}-\d{4}$/, 'مثال: 2025-2026'),
    grades: z.object({
        islamic:  z.number().min(0).max(30),
        arabic:   z.number().min(0).max(20),
        math:     z.number().min(0).max(20),
        science:  z.number().min(0).max(10),
        civic:    z.number().min(0).max(10),
        french:   z.number().min(0).max(10),
        sport:    z.number().min(0).max(10),
        art:      z.number().min(0).max(10),
        conduct:  z.number().min(0).max(10),
    })
});

module.exports = { gradeSchema };