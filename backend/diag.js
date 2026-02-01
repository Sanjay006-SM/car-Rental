require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const userCount = await User.countDocuments();
        const companyCount = await Company.countDocuments();

        console.log('--- DB Diagnostic ---');
        console.log('User Count:', userCount);
        console.log('Company Count:', companyCount);

        const companies = await Company.find({}, 'companyName email');
        console.log('Registered Companies:', companies);

        const users = await User.find({}, 'name email');
        console.log('Registered Users:', users);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
