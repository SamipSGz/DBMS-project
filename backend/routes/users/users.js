const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

module.exports = (db) => {
    router.get('/test', (req, res) => {
        res.json({ message: 'Users API is working!' });
    });

    // User signup route
    router.post('/register', async (req, res) => {
        const { email, password, role } = req.body;
        console.log(email);

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            // Check if user already exists
            const [existingUsers] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            await db.query(
                'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
                [email, hashedPassword, role]
            );

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    // User login route
    router.post('/login', async (req, res) => {
        console.log("Logging in");
        const { email, password } = req.body;
        console.log(email);

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            console.log("Getting user from database");

            // Get user from database
            const [rows] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (!rows || rows.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = rows[0];

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                "secret",
                { expiresIn: '24h' }
            );

            // Send token to the frontend for them to store
            res.json({ message: 'Login successful', token, role: user.role });

            // res.json({ message: 'Login successful', token, role: user.role });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    return router;
};
