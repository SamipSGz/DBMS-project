const express = require('express');
const router = express.Router();

module.exports = (db) => {


    router.get('/test', (req, res) => {
        res.json({ message: 'API is working!' });
    });

    // User login route
    router.post('/login', (req, res) => {
        const { username, password } = req.body;
        // Add your login logic here
        res.send('User login');
    });

    // User registration route
    router.post('/register', (req, res) => {
        const { username, password } = req.body;
        // Add your registration logic here
        res.send('User registration');
    });

    return router;
};