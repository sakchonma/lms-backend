require('dotenv').config();
const mongoose = require('mongoose');
const Pathway = require('./src/models/Pathway');
const Course = require('./src/models/Course');
const Section = require('./src/models/Section');
const Lesson = require('./src/models/Lesson');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db';

async function clearCurriculum() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // 1. Clear sections from all Pathways
        const pathResult = await Pathway.updateMany({}, { $set: { sections: [] } });
        console.log(`✅ Cleared sections from ${pathResult.matchedCount} Pathways.`);

        // 2. Clear sections from all Courses
        const courseResult = await Course.updateMany({}, { $set: { sections: [] } });
        console.log(`✅ Cleared sections from ${courseResult.matchedCount} Courses.`);

        // 3. Delete all Section documents
        const sectionDel = await Section.deleteMany({});
        console.log(`✅ Deleted ${sectionDel.deletedCount} Section documents.`);

        // 4. Delete all Lesson documents
        const lessonDel = await Lesson.deleteMany({});
        console.log(`✅ Deleted ${lessonDel.deletedCount} Lesson documents.`);

        console.log('\n--- Curriculum Data Cleared Successfully ---');
        await mongoose.connection.close();
    } catch (error) {
        console.error('💥 Error during clearing data:', error);
        process.exit(1);
    }
}

clearCurriculum();
