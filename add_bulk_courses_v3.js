const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./src/models/Course');
const Section = require('./src/models/Section');
const Lesson = require('./src/models/Lesson');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const youtubeVideos = [
    { title: 'Learn HTML in 15 Minutes', url: 'kUMe1FH4CHE' },
    { title: 'CSS Crash Course', url: 'qz0aGYrrlhU' },
    { title: 'JavaScript Full Course', url: 'W6NZfCO5SIk' },
    { title: 'React JS Tutorial', url: 'vLnPwxZdW4Y' },
    { title: 'Node.js Express Tutorial', url: '7S_tz1z_5bA' },
    { title: 'Python for Beginners', url: '_uQrJ0TkZlc' },
    { title: 'Docker Tutorial', url: 'pTFZFxd4hZ0' }
];

const courseTemplates = [
    { title: 'Advanced React Architecture', program: 'Software Engineering Pro', creator: 'TechMaster Academy', cat: 'Development', tags: ['React', 'Frontend', 'Architecture'] },
    { title: 'AI & Machine Learning with Python', program: 'Data Science Specialist', creator: 'DataGenius', cat: 'Data Science', tags: ['AI', 'Python', 'ML'] },
    { title: 'Cybersecurity: Ethical Hacking', program: 'Security Expert Path', creator: 'SafeNet Solutions', cat: 'Security', tags: ['Hacking', 'Security', 'Linux'] },
    { title: 'Digital Marketing Strategy 2026', program: 'Marketing Excellence', creator: 'MarketGrow', cat: 'Marketing', tags: ['SEO', 'Ads', 'Strategy'] },
    { title: 'Full Stack Web Development', program: 'Career Switch Bootcamp', creator: 'CodeBase', cat: 'Development', tags: ['MERN', 'Fullstack', 'Web'] },
    { title: 'UI/UX Design Masterclass', program: 'Creative Designer', creator: 'DesignFlow', cat: 'Design', tags: ['Figma', 'UI', 'UX'] },
    { title: 'Cloud Computing with AWS', program: 'Cloud Architect', creator: 'CloudNine', cat: 'IT Infrastructure', tags: ['AWS', 'Cloud', 'DevOps'] },
    { title: 'Business Data Analytics', program: 'Business Intelligence', creator: 'BizMetric', cat: 'Business', tags: ['Excel', 'PowerBI', 'Data'] },
    { title: 'Agile Project Management', program: 'Management Professional', creator: 'AgileWay', cat: 'Management', tags: ['Scrum', 'Agile', 'PM'] },
    { title: 'Introduction to Blockchain', program: 'Web3 Developer', creator: 'CryptoLabs', cat: 'Technology', tags: ['Web3', 'Blockchain', 'Crypto'] },
    { title: 'Java Programming Mastery', program: 'Enterprise Developer', creator: 'JavaTech', cat: 'Development', tags: ['Java', 'Backend', 'OOP'] },
    { title: 'Mobile App Dev with Flutter', program: 'App Developer', creator: 'Mobility', cat: 'Mobile', tags: ['Flutter', 'Dart', 'Mobile'] },
    { title: 'DevOps & CI/CD Pipeline', program: 'Cloud Architect', creator: 'OpsExpert', cat: 'DevOps', tags: ['Docker', 'Jenkins', 'Kubernetes'] },
    { title: 'Professional English for Business', program: 'Soft Skills', creator: 'GlobalTalk', cat: 'Language', tags: ['English', 'Business', 'Communication'] },
    { title: 'SQL & Database Design', program: 'Data Specialist', creator: 'DBMaster', cat: 'Data Science', tags: ['SQL', 'MySQL', 'Database'] },
    { title: 'Graphic Design for Beginners', program: 'Creative Designer', creator: 'ArtStudio', cat: 'Design', tags: ['Photoshop', 'Illustrator', 'Design'] },
    { title: 'Product Management 101', program: 'Management Professional', creator: 'ProdLife', cat: 'Management', tags: ['Product', 'Strategy', 'Agile'] },
    { title: 'Internet of Things (IoT) Basics', program: 'Hardware Engineer', creator: 'SmartConnect', cat: 'Technology', tags: ['IoT', 'Arduino', 'RaspberryPi'] },
    { title: 'C++ for High Performance', program: 'Systems Developer', creator: 'CoreSystems', cat: 'Development', tags: ['C++', 'Performance', 'Systems'] },
    { title: 'Sales & Negotiation Skills', program: 'Sales Master', creator: 'PeakPerformance', cat: 'Business', tags: ['Sales', 'Negotiation', 'Business'] }
];

