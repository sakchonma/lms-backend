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
    { title: 'Learn HTML in 15 Minutes', url: 'https://www.youtube.com/watch?v=kUMe1FH4CHE' },
    { title: 'CSS Crash Course', url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU' },
    { title: 'JavaScript Full Course', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk' },
    { title: 'Data Structures and Algorithms', url: 'https://www.youtube.com/watch?v=8hly31xKli0' },
    { title: 'React JS Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y' },
    { title: 'Node.js Express Tutorial', url: 'https://www.youtube.com/watch?v=7S_tz1z_5bA' },
    { title: 'MongoDB Crash Course', url: 'https://www.youtube.com/watch?v=ExcRbPa4reY' },
    { title: 'Python for Beginners', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc' },
    { title: 'Docker Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=pTFZFxd4hZ0' },
    { title: 'Kubernetes Crash Course', url: 'https://www.youtube.com/watch?v=s_o8dwzRlu4' }
];

const courseTopics = [
    'Advanced Web Development', 'Machine Learning Basics', 'Data Science with Python',
    'Mobile UX Design', 'Cybersecurity Essentials', 'Blockchain Fundamentals',
    'Digital Marketing 101', 'Business Analytics', 'Cloud Architecture',
    'Full Stack Development', 'Introduction to IoT', 'Graphic Design Principles',
    'Project Management Pro', 'Agile Methodologies', 'Software Testing QA',
    'Network Security', 'Database Management Systems', 'Java Programming Mastery',
    'C++ for Game Development', 'Go Language for Backend'
];

const seedData = async () => {
    await connectDB();

    console.log('Starting to seed 20 courses with detailed settings...');

    for (let i = 0; i < 20; i++) {
        const courseTitle = courseTopics[i] || `New Course ${i + 1}`;
        const courseCode = `CRS-BULK-V2-${1000 + i}`;

        const course = new Course({
            courseCode,
            title: courseTitle,
            description: `This is a comprehensive course about ${courseTitle}. It covers all the essential topics and practical applications.`,
            level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
            instructor: `Instructor ${i + 1}`,
            category: 'Technology',
            image: `https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80&idx=${i}`,
            status: 'publish',
            isMandatory: Math.random() > 0.8,
            
            // From Page 5: Price
            price: [0, 990, 1500, 2900, 4500][Math.floor(Math.random() * 5)],
            
            // From Page 6: Enrollment Settings
            enrollmentSettings: {
                formType: Math.random() > 0.5 ? 'Standard' : 'Custom',
                period: {
                    status: ['Open', 'Closed', 'Scheduled'][Math.floor(Math.random() * 3)],
                    start: new Date(),
                    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days later
                },
                quota: [0, 20, 50, 100][Math.floor(Math.random() * 4)], // 0 = Unlimited
                allowReEnrollAfterReject: Math.random() > 0.5,
                approvalRequired: Math.random() > 0.5,
                allowCancellation: Math.random() > 0.5
            }
        });

        await course.save();
        console.log(`Created Course: ${course.title} (Price: ${course.price})`);

        const numSections = Math.floor(Math.random() * 2) + 1; // 1 or 2 sections
        for (let s = 1; s <= numSections; s++) {
            const section = new Section({
                courseId: course._id,
                title: `Section ${s}: Getting Started with ${courseTitle}`,
                priority: s
            });
            await section.save();
            
            // Link section to course
            await Course.findByIdAndUpdate(course._id, { $push: { sections: section._id } });

            const numLessons = Math.floor(Math.random() * 2) + 2; // 2 or 3 lessons
            for (let l = 1; l <= numLessons; l++) {
                const video = youtubeVideos[Math.floor(Math.random() * youtubeVideos.length)];
                const lesson = new Lesson({
                    sectionId: section._id,
                    title: `${video.title} - Part ${l}`,
                    type: 'YouTube',
                    url: video.url,
                    priority: l
                });
                await lesson.save();

                // Link lesson to section
                await Section.findByIdAndUpdate(section._id, { $push: { lessons: lesson._id } });
            }
            console.log(`  Added Section ${s} with ${numLessons} YouTube lessons`);
        }
    }

    console.log('Successfully seeded 20 courses with full settings and content!');
    mongoose.connection.close();
};

seedData();
