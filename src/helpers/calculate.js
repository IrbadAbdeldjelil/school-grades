function calculate(grades) {
    const { islamic, arabic, math, science, civic, french, sport, art, conduct } = grades;

    const total = islamic + arabic + math + science + civic + french + sport + art + conduct;
    const average = +(total / 13).toFixed(2);
    const result = average >= 5 ? 'نجاح' : 'رسوب';

    let mention = '';
    if (average >= 9)      mention = 'ممتاز';
    else if (average >= 8) mention = 'جيد جداً';
    else if (average >= 7) mention = 'جيد';
    else if (average >= 6) mention = 'حسن';
    else if (average >= 5) mention = 'مقبول';
    else                   mention = 'ضعيف';

    return { total, average, result, mention };
}

module.exports = { calculate };