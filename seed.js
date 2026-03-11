const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./src/models/Course');
const Class = require('./src/models/Class');
const Pathway = require('./src/models/Pathway');
const Section = require('./src/models/Section');
const Lesson = require('./src/models/Lesson');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms-project');
        console.log('Connected to MongoDB for seeding...');

        // ล้างข้อมูลเก่า (Optional - ถ้าต้องการล้างให้เอา comment ออก)
        // await Course.deleteMany(); await Class.deleteMany(); await Pathway.deleteMany();

        console.log('Creating Courses...');
        const courses = await Course.insertMany([
            { 
                title: 'Node.js Foundation', 
                description: 'เรียนรู้พื้นฐาน Node.js และ Express สำหรับสร้าง API', 
                status: 'publish',
                image: 'https://images.unsplash.com/photo-1533709752211-118fcaf03314?w=500'
            },
            { 
                title: 'React Modern Web', 
                description: 'การสร้างหน้าเว็บด้วย React Hooks และ State Management', 
                status: 'publish',
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500'
            },
            { 
                title: 'Fullstack Deployment', 
                description: 'การนำโปรเจคขึ้น Cloud และการจัดการ Database ขั้นสูง', 
                status: 'publish',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500'
            }
        ]);

        console.log('Creating Classes...');
        await Class.insertMany([
            { title: 'Batch 1 - Morning', course: courses[0]._id, schedule: 'Mon-Wed 09:00 - 12:00' },
            { title: 'Batch 2 - Evening', course: courses[1]._id, schedule: 'Tue-Thu 18:00 - 21:00' },
            { title: 'Fast Track Summer', course: courses[2]._id, schedule: 'Sat-Sun 10:00 - 16:00' }
        ]);

        console.log('Creating Pathways...');
        await Pathway.insertMany([
            {
                title: 'Professional Web Developer',
                description: 'เส้นทางสู่การเป็นมืออาชีพ เรียนต่อกัน 3 คอร์ส',
                courses: [
                    { courseId: courses[0]._id, order: 1 },
                    { courseId: courses[1]._id, order: 2 },
                    { courseId: courses[2]._id, order: 3 }
                ]
            },
            {
                title: 'Frontend Specialist',
                description: 'เน้นด้านหน้าบ้านโดยเฉพาะ',
                courses: [
                    { courseId: courses[1]._id, order: 1 }
                ]
            },
            {
                title: 'Backend Roadmap',
                description: 'เจาะลึกระบบหลังบ้านและการวางโครงสร้าง',
                courses: [
                    { courseId: courses[0]._id, order: 1 },
                    { courseId: courses[2]._id, order: 2 }
                ]
            }
        ]);

        console.log('Seeding Completed Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
