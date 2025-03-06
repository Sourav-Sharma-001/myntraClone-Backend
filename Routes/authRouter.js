const { signup, login } = require('../Controls/authController');
const { signupValidation, loginValidation } = require('../middleware/authValidation');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

module.exports = router;