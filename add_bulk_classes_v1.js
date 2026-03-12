const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Class = require('./src/models/Class');

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

const classTemplates = [
    {
        title: 'AI Strategy for Executive Leaders',
        code: 'CLS-AI-801',
        program: 'Executive Leadership 2026',
        cat: 'Business & AI',
        creator: 'Future-Proof Academy',
        instructor: 'Dr. Sarah Connor',
        level: 'Intermediate',
        price: 15000,
        tags: ['AI', 'Strategy', 'Management'],
        rounds: [
            { title: 'รอบเช้า: AI Fundamentals', type: 'Class', location: 'Conicle Head Office', room: 'Room A', duration: 4 },
            { title: 'รอบบ่าย: Case Studies', type: 'Meeting', url: 'https://zoom.us/j/123456789', duration: 3 }
        ]
    },
    {
        title: 'Advanced React & Next.js Workshop',
        code: 'CLS-JS-902',
        program: 'Modern Web Stack',
        cat: 'Development',
        creator: 'CodeMaster Lab',
        instructor: 'John Dev',
        level: 'Advanced',
        price: 4500,
        tags: ['React', 'NextJS', 'Frontend'],
        rounds: [
            { title: 'Day 1: Performance Tuning', type: 'Class', location: 'Tech Hub Center', room: 'Lab 5', duration: 8 },
            { title: 'Day 2: Server Components', type: 'Class', location: 'Tech Hub Center', room: 'Lab 5', duration: 8 }
        ]
    },
    {
        title: 'Cybersecurity Awareness (Mandatory)',
        code: 'CLS-SEC-101',
        program: 'Compliance & Safety',
        cat: 'Security',
        creator: 'Internal Security Team',
        instructor: 'Mike Shield',
        level: 'Beginner',
        price: 0,
        isMandatory: true,
        tags: ['Security', 'Safety', 'Compliance'],
        rounds: [
            { title: 'Round 1: Phishing & Data Leak', type: 'Live', url: 'https://youtube.com/live/xyz', duration: 2 }
        ]
    },
    {
        title: 'Design Thinking for Innovation',
        code: 'CLS-DES-202',
        program: 'Innovation Mindset',
        cat: 'Design',
        creator: 'Creative Solutions',
        instructor: 'Alice Wonder',
        level: 'Beginner',
        price: 2900,
        tags: ['Design Thinking', 'UX', 'Innovation'],
        rounds: [
            { title: 'Workshop Part 1', type: 'Class', location: 'Innovation Hub', room: 'Creative Room', duration: 4 },
            { title: 'Workshop Part 2', type: 'Class', location: 'Innovation Hub', room: 'Creative Room', duration: 4 }
        ]
    },
    {
        title: 'Digital Marketing & Growth Hacking',
        code: 'CLS-MKT-303',
        program: 'Marketing Excellence',
        cat: 'Marketing',
        creator: 'GrowthForce',
        instructor: 'Mark Zuckerberg',
        level: 'Intermediate',
        price: 5900,
        tags: ['Marketing', 'Ads', 'Growth'],
        rounds: [
            { title: 'Session 1: Facebook Ads Mastery', type: 'Meeting', url: 'https://meet.google.com/abc-defg-hij', duration: 3 },
            { title: 'Session 2: Google SEO/SEM', type: 'Meeting', url: 'https://meet.google.com/abc-defg-hij', duration: 3 }
        ]
    },
    {
        title: 'Public Speaking & Presentation',
        code: 'CLS-SOFT-404',
        program: 'Communication Pro',
        cat: 'Soft Skills',
        creator: 'TalkMasters',
        instructor: 'Chris Anderson',
        level: 'Beginner',
        price: 3500,
        tags: ['Speaking', 'Soft Skills', 'Presentation'],
        rounds: [
            { title: 'Round 1: Confidence Building', type: 'Class', location: 'Learning Center', room: 'Theater', duration: 4 },
            { title: 'Round 2: Storytelling Techniques', type: 'Class', location: 'Learning Center', room: 'Theater', duration: 4 }
        ]
    },
    {
        title: 'Agile & Scrum Masterclass',
        code: 'CLS-PM-505',
        program: 'Project Management Pro',
        cat: 'Management',
        creator: 'AgileAlliance',
        instructor: 'Jeff Sutherland',
        level: 'Intermediate',
        price: 8900,
        tags: ['Agile', 'Scrum', 'Management'],
        rounds: [
            { title: 'Scrum Essentials', type: 'Class', location: 'BizPark Tower', room: 'Agile Lab', duration: 8 }
        ]
    },
    {
        title: 'Financial Planning for Employees',
        code: 'CLS-FIN-606',
        program: 'Wealth Management',
        cat: 'Finance',
        creator: 'MoneyWise',
        instructor: 'Warren Buffet',
        level: 'Beginner',
        price: 0,
        tags: ['Finance', 'Saving', 'Investment'],
        rounds: [
            { title: 'Basic Investing', type: 'Live', url: 'https://twitch.tv/moneywise', duration: 2 },
            { title: 'Retirement Planning', type: 'Live', url: 'https://twitch.tv/moneywise', duration: 2 }
        ]
    },
    {
        title: 'Cloud Architect with AWS & Azure',
        code: 'CLS-CLD-707',
        program: 'Cloud Specialist',
        cat: 'Infrastructure',
        creator: 'CloudNine',
        instructor: 'Jeff Bezos',
        level: 'Advanced',
        price: 12500,
        tags: ['AWS', 'Azure', 'Cloud'],
        rounds: [
            { title: 'AWS Solutions Architect', type: 'Class', location: 'Conicle Lab', room: 'Server Room B', duration: 6 },
            { title: 'Azure Fundamentals', type: 'Meeting', url: 'https://teams.microsoft.com/l/meetup-join/123', duration: 4 }
        ]
    },
    {
        title: 'Conflict Resolution in Workplace',
        code: 'CLS-HR-808',
        program: 'People Management',
        cat: 'Soft Skills',
        creator: 'HR Pros',
        instructor: 'Madeline Burnett',
        level: 'Intermediate',
        price: 1900,
        tags: ['HR', 'Management', 'Conflict'],
        rounds: [
            { title: 'Mediation Techniques', type: 'Class', location: 'Conicle HQ', room: 'Meeting Room 4', duration: 3 }
        ]
    }
];

