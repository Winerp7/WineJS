const mongoose = require('mongoose');
const User = mongoose.model('User');
const { makeChart, makeLine, makePie, makeCanvas, draw } = require('../util/canni'); 


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
  res.render('signup', { pageTitle: 'Sign up', path: '/signup'});
};

exports.directDashboard = async (req, res, next) => {
  const Line = await makeLine();
  const Pie = await makePie();
  const Chart = await makeChart();
  const Canvas =  await makeCanvas;
  const Draw = await draw();

  res.render('dashboard', { pageTitle: 'Dashboard', path: '/dashboard', chart: Chart, line: Line, pie: Pie, canvas: Canvas, draw: Draw});
};

exports.directAddDevice = (req, res, next) => {
  res.render('add-device', { pageTitle: 'Add Device', path: '/add-device'});
};

exports.directSettings = (req, res, next) => {
  res.render('settings', { pageTitle: 'Settings', path: '/settings'});
};