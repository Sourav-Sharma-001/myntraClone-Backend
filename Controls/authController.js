const userModel = require('../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const signup = async (req, res) => {
    try {
        const { name, password, email } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, password: hashedPassword, email });
        await newUser.save();

        res.status(201).json({ message: 'Signup successful', success: true });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const login = async (req, res) => {
    try {
        const { password, email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(403).json({ message: 'Email or password is wrong', success: false });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: 'Email or password is wrong', success: false });
        }

        if (!process.env.SECRET_KEY) {
            console.error('SECRET_KEY is not defined in environment variables');
            return res.status(500).json({ message: 'Internal server error', success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            message: 'Login successful', 
            success: true, 
            jwtToken: jwtToken,
            email, 
            name: user.name 
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

module.exports = { signup, login };
