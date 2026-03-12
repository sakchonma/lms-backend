require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db';

async function clearUserData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Update all users to empty their course-related arrays
        const result = await User.updateMany({}, {
            $set: {
                myCourses: [],
                pendingCourses: [],
                pendingPathways: [],
                completedCourses: []
            }
        });

        console.log(`Successfully cleared data for ${result.matchedCount} users.`);
        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('Error during clearing data:', error);
        process.exit(1);
    }
}

clearUserData();
