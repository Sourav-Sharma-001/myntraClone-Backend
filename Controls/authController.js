const userModel = require('../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const user = await userModel.findOne({ email });
        if(user) {
            return res.send(409).json({ message: 'User already exists', sucess: false });
        }
        const newUserModel = new userModel({ name, password, email });
        newUserModel.password = await bcrypt.hash(password, 10);
        await newUserModel.save();
        res.status(201).json({ message: 'Signup successful', sucess: true });
    } catch (err) {
        res.status(500).json({ message: 'Internal serverf error', sucess: false });
    } 
}

const login = async (req, res) => {
    try {
        const { password, email } = req.body;
        const user = await userModel.findOne({ email });
        const errorMessage = 'email or password is wrong'
        if(!user) {
            return res.send(403).json({ message: errorMessage, sucess: false });
        }
        const isPassequal = await bcrypt.compare(password, user.password);
        if(!isPassequal) {
            return res.send(403).json({ message: errorMessage, sucess: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id},
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        )
        res.status(200).json({ message: 'Login successful', sucess: true, jwtToken, email, name: user.name});
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', sucess: false });
    } 
}

module.exports = {
    signup,
    login
}