const seedData = async () => {
    await connectDB();
    console.log('Clearing old bulk data if exists...');
    await Course.deleteMany({ courseCode: { $regex: /^CRS-FULL-/ } });

    console.log('Starting to seed 20 HIGH-DETAIL courses...');

    for (let i = 0; i < 20; i++) {
        const t = courseTemplates[i];
        const courseCode = `CRS-FULL-${1000 + i}`;

        const course = new Course({
            courseCode,
            title: t.title,
            learningProgram: t.program,
            instructor: `Expert Instructor ${i + 1}`,
            category: t.cat,
            contentCreator: t.creator,
            tags: t.tags,
            isMandatory: Math.random() > 0.7,
            description: `ยินดีต้อนรับสู่หลักสูตร ${t.title}. หลักสูตรนี้ออกแบบมาเพื่อพัฒนาทักษะระดับมืออาชีพในด้าน ${t.cat}.`,
            termsAndConditions: 'ผู้เรียนต้องทำแบบทดสอบให้ผ่านเกณฑ์ 80% เพื่อรับใบประกาศนียบัตร',
            adminContact: `admin.support@${t.creator.toLowerCase().replace(' ', '')}.com`,
            isTemplate: Math.random() > 0.8,
            price: [0, 1500, 2900, 4500, 9900][Math.floor(Math.random() * 5)],
            image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&idx=${i}`,
            status: 'publish',
            attachments: [
                { title: 'คู่มือการเรียนพื้นฐาน.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                { title: 'Source Code Project.zip', url: '#' }
            ],
            enrollmentSettings: {
                formType: 'Standard',
                period: {
                    status: 'Open',
                    start: new Date(),
                    end: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
                },
                quota: [20, 50, 100, 0][Math.floor(Math.random() * 4)],
                allowReEnrollAfterReject: true,
                approvalRequired: Math.random() > 0.5,
                allowCancellation: true
            },
            publishSettings: {
                mode: 'Immediate'
            }
        });

        await course.save();
        console.log(`[${i+1}/20] Created: ${course.title} (${course.isMandatory ? 'REQUIRED' : 'OPTIONAL'})`);

        // Create 2 Sections
        for (let s = 1; s <= 2; s++) {
            const section = new Section({
                courseId: course._id,
                title: `ส่วนที่ ${s}: ${s === 1 ? 'พื้นฐานและการติดตั้ง' : 'การประยุกต์ใช้งานขั้นสูง'}`,
                priority: s
            });
            await section.save();
            await Course.findByIdAndUpdate(course._id, { $push: { sections: section._id } });

            // Create 3 Lessons per Section
            for (let l = 1; l <= 3; l++) {
                const vid = youtubeVideos[Math.floor(Math.random() * youtubeVideos.length)];
                const lesson = new Lesson({
                    sectionId: section._id,
                    title: `${vid.title} - ตอนที่ ${l}`,
                    type: l === 1 ? 'YouTube' : (l === 2 ? 'Video' : 'Document'),
                    url: l === 1 ? vid.url : 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
                    content: `เนื้อหารายละเอียดของบทเรียนที่ ${l} ในส่วนที่ ${s}.`,
                    priority: l
                });
                await lesson.save();
                await Section.findByIdAndUpdate(section._id, { $push: { lessons: lesson._id } });
            }
        }
    }

    console.log('\nSUCCESS: 20 courses with full metadata generated!');
    mongoose.connection.close();
};

seedData();
