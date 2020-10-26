const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'succes',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}

exports.directSignup = (req, res, next) => {
  res.render('signup', { pageTitle: 'Sign up'});
};

exports.directDashboard = (req, res, next) => {
  res.render('dashboard', { pageTitle: 'Dashboard', path: '/dashboard'});
};

exports.directAddDevice = (req, res, next) => {
  res.render('add-device', { pageTitle: 'Add Device', path: '/add-device'});
};