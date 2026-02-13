const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to verify JWT (simplified)
const auth = (req, res, next) => {
    next();
};

router.get('/freelancers', auth, async (req, res) => {
    try {
        const result = await db.query("SELECT id, email, role FROM users WHERE role = 'freelancer'");
        // Also fetch profile names if available
        const profiles = await db.query("SELECT user_id, full_name, mpesa_phone FROM freelancer_profiles");

        const freelancers = result.rows.map(user => {
            const profile = profiles.rows.find(p => p.user_id === user.id);
            return {
                id: user.id,
                email: user.email,
                name: profile ? profile.full_name : 'Unknown',
                mpesaPhone: profile ? profile.mpesa_phone : ''
            };
        });

        res.json(freelancers);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
