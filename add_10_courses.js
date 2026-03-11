const BASE_URL = 'http://localhost:5000/api';

async function addCourses() {
    try {
        console.log('--- Adding 10 More Courses ---');

        // 1. Login to get Token
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin_auto@example.com', password: 'password123' })
        });
        const authData = await loginRes.json();
        const token = authData.token;

        if (!token) {
            throw new Error('Failed to obtain token. Make sure admin_auto@example.com exists.');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 2. Data for 10 Courses
        const newCourses = [
            { title: 'JavaScript Advanced Concepts', desc: 'Closures, Prototypes, and Async patterns.', status: 'publish' },
            { title: 'CSS Grid & Flexbox Mastery', desc: 'Building complex layouts with ease.', status: 'publish' },
            { title: 'MongoDB Basics', desc: 'NoSQL database design and queries.', status: 'publish' },
            { title: 'Express.js Deep Dive', desc: 'Middleware, Routing, and Security.', status: 'publish' },
            { title: 'TypeScript for React', desc: 'Type-safe React components development.', status: 'publish' },
            { title: 'Next.js Essentials', desc: 'Server-side rendering and static generation.', status: 'publish' },
            { title: 'Python for Data Science', desc: 'Pandas, NumPy and data visualization.', status: 'publish' },
            { title: 'UI/UX Design Principles', desc: 'Design thinking and user-centric interfaces.', status: 'publish' },
            { title: 'Git & GitHub Mastery', desc: 'Version control and collaboration workflows.', status: 'publish' },
            { title: 'Docker for Developers', desc: 'Containerization and microservices basics.', status: 'publish' }
        ];

        for (const course of newCourses) {
            const res = await fetch(`${BASE_URL}/admin/courses`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    ...course,
                    image: '' // Will use the "No Image" placeholder
                })
            });
            const data = await res.json();
            console.log(`✅ Created: ${data.title}`);
        }

        console.log('--- All 10 courses added! ---');
        console.log('Note: These courses are not yet assigned to any user.');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

addCourses();
