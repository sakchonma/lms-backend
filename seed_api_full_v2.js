/**
 * lms-project/seed_api_full_v2.js
 * 
 * Seeds 10 Courses, 10 Classes, and 10 Pathways via REST API.
 */

const BASE_URL = 'http://localhost:5000/api';

const adminCredentials = {
    email: 'admin_bulk_seed@example.com',
    password: 'password123',
    username: 'admin_bulk',
    firstName: 'Bulk',
    lastName: 'Seeder',
    role: 'admin'
};

async function seed() {
    console.log('--- Starting Bulk API Seed Process (10 items each) ---');

    try {
        // 1. Register (ignore error if already exists)
        await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminCredentials)
        });

        // 2. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: adminCredentials.email, password: adminCredentials.password })
        });

        const authData = await loginRes.json();
        if (!authData.token) throw new Error('Login failed: ' + authData.message);
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
        };
        console.log('Token acquired.');

        // 3. Create 10 Courses
        console.log('\n--- Creating 10 Courses ---');
        const createdCourses = [];
        const courseTopics = [
            'JavaScript Mastery', 'React for Pros', 'Node.js Backend', 
            'Database Design', 'Cloud Computing', 'UI/UX Design', 
            'DevOps Fundamentals', 'Mobile App Development', 'Cyber Security', 'AI & Machine Learning'
        ];

        for (let i = 0; i < 10; i++) {
            const res = await fetch(`${BASE_URL}/admin/courses`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    courseCode: `CRS-PRO-${100 + i}-${Math.floor(Math.random() * 1000)}`,
                    title: courseTopics[i],
                    description: `Comprehensive guide to ${courseTopics[i]}. Full curriculum included.`,
                    image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&idx=${i}`,
                    level: i % 3 === 0 ? 'Advanced' : 'Beginner',
                    status: 'publish'
                })
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`✅ Course ${i+1} Created: ${data.title}`);
                createdCourses.push(data);
            } else {
                console.log(`❌ Course ${i+1} Failed: ${res.status} - ${JSON.stringify(data)}`);
            }
        }

        // 4. Create 10 Classes
        console.log('\n--- Creating 10 Classes ---');
        for (let i = 1; i <= 10; i++) {
            const courseIndex = (i - 1) % createdCourses.length;
            const courseId = createdCourses[courseIndex]._id;
            const res = await fetch(`${BASE_URL}/admin/classes`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    classCode: `CLS-B${i}-${Math.floor(Math.random() * 1000)}`,
                    title: `Batch ${i}: ${courseTopics[courseIndex]} Live`,
                    course: courseId,
                    level: i % 2 === 0 ? 'Intermediate' : 'Beginner',
                    instructor: `Expert Instructor ${i}`,
                    image: `https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80&idx=${i}`,
                    rounds: [{ 
                        title: 'Kick-off Session', 
                        type: 'Class',
                        start: new Date().toISOString(), 
                        end: new Date(Date.now() + 3600000).toISOString(), 
                        location: 'Zoom Meeting' 
                    }]
                })
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`✅ Class ${i} Created: ${data.title}`);
            } else {
                console.log(`❌ Class ${i} Failed: ${res.status} - ${JSON.stringify(data)}`);
            }
        }

        // 5. Create 10 Pathways
        console.log('\n--- Creating 10 Pathways ---');
        for (let i = 1; i <= 10; i++) {
            const c1 = createdCourses[(i - 1) % createdCourses.length]._id;
            const c2 = createdCourses[i % createdCourses.length]._id;

            const res = await fetch(`${BASE_URL}/admin/pathways`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    pathwayCode: `PATH-LVL-${i}-${Math.floor(Math.random() * 1000)}`,
                    title: `Professional Roadmap ${i}`,
                    description: `Structured path to master multiple skills.`,
                    image: `https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80&idx=${i}`,
                    level: 'Advanced',
                    sections: [{
                        title: 'Module A',
                        items: [
                            { itemType: 'Course', refId: c1, order: 1 },
                            { itemType: 'Course', refId: c2, order: 2 }
                        ]
                    }],
                    status: 'publish'
                })
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`✅ Pathway ${i} Created: ${data.title}`);
            } else {
                console.log(`❌ Pathway ${i} Failed: ${res.status} - ${JSON.stringify(data)}`);
            }
        }

        console.log('\n--- Bulk Seeding Completed Successfully ---');

    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}

seed();
