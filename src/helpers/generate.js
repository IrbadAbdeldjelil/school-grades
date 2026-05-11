const { Document, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, PageBreak } = require('docx');

function generateCertificates(students, issueDate) {
    const sections = [];

    students.forEach((student, index) => {
        const isMale = student.gender === 'male';
        const note = isMale
            ? 'حسن السير والسلوك مواظب على دروسه نتمنى له النجاح'
            : 'حسنة السير والسلوك مواظبة على دروسها نتمنى لها النجاح';

        const children = [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'كشف الدرجات', bold: true, size: 40 })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'مدرسة الشيخ جلته العربية', size: 28 })]
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
                children: [new TextRun({ text: `اسم الطالب: ${student.name}` })]
            }),
            new Paragraph({
                children: [new TextRun({ text: `الفترة: ${student.semester}  |  العام الدراسي: ${student.academicYear}` })]
            }),
            new Paragraph({ text: '' }),

            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    headerRow(),
                    row('التربية الإسلامية', 30, student.islamic),
                    row('اللغة العربية', 20, student.arabic),
                    row('الحساب', 20, student.math),
                    row('العلوم', 10, student.science),
                    row('التربية الوطنية', 10, student.civic),
                    row('اللغة الفرنسية', 10, student.french),
                    row('التربية البدنية', 10, student.sport),
                    row('الفنون', 10, student.art),
                    row('السلوك والمواطنية', 10, student.conduct),
                    row('المجموع', 130, student.total),
                ]
            }),

            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: `المعدل: ${student.average} / 10` })] }),
            new Paragraph({ children: [new TextRun({ text: `النتيجة: ${student.result}` })] }),
            new Paragraph({ children: [new TextRun({ text: `التقدير: ${student.mention}` })] }),
            new Paragraph({ children: [new TextRun({ text: `الترتيب: ${student.rank}` })] }),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: `ملاحظات المرشد: ${note}` })] }),
            new Paragraph({ children: [new TextRun({ text: `تاريخ الإصدار: ${issueDate}` })] }),
        ];

        // فاصل صفحة بعد كل طالب إلا الأخير
        if (index < students.length - 1) {
            children.push(new Paragraph({
                children: [new PageBreak()]
            }));
        }

        sections.push(...children);
    });

    return new Document({
        sections: [{ children: sections }]
    });
}

function headerRow() {
    return new TableRow({
        children: [
            cell('المادة', true),
            cell('الدرجة الكبرى', true),
            cell('درجة الطالب', true),
        ]
    });
}

function row(subject, max, score) {
    return new TableRow({
        children: [
            cell(subject),
            cell(String(max)),
            cell(String(score)),
        ]
    });
}

function cell(text, bold = false) {
    return new TableCell({
        children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text, bold })]
        })]
    });
}

module.exports = { generateCertificates };