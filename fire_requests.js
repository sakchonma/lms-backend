const BASE_URL = 'http://localhost:5000/api';

async function fire() {
    try {
        console.log('--- Starting API Requests ---');

        // 1. Register Admin
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin_auto',
                password: 'password123',
                email: 'admin_auto@example.com',
                firstName: 'Auto',
                lastName: 'Admin',
                role: 'admin'
            })
        });
        let authData = await regRes.json();
        
        // If already exists, just login
        if (regRes.status !== 201) {
            const loginRes = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'admin_auto@example.com', password: 'password123' })
            });
            authData = await loginRes.json();
        }

        const token = authData.token;
        console.log('Auth Token obtained.');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 2. Create 3 Courses
        const courseTitles = ['Node.js Foundation', 'React Modern Web', 'Fullstack Deployment'];
        const courseIds = [];

        for (const title of courseTitles) {
            const res = await fetch(`${BASE_URL}/admin/courses`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    title,
                    description: `Mastering ${title}`,
                    status: 'publish',
                    image: 'https://via.placeholder.com/300x150'
                })
            });
            const data = await res.json();
            courseIds.push(data._id);
            console.log(`Created Course: ${title} (${data._id})`);
        }

        // 3. Create 3 Classes
        const classNames = ['Morning Batch', 'Evening Batch', 'Weekend Intensive'];
        for (let i = 0; i < 3; i++) {
            const res = await fetch(`${BASE_URL}/admin/classes`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    title: classNames[i],
                    course: courseIds[i],
                    schedule: 'Flexible Timing'
                })
            });
            const data = await res.json();
            console.log(`Created Class: ${classNames[i]}`);
        }

        // 4. Create 3 Pathways
        const pathways = [
            { title: 'Fullstack Roadmap', desc: 'Node -> React -> Deployment', ids: [courseIds[0], courseIds[1], courseIds[2]] },
            { title: 'Frontend Specialist', desc: 'Just React focus', ids: [courseIds[1]] },
            { title: 'Backend Mastery', desc: 'Node -> Deployment', ids: [courseIds[0], courseIds[2]] }
        ];

        for (const p of pathways) {
            const res = await fetch(`${BASE_URL}/admin/pathways`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    title: p.title,
                    description: p.desc,
                    courses: p.ids.map((id, index) => ({ courseId: id, order: index + 1 }))
                })
            });
            console.log(`Created Pathway: ${p.title}`);
        }

        console.log('--- All requests completed successfully! ---');
    } catch (error) {
        console.error('Error firing requests:', error.message);
        console.log('Make sure your backend server is running on http://localhost:5000');
    }
}

fire();