const seedClasses = async () => {
    await connectDB();
    console.log('Clearing old bulk class data...');
    await Class.deleteMany({ classCode: { $regex: /^CLS-/ } });

    console.log('Starting to seed 10 HIGH-DETAIL class programs...');

    for (let i = 0; i < classTemplates.length; i++) {
        const t = classTemplates[i];
        
        const cls = new Class({
            classCode: t.code,
            title: t.title,
            description: `หลักสูตรระดับคุณภาพจาก ${t.creator}. หลักสูตรนี้มุ่งเน้นที่การปฏิบัติจริงและการมีปฏิสัมพันธ์ระหว่างผู้เรียนและผู้สอน.`,
            termsAndConditions: 'กรุณาเช็คอินก่อนเริ่มเรียนอย่างน้อย 15 นาที และเข้าร่วมไม่น้อยกว่า 80% ของเวลาเรียนทั้งหมด',
            level: t.level,
            learningProgram: t.program,
            category: t.cat,
            contentCreator: t.creator,
            instructor: t.instructor,
            tags: t.tags,
            isMandatory: t.isMandatory || false,
            image: `https://images.unsplash.com/photo-1524178232363-1fb28f74b671?w=800&q=80&idx=${i}`,
            price: t.price,
            adminContact: `support@${t.creator.toLowerCase().replace(' ', '')}.com`,
            isTemplate: i === 0,
            enrollmentLogic: 'Single',
            approvalMode: t.price > 0 ? 'Admin' : 'Automatic',
            
            checkInSettings: {
                mode: 'CheckInCheckOut',
                qrCodeType: 'Round',
                enabled: true
            },
            
            enrollmentSettings: {
                status: 'Open',
                quota: [30, 50, 0][Math.floor(Math.random() * 3)],
                approvalRequired: t.price > 0,
                allowReEnrollAfterReject: true,
                allowCancellation: true,
                autoCancelIfLowEnrollment: false
            },
            
            publishSettings: {
                mode: 'Immediate'
            },
            
            rounds: t.rounds.map((r, idx) => ({
                title: r.title,
                type: r.type,
                start: new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // Next day 9 AM
                end: new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000 + (9 + r.duration) * 60 * 60 * 1000),
                location: r.location || '',
                url: r.url || '',
                room: r.room || '',
                instructor: t.instructor,
                description: `รายละเอียดเจาะลึกสำหรับหัวข้อ: ${r.title}`
            })),
            
            attachments: [
                { title: 'แผนการเรียน.pdf', url: '#' },
                { title: 'เอกสารประกอบการบรรยาย.pdf', url: '#' }
            ]
        });

        await cls.save();
        console.log(`[${i+1}/10] Created Class: ${cls.title} (Price: ${cls.price})`);
    }

    console.log('\nSUCCESS: 10 diverse class programs generated with rounds and settings!');
    mongoose.connection.close();
};

seedClasses();
