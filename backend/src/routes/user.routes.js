const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, requireRole } = require('../middleware/auth');

router.get('/freelancers', auth(), requireRole('client', 'admin'), async (req, res) => {
    try {
        const result = await db.query("SELECT id, email, role FROM users WHERE role = 'freelancer'");
        const profiles = await db.query("SELECT user_id, full_name, mpesa_phone, skills FROM freelancer_profiles");

        const freelancers = result.rows.map((user) => {
            const profile = profiles.rows.find((p) => p.user_id === user.id);
            return {
                id: user.id,
                email: user.email,
                role: user.role,
                name: profile ? profile.full_name : 'Unknown',
                mpesaPhone: profile ? profile.mpesa_phone : '',
                skills: profile ? profile.skills : []
            };
        });

        res.json(freelancers);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

router.get('/me', auth(), async (req, res) => {
    try {
        const userResult = await db.query('SELECT id, email, role FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult.rows[0];

        if (user.role === 'client') {
            const profileRes = await db.query('SELECT full_name, company_name, currency_preference FROM client_profiles WHERE user_id = $1', [user.id]);
            return res.json({ user, profile: profileRes.rows[0] || null });
        }

        if (user.role === 'freelancer') {
            const profileRes = await db.query('SELECT full_name, mpesa_phone, wallet_address, bio, skills, verified, kyc_status FROM freelancer_profiles WHERE user_id = $1', [user.id]);
            return res.json({ user, profile: profileRes.rows[0] || null });
        }

        return res.json({ user, profile: null });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

router.put('/me/profile', auth(), async (req, res) => {
    try {
        const { role, id } = req.user;

        if (role === 'client') {
            const { fullName, companyName, currencyPreference } = req.body;
            const result = await db.query(
                `UPDATE client_profiles 
         SET full_name = COALESCE($1, full_name),
             company_name = COALESCE($2, company_name),
             currency_preference = COALESCE($3, currency_preference),
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $4
         RETURNING *`,
                [fullName, companyName, currencyPreference, id]
            );
            return res.json(result.rows[0]);
        }

        if (role === 'freelancer') {
            const { fullName, mpesaPhone, walletAddress, bio, skills } = req.body;
            const result = await db.query(
                `UPDATE freelancer_profiles 
         SET full_name = COALESCE($1, full_name),
             mpesa_phone = COALESCE($2, mpesa_phone),
             wallet_address = COALESCE($3, wallet_address),
             bio = COALESCE($4, bio),
             skills = COALESCE($5, skills),
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $6
         RETURNING *`,
                [fullName, mpesaPhone, walletAddress, bio, skills, id]
            );
            return res.json(result.rows[0]);
        }

        return res.status(400).json({ message: 'Profile update not supported for this role' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
