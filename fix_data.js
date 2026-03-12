require('dotenv').config();
const mongoose = require('mongoose');
const Pathway = require('./src/models/Pathway');
const Course = require('./src/models/Course');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db';

async function fixData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        const courses = await Course.find();
        if (courses.length === 0) {
            console.log('No courses found in the database. Please seed courses first.');
            process.exit(1);
        }

        const pathways = await Pathway.find();
        console.log(`Found ${pathways.length} pathways to update.`);

        for (const pathway of pathways) {
            const numSections = Math.floor(Math.random() * 2) + 2; // 2 to 3 sections
            const sections = [];

            for (let i = 1; i <= numSections; i++) {
                const numItems = Math.floor(Math.random() * 3) + 2; // 2 to 4 items
                const items = [];
                
                // Shuffle courses and pick first numItems
                const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());
                const selectedCourses = shuffledCourses.slice(0, Math.min(numItems, courses.length));

                selectedCourses.forEach((course, index) => {
                    items.push({
                        itemType: 'Course',
                        refId: course._id,
                        isMandatory: true,
                        order: index
                    });
                });

                sections.push({
                    title: `Section ${i}: ${pathway.title} Deep Dive`,
                    description: `This section covers essential topics for ${pathway.title}.`,
                    duration: 30,
                    items: items
                });
            }

            pathway.sections = sections;
            await pathway.save();
            console.log(`Updated pathway: ${pathway.title} (${pathway._id})`);
        }

        console.log('Data fix completed successfully.');
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error during data fix:', error);
        process.exit(1);
    }
}

fixData();
