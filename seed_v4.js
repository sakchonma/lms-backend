const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db';

const Pathway = require('./src/models/Pathway');
const Course = require('./src/models/Course');

const seed = async () => {
    try {
        console.log('Connecting to:', dbUrl);
        await mongoose.connect(dbUrl);
        console.log('✅ Connected to MongoDB');

        // ฟังก์ชันสร้างคอร์สจำลองตามประเภท
        const createItem = async (title, code, type = 'Course') => {
            return await Course.create({
                courseCode: code + '-' + Math.floor(Math.random() * 10000),
                title: `[${type}] ${title}`,
                description: `รายละเอียดของ ${title} ประเภท ${type}`,
                level: 'Intermediate',
                status: 'publish'
            });
        };

        console.log('--- Cleaning old pathways and creating new ones ---');
        await Pathway.deleteMany({}); // ล้างข้อมูลเก่าออกก่อนเพื่อให้ไม่สับสน

        // --- 1. Data Science & AI Expert ---
        console.log('Creating Pathway 1...');
        const ds1 = await createItem('Python for Data Science', 'AI');
        const ds2 = await createItem('Intro to Machine Learning', 'AI');
        const ds3 = await createItem('Final Exam: AI Expert', 'AI');
        
        await Pathway.create({
            pathwayCode: 'PW-AI-2026',
            title: 'เส้นทางสู่ผู้เชี่ยวชาญด้าน Data Science & AI',
            description: 'รวมหลักสูตรและสื่อการเรียนรู้ที่จำเป็นสำหรับการเป็น Data Scientist ตั้งแต่พื้นฐานจนถึงระดับสูง',
            level: 'Intermediate',
            category: 'Data & AI',
            adminContact: 'data.expert@conicle.com',
            tags: ['AI', 'Python', 'Data'],
            isMandatory: true,
            image: 'https://images.unsplash.com/photo-1551288049-bbbda536ad31?w=800',
            durationSettings: { type: 'Days', numberOfDays: 90 },
            sections: [{
                title: 'Phase 1: Foundations',
                duration: 30,
                items: [
                    { itemType: 'Course', refId: ds1._id, isMandatory: true, order: 1 },
                    { itemType: 'Course', refId: ds2._id, isMandatory: true, order: 2 },
                    { itemType: 'Course', refId: ds3._id, isMandatory: true, order: 3 }
                ]
            }],
            enrollmentSettings: { quota: 50, approvalRequired: true },
            publishSettings: { mode: 'Published' },
            status: 'publish'
        });

        // --- 2. Digital Marketing Mastery ---
        console.log('Creating Pathway 2...');
        const dm1 = await createItem('Performance Marketing Mastery', 'MKT');
        const dm2 = await createItem('Social Media Strategy', 'MKT');
        
        await Pathway.create({
            pathwayCode: 'PW-MKT-2026',
            title: 'การตลาดดิจิทัลและการสร้างแบรนด์สมัยใหม่',
            description: 'สร้างแบรนด์ให้แข็งแกร่งและเข้าถึงกลุ่มเป้าหมายในยุคดิจิทัล',
            level: 'Beginner',
            category: 'Marketing',
            adminContact: 'mkt.team@conicle.com',
            tags: ['Marketing', 'Branding'],
            durationSettings: { type: 'Fixed', startDate: new Date('2026-04-01'), endDate: new Date('2026-06-30') },
            sections: [{
                title: 'Marketing Strategy & Execution',
                durationType: 'Fixed',
                startDate: new Date('2026-04-01'),
                endDate: new Date('2026-06-30'),
                items: [
                    { itemType: 'Course', refId: dm1._id, isMandatory: true, order: 1 },
                    { itemType: 'Course', refId: dm2._id, isMandatory: true, order: 2 }
                ]
            }],
            enrollmentSettings: { allowReEnrollment: true },
            publishSettings: { mode: 'Published' },
            status: 'publish'
        });

        // --- 3. Executive Leadership ---
        console.log('Creating Pathway 3...');
        const lead1 = await createItem('Strategic Leadership', 'LEAD');
        const lead2 = await createItem('Team Synergy Workshop', 'LEAD');
        
        await Pathway.create({
            pathwayCode: 'PW-LEAD-2026',
            title: 'ทักษะผู้นำและการจัดการทีมประสิทธิภาพสูง',
            description: 'ยกระดับทักษะการบริหารคนสำหรับผู้บริหารระดับสูง',
            level: 'Advanced',
            category: 'Management',
            isMandatory: true,
            adminContact: 'hr.leader@conicle.com',
            durationSettings: { type: 'Days', numberOfDays: 45 },
            sections: [{
                title: 'Leadership Skills',
                duration: 45,
                items: [
                    { itemType: 'Course', refId: lead1._id, isMandatory: true, order: 1 },
                    { itemType: 'Course', refId: lead2._id, isMandatory: false, order: 2 }
                ]
            }],
            publishSettings: { mode: 'Published' },
            status: 'publish'
        });

        // --- 4. Full-Stack Developer ---
        console.log('Creating Pathway 4...');
        const fs1 = await createItem('React for Enterprise', 'DEV');
        const fs2 = await createItem('Node.js Backend System', 'DEV');
        
        await Pathway.create({
            pathwayCode: 'PW-DEV-2026',
            title: 'เส้นทางนักพัฒนา Full-Stack Developer',
            description: 'เรียนรู้การสร้าง Web Application ตั้งแต่ต้นจนจบด้วย MERN Stack',
            level: 'Intermediate',
            category: 'Development',
            adminContact: 'dev.academy@conicle.com',
            tags: ['Web', 'JavaScript'],
            durationSettings: { type: 'Days', numberOfDays: 120 },
            sections: [{
                title: 'Web Development Journey',
                duration: 120,
                items: [
                    { itemType: 'Course', refId: fs1._id, isMandatory: true, order: 1 },
                    { itemType: 'Course', refId: fs2._id, isMandatory: true, order: 2 }
                ]
            }],
            publishSettings: { mode: 'Published' },
            status: 'publish'
        });

        // --- 5. Cyber Security ---
        console.log('Creating Pathway 5...');
        const sec1 = await createItem('Ethical Hacking 101', 'SEC');
        const sec2 = await createItem('Cloud Security Defense', 'SEC');
        
        await Pathway.create({
            pathwayCode: 'PW-SEC-2026',
            title: 'การป้องกันภัยคุกคามไซเบอร์ระดับองค์กร',
            description: 'เรียนรู้เทคนิคการป้องกันและรับมือการโจมตีทางไซเบอร์ทุกรูปแบบ',
            level: 'Advanced',
            category: 'Security',
            isMandatory: true,
            adminContact: 'soc.help@conicle.com',
            tags: ['Security', 'Cyber'],
            durationSettings: { type: 'Days', numberOfDays: 60 },
            sections: [{
                title: 'Security Operations',
                duration: 60,
                items: [
                    { itemType: 'Course', refId: sec1._id, isMandatory: true, order: 1 },
                    { itemType: 'Course', refId: sec2._id, isMandatory: true, order: 2 }
                ]
            }],
            publishSettings: { mode: 'Published' },
            status: 'publish'
        });

        console.log('✅ 5 Detailed Pathways with Courses created successfully!');
        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

seed();
