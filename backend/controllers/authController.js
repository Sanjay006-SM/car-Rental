const User = require('../models/User');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/users/register
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`Login attempt for user: ${email}`);
        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new company
// @route   POST /api/companies/register
exports.registerCompany = async (req, res) => {
    const { companyName, email, phone, password, address } = req.body;

    try {
        const companyExists = await Company.findOne({ email });
        if (companyExists) {
            return res.status(400).json({ message: 'Company already exists' });
        }

        const company = await Company.create({
            companyName,
            email,
            phone,
            password,
            address
        });

        if (company) {
            res.status(201).json({
                _id: company._id,
                companyName: company.companyName,
                email: company.email,
                token: generateToken(company._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth company & get token
// @route   POST /api/companies/login
exports.loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`Login attempt for company: ${email}`);
        const company = await Company.findOne({ email }).select('+password');
        if (company && (await company.matchPassword(password))) {
            res.json({
                _id: company._id,
                companyName: company.companyName,
                email: company.email,
                token: generateToken(company._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
