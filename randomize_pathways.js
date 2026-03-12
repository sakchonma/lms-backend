/**
 * lms-project/randomize_pathways.js
 * 
 * Randomly adds more sections and courses to existing pathways.
 */

const BASE_URL = 'http://localhost:5000/api';

const adminCredentials = {
    email: 'admin_bulk_seed@example.com',
    password: 'password123'
};

async function randomize() {
    console.log('--- Starting Pathway Randomization Process ---');

    try {
        // 1. Login to get token
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminCredentials)
        });

        const authData = await loginRes.json();
        if (!authData.token) throw new Error('Login failed: ' + authData.message);
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
        };

        // 2. Get all courses and pathways
        const [coursesRes, pathwaysRes] = await Promise.all([
            fetch(`${BASE_URL}/admin/courses`, { headers }),
            fetch(`${BASE_URL}/admin/pathways`, { headers })
        ]);

        const allCourses = await coursesRes.json();
        const allPathways = await pathwaysRes.json();

        if (!allCourses.length || !allPathways.length) {
            console.log('No courses or pathways found to randomize.');
            return;
        }

        console.log(`Found ${allCourses.length} courses and ${allPathways.length} pathways.`);

        // 3. Update each pathway with random sections
        for (const pathway of allPathways) {
            const numSections = Math.floor(Math.random() * 3) + 2; // 2-4 sections
            const newSections = [];

            for (let s = 1; s <= numSections; s++) {
                const numItems = Math.floor(Math.random() * 3) + 2; // 2-4 items per section
                const items = [];
                
                // Pick random unique courses for this section
                const shuffledCourses = [...allCourses].sort(() => 0.5 - Math.random());
                const selectedCourses = shuffledCourses.slice(0, numItems);

                selectedCourses.forEach((course, index) => {
                    items.push({
                        itemType: 'Course',
                        refId: course._id,
                        isMandatory: Math.random() > 0.2, // 80% mandatory
                        order: index + 1
                    });
                });

                newSections.push({
                    title: `Section ${s}: ${pathway.title} Modules`,
                    description: `This section covers intermediate steps in ${pathway.title}.`,
                    duration: 15 + Math.floor(Math.random() * 30),
                    items: items
                });
            }

            // Update via API
            const updateRes = await fetch(`${BASE_URL}/admin/pathways/${pathway._id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    ...pathway,
                    sections: newSections
                })
            });

            if (updateRes.ok) {
                console.log(`✅ Updated Pathway: ${pathway.title} with ${newSections.length} sections.`);
            } else {
                const err = await updateRes.json();
                console.log(`❌ Failed to update ${pathway.title}:`, err.message);
            }
        }

        console.log('\n--- Randomization Completed ---');

    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}

randomize();
