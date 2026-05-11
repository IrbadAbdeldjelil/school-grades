require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/db.config');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ قاعدة البيانات متصلة');

        await sequelize.sync({ alter: true });
        console.log('✅ الجداول جاهزة');

        app.listen(PORT, () => {
            console.log(`🚀 السيرفر يعمل على http://${HOST}:${PORT}`);
        });

    } catch (error) {
        console.error('❌ خطأ:', error.message);
        process.exit(1);
    }
};

start